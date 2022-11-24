import { PostGroupResponseDto } from '../interfaces/group/response/PostGroupResponseDto';
import { UserInfo } from '../interfaces/user/UserInfo';
import Group from '../models/Group';
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
};

export default GroupService;
