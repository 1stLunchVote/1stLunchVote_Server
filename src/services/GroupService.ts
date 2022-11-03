import { PostGroupRequestDto } from '../interfaces/group/request/PostGroupRequestDto';
import { GetAllGroupResponseDto } from '../interfaces/group/response/GetAllGroupResponseDto';
import { GetGroupResponseDto } from '../interfaces/group/response/GetGroupResponseDto';
import { PostGroupResponseDto } from '../interfaces/group/response/PostGroupResponseDto';
import { UserInfo } from '../interfaces/user/UserInfo';
import Group from '../models/Group';
import User from '../models/User';
import responseMessage from '../modules/responseMessage';

const postGroup = async (userId: string, postGroupRequestDto: PostGroupRequestDto): Promise<PostGroupResponseDto | string | string[]> => {
  try {
    const captain = await User.findById(userId);
    let members;
    if (!captain) {
      return responseMessage.NO_USER;
    }
    if (postGroupRequestDto.membersEmail) {
      const invalidEmails: string[] = [];
      members = await Promise.all(
        postGroupRequestDto.membersEmail.map(async (email) => {
          const user = await User.findOne({
            email: email,
          });
          if (user) {
            return user;
          } else {
            invalidEmails.push(email);
          }
        }),
      );
      if (invalidEmails.length > 0) {
        return invalidEmails;
      }
    }

    const groupName = postGroupRequestDto.groupName;
    if (groupName.length < 2 || groupName.length > 10) {
      return responseMessage.INVALID_GROUP_NAME_LENGTH;
    }

    const group = new Group({
      captain: userId,
      groupName: groupName,
      members: members,
      templates: [],
    });
    group.save();

    const data: PostGroupResponseDto = {
      captain: captain.nickname,
      groupName: group.groupName,
      members: group.members,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllGroup = async (userId: string): Promise<GetAllGroupResponseDto | string> => {
  try {
    const groupsWithCaptain = await Group.find({
      captain: userId,
    });
    const groupsWithMember = await Group.find().where('members').in([userId]);

    const groups = groupsWithCaptain.concat(groupsWithMember);
    if (groups.length === 0) {
      return responseMessage.NO_GROUPS;
    }

    const results = await Promise.all(
      groups.map(async (group) => {
        const result = {
          groupId: group._id,
          groupName: group.groupName,
          memberCount: group.members.length + 1,
        };

        return result;
      }),
    );

    const data: GetAllGroupResponseDto = {
      groups: results,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getGroup = async (groupId: string): Promise<GetGroupResponseDto | string> => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return responseMessage.NO_GROUP;
    }

    const captainInfo = await User.findById(group.captain);
    const captain: UserInfo = {
      userId: group.captain,
      email: captainInfo!.email,
      nickname: captainInfo!.nickname,
    }
    let members: UserInfo[];
    if (group.members.length > 0) {
      members = await Promise.all(
        group.members.map(async (member) => {
          const memberInfo = await User.findById(member);
          const result: UserInfo = {
            userId: member,
            email: memberInfo!.email,
            nickname: memberInfo!.nickname,
          };

          return result;
        }),
      );
    } else {
      members = [];
    }

    const data: GetGroupResponseDto = {
      groupName: group.groupName,
      isDrawing: group.isDrawing,
      captain: captain,
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
    const group = await Group.findById(groupId);
    if (!group) {
      return responseMessage.NO_GROUP;
    }

    const user = await User.findOne({
      email: email
    });
    if (!user) {
      return responseMessage.NO_USER;
    }
    if (group.members.includes(user._id)) {
      return responseMessage.ALREADY_IN_GROUP;
    }

    group.members.push(user._id);
    group.save();

    const data: UserInfo = {
      userId: user._id,
      email: user.email,
      nickname: user.nickname,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const exileMember = async (groupId: string, email: string): Promise<UserInfo | string> => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return responseMessage.NO_GROUP;
    }

    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return responseMessage.NO_USER;
    }
    if (!group.members.includes(user._id)) {
      return responseMessage.NOT_IN_GROUP;
    }

    group.members = group.members.filter((userId) => userId != user.id);
    group.save();

    const data: UserInfo = {
      userId: user._id,
      email: user.email,
      nickname: user.nickname,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const GroupService = {
  postGroup,
  getAllGroup,
  getGroup,
  inviteMember,
  exileMember,
};

export default GroupService;
