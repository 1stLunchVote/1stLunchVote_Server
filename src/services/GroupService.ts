import { GroupResponseDto } from '../interfaces/group/response/GroupResponseDto';
import PushAlarmService from './PushAlarmService';
import Group from '../models/Group';
import LunchTemplate from '../models/LunchTemplate';
import User from '../models/User';
import responseMessage from '../modules/responseMessage';
import { MemberInfoResponseDto } from '../interfaces/user/response/MemberInfoResponseDto';
import { VoteResponseDto } from '../interfaces/group/response/VoteResponseDto';
import { VoteStatusResponseDto } from '../interfaces/group/response/VoteStatusResponseDto';
import { MenuInfoList } from '../interfaces/menu/MenuInfoList';
import Menu from '../models/Menu';
import { MenuInfo } from '../interfaces/menu/MenuInfo';
import { LikesOrDislikesMenuRequestDto } from '../interfaces/lunchTemplate/request/LikesOrDislikesMenuRequestDto';

const postGroup = async (userId: string): Promise<GroupResponseDto | string> => {
  try {
    const captain = await User.findById(userId);
    if (!captain) {
      return responseMessage.NO_USER;
    }

    const group = new Group({
      members: [userId],
      votedMembers: [],
      likesMenu: [],
      dislikesMenu: [],
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

const getGroup = async (groupId: string): Promise<GroupResponseDto | string> => {
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

const withdrawGroup = async (groupId: string, userId: string): Promise<null | string> => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return responseMessage.NO_GROUP;
    }
    const user = await User.findById(userId);
    if (!user) {
      return responseMessage.NO_USER;
    } else if (!group.members.includes(user._id)) {
      return responseMessage.NOT_IN_GROUP;
    }

    group.members = group.members.filter((member) => member.toString() != userId.toString());
    group.save();

    return null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const firstVote = async (groupId: string, userId: string, likesAndDislikes: LikesOrDislikesMenuRequestDto): Promise<VoteResponseDto | string> => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return responseMessage.NO_GROUP;
    }
    const user = await User.findById(userId);
    if (!user) {
      return responseMessage.NO_USER;
    }
    if (group.votedMembers.includes(user._id)) {
      return responseMessage.ALREADY_VOTED;
    }

    group.votedMembers.push(user._id);
    group.likesMenu.push(...likesAndDislikes.likesMenu);
    group.dislikesMenu.push(...likesAndDislikes.dislikesMenu);
    await group.save();

    const data: VoteResponseDto = {
      count: group.votedMembers.length
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

    if (group.votedMembers.length !== group.members.length) {
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
      path: 'likesMenu dislikesMenu'
    });
    if (!group) {
      return responseMessage.NO_GROUP;
    }

    const likesMenuExceptOverlap = new Set(group.likesMenu);
    const dislikesMenuExceptOverlap = new Set(group.dislikesMenu);
    for (const i of dislikesMenuExceptOverlap) {
      for (const j of likesMenuExceptOverlap) {
        if (i.toString() == j.toString()) {
          console.log(i);
          likesMenuExceptOverlap.delete(j);
          break;
        }
      }
    }
    const menuInfos: MenuInfo[] = await Promise.all(
      [...likesMenuExceptOverlap].map(async (menu: any) => {
        const result: MenuInfo = {
          menuId: menu._id,
          menuName: menu.menuName,
          image: menu.image
        }
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
      const hasValue = menuMap.get(group.menus[i].toString());
      if (hasValue) {
        menuMap.set(group.menus[i].toString(), hasValue + 1);
      } else {
        menuMap.set(group.menus[i].toString(), 1);
      }
    }
    let mode = 1;
    for (const [key, value] of menuMap) {
      if (value >= mode) {
        mode = value;
      }
    }

    const menus = [];
    for (const [key, value] of menuMap) {
      if (value === mode) {
        menus.push(key);
      }
    }

    const modeMenu = menus[Math.floor(Math.random() * menus.length)];

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
  withdrawGroup,
  firstVote,
  getFirstVoteStatus,
  getFirstVoteResult,
  secondVote,
  getSecondVoteStatus,
  getSecondVoteResult,
};

export default GroupService;
