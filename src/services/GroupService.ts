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

const inviteMember = async (groupId: string, email: string): Promise<PostGroupResponseDto | string> => {
  try {
    const member = await User.findOne({ email: email });
    if (!member) {
      return responseMessage.NO_USER;
    }

    const group = await Group.findById(groupId).populate('members');
    if (!group) {
      return responseMessage.NO_GROUP;
    }
    console.log(group);

    group.members.push(member._id);
    group.update();
    console.log(group);

    // const members = Promise.all(
    //   group.members.map(async (member) => {
    //     const result: UserInfo = {
    //       email: member.email,
    //       nickname: member.nickname
    //     };

    //     return result;
    //   })
    // )

    // const data: PostGroupResponseDto = {
    //   groupId: group._id,
    //   members: members,
    // };

    return '';
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
