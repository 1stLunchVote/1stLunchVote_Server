import { GroupResponseDto } from '../interfaces/group/response/GroupResponseDto';
import { GetLunchTemplateResponseDto } from '../interfaces/lunchTemplate/response/GetLunchTemplateResponseDto';
import { UserInfo } from '../interfaces/user/UserInfo';
import PushAlarmService from './PushAlarmService';
import Group from '../models/Group';
import LunchTemplate from '../models/LunchTemplate';
import User from '../models/User';
import responseMessage from '../modules/responseMessage';
import { MemberInfoResponseDto } from '../interfaces/user/response/MemberInfoResponseDto';
import { VoteResponseDto } from '../interfaces/group/response/VoteResponseDto';
import { VoteStatusResponseDto } from '../interfaces/group/response/VoteStatusResponseDto';
import { MenuInfoList } from '../interfaces/menu/MenuInfoList';
import { LunchTemplateInfo } from '../interfaces/lunchTemplate/LunchTemplateInfo';
import mongoose, { MongooseBulkWriteOptions } from 'mongoose';
import Menu from '../models/Menu';
import { MenuInfo } from '../interfaces/menu/MenuInfo';

const postGroup = async (userId: string): Promise<GroupResponseDto | string> => {
  try {
    const captain = await User.findById(userId);
    if (!captain) {
      return responseMessage.NO_USER;
    }

    const group = new Group({
      members: [userId],
      templates: [],
      menus: [],
    });
    group.save();

    const captainInfo: MemberInfoResponseDto = {
      email: captain.email,
      nickname: captain.nickname,
      profileImage: captain.profileImage
    };
    const members: MemberInfoResponseDto[] = [captainInfo];

    const data: GroupResponseDto = {
      groupId: group._id,
      members: members,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const inviteMember = async (groupId: string, userId: string, email: string): Promise<MemberInfoResponseDto | string> => {
  try {
    const captain = await User.findById(userId);
    if (!captain) {
      return responseMessage.NO_USER;
    }

    const member = await User.findOne({ email: email });
    if (!member) {
      return responseMessage.NO_USER;
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return responseMessage.NO_GROUP;
    }
    if (group.members.includes(member._id)) {
      return responseMessage.ALREADY_IN_GROUP;
    }

    const data: MemberInfoResponseDto = {
      email: member.email,
      nickname: member.nickname,
      profileImage: member.profileImage,
    };

    await PushAlarmService.pushAlarm(member.fcmToken, captain.nickname, groupId);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const joinGroup = async (userId: string, groupId: string): Promise<GroupResponseDto | string> => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return responseMessage.NO_GROUP;
    }
    const user = await User.findById(userId);
    if (!user) {
      return responseMessage.NO_USER;
    }
    if (group.members.includes(user._id)) {
      return responseMessage.ALREADY_IN_GROUP;
    }

    group.members.push(user._id);
    console.log(group.members);
    await group.save();

    const members = await Promise.all(
      group.members.map(async (memberId) => {
        const user = await User.findById(memberId);
        if (!user) {
          throw Error;
        }
        const result: MemberInfoResponseDto = {
          email: user.email,
          nickname: user.nickname,
          profileImage: user.profileImage
        }
        return result;
      })
    );

    const data: GroupResponseDto = {
      groupId: group._id,
      members: members
    } 

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getGroup = async (userId: string, groupId: string): Promise<GroupResponseDto | string> => {
  try {
    const group = await Group.findById(groupId).populate({
      path: "members",
      model: "User"
    });
    if (!group) {
      return responseMessage.NO_GROUP;
    }
    const members = await Promise.all(
      group.members.map(async (member) => {
        const user: any = member;
        const result: MemberInfoResponseDto = {
          email: user.email,
          nickname: user.nickname,
          profileImage: user.profileImage,
        };
        return result;
      }),
    );

    const data: GroupResponseDto = {
      groupId: group._id,
      members: members
    }
    return data;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

const firstVote = async (groupId: string, templateId: string): Promise<VoteResponseDto | string> => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return responseMessage.NO_GROUP;
    }
    const template = await LunchTemplate.findById(templateId);
    if (!template) {
      return responseMessage.NO_TEMPLATE;
    } else if (group.templates.includes(template._id)) {
      return responseMessage.ALREADY_VOTED;
    }

    group.templates.push(template._id);
    await group.save();

    const data: VoteResponseDto = {
      count: group.templates.length
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getFirstVoteStatus = async (groupId: string): Promise<VoteStatusResponseDto | string> => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return responseMessage.NO_GROUP;
    }

    if (group.templates.length !== group.members.length) {
      const data: VoteStatusResponseDto = {
        finish: false
      }
      return data;
    } else {
      const data: VoteStatusResponseDto = {
        finish: true
      }
      return data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getFirstVoteResult = async (groupId: string): Promise<MenuInfoList | string> => {
  try {
    const group = await Group.findById(groupId).populate({
      path: 'templates'
    });
    if (!group) {
      return responseMessage.NO_GROUP;
    }

    const likesMenu: any[] = [];
    group.templates.forEach((templateId) => {
      const template: any = templateId;
      likesMenu.push(...template.likesMenu.map((menu: any) => menu.toString()));
    });
    let likesMenuExceptOverlap = [...new Set(likesMenu)];
    group.templates.forEach((templateId) => {
      const template: any = templateId;
      for (const i in template.dislikesMenu) {
        likesMenuExceptOverlap = likesMenuExceptOverlap
          .filter((element: string) => element !== template.dislikesMenu[i].toString());
      }
    });
    const menuInfos: MenuInfo[] = await Promise.all(
      likesMenuExceptOverlap.map(async (menuId: any) => {
        const menu = await Menu.findById(menuId);
        if (!menu) {
          throw Error;
        }
        const result: MenuInfo = {
          menuId: menuId,
          menuName: menu.menuName,
          image: menu.image
        };
        return result;
      })
    );

    const data: MenuInfoList = {
      menuInfos: menuInfos
    }
    
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const secondVote = async (groupId: string, menuId: string): Promise<VoteResponseDto | string> => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return responseMessage.NO_GROUP;
    }
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return responseMessage.NO_MENU;
    }

    group.menus.push(menu._id);
    await group.save();

    const data: VoteResponseDto = {
      count: group.menus.length,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getSecondVoteStatus = async (groupId: string): Promise<VoteStatusResponseDto | string> => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return responseMessage.NO_GROUP;
    }

    if (group.menus.length !== group.members.length) {
      const data: VoteStatusResponseDto = {
        finish: false,
      };
      return data;
    } else {
      const data: VoteStatusResponseDto = {
        finish: true,
      };
      return data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getSecondVoteResult = async (groupId: string): Promise<MenuInfo | string> => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return responseMessage.NO_GROUP;
    }

    const menuMap = new Map();
    for (const i in group.menus) {
      const hasValue = menuMap.get(group.menus[i]);
      if (hasValue) {
        menuMap.set(group.menus[i].toString(), hasValue + 1);
      } {
        menuMap.set(group.menus[i].toString(), 1);
      }
    }
    let modeMenu = null;
    let mode = 1;
    for (const [key, value] of menuMap) {
      if (value >= mode) {
        mode = value;
        modeMenu = key;
      }
    }

    const menu = await Menu.findById(modeMenu);
    if (!menu) {
      return responseMessage.NO_MENU;
    }

    const data: MenuInfo = {
      menuId: menu._id,
      menuName: menu.menuName,
      image: menu.image
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const GroupService = {
  postGroup,
  inviteMember,
  joinGroup,
  getGroup,
  firstVote,
  getFirstVoteStatus,
  getFirstVoteResult,
  secondVote,
  getSecondVoteStatus,
  getSecondVoteResult,
};

export default GroupService;
