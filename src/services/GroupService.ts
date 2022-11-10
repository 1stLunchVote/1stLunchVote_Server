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
    if (!captain) {
      return responseMessage.NO_USER;
    }
    const captainInfo: UserInfo = {
      userId: captain._id,
      email: captain.email,
      nickname: captain.nickname,
    };
    const members: UserInfo[] = [];
    members.push(captainInfo);
    if (postGroupRequestDto.membersEmail) {
      const invalidEmails: string[] = [];
      postGroupRequestDto.membersEmail.forEach(async (email) => {
          const user = await User.findOne({
            email: email,
          });
          if (user) {
            const userInfo: UserInfo = {
              userId: user._id,
              email: user.email,
              nickname: user.nickname,
            };
            members.push(userInfo);
          } else {
            invalidEmails.push(email);
          }
        });

      if (invalidEmails.length > 0) {
        return invalidEmails;
      }
    }

    const group = new Group({
      captain: userId,
      members: members,
      templates: [],
    });
    group.save();

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

const GroupService = {
  postGroup,
  getAllGroup,
};

export default GroupService;
