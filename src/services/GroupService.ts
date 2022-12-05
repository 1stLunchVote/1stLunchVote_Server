import { PostGroupResponseDto } from '../interfaces/group/response/PostGroupResponseDto';
import { GetLunchTemplateResponseDto } from '../interfaces/lunchTemplate/response/GetLunchTemplateResponseDto';
import { UserInfo } from '../interfaces/user/UserInfo';
import PushAlarmService from './PushAlarmService';
import Group from '../models/Group';
import LunchTemplate from '../models/LunchTemplate';
import User from '../models/User';
import responseMessage from '../modules/responseMessage';

const postGroup = async (userId: string): Promise<PostGroupResponseDto | string> => {
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

    const captainInfo: UserInfo = {
      email: captain.email,
      nickname: captain.nickname,
      profileImage: captain.profileImage,
      fcmToken: captain.fcmToken,
    };
    const members: UserInfo[] = [captainInfo];

    const data: PostGroupResponseDto = {
      groupId: group._id,
      members: members,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const inviteMember = async (groupId: string, email: string): Promise<UserInfo | string> => {
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

    group.members.push(member._id);
    await group.save();

    const data: UserInfo = {
      email: member.email,
      nickname: member.nickname,
      profileImage: member.profileImage,
      fcmToken: member.fcmToken,
    };

    await PushAlarmService.pushAlarm(member.fcmToken, member.nickname, groupId);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const joinGroup = async (userId: string, groupId: string): Promise<null | string> => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return responseMessage.NO_GROUP;
    }
    const user = await User.findById(userId);
    if (!user) {
      return responseMessage.NO_USER;
    }
    if (!group.members.includes(user._id)) {
      return responseMessage.NOT_IN_GROUP;
    }

    return null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// const firstVote = async (groupId: string, templateId: string): Promise<GetLunchTemplateResponseDto | string> => {
//   try {
//     const group = await Group.findById(groupId);
//     if (!group) {
//       return responseMessage.NO_GROUP;
//     }
//     const template = await LunchTemplate.findById(templateId);
//     if (!template) {
//       return responseMessage.NO_TEMPLATE;
//     }

//     group.templates.push(template._id);
//     await group.save();

//     const data: UserInfo = {
//       email: member.email,
//       nickname: member.nickname,
//     };

//     return data;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

const GroupService = {
  postGroup,
  inviteMember,
  joinGroup,
};

export default GroupService;
