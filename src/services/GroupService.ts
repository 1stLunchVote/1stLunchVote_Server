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

const postGroup = async (userId: string): Promise<GroupResponseDto | string> => {
  try {
    const captain = await User.findById(userId);
    if (!captain) {
      return responseMessage.NO_USER;
    }

    const group = new Group({
      members: [userId],
      templates: [],
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

const inviteMember = async (groupId: string, email: string): Promise<MemberInfoResponseDto | string> => {
  try {
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

    await PushAlarmService.pushAlarm(member.fcmToken, member.nickname, groupId);

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

const GroupService = {
  postGroup,
  inviteMember,
  joinGroup,
  getGroup,
  firstVote,
};

export default GroupService;
