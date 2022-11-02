import { PostGroupRequestDto } from '../interfaces/group/request/PostGroupRequestDto';
import { GetAllGroupResponseDto } from '../interfaces/group/response/GetAllGroupResponseDto';
import { PostGroupResponseDto } from '../interfaces/group/response/PostGroupResponseDto';
import Group from '../models/Group';
import User from '../models/User';
import responseMessage from '../modules/responseMessage';

const postGroup = async (userId: string, postGroupRequestDto: PostGroupRequestDto): Promise<PostGroupResponseDto | string | string[]> => {
  try {
    const captain = await User.findById('635f8f410ef44d4c5213e8e5');
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
          memberCount: group.members.length,
        };

        return result;
      }),
    );

    const data: GetAllGroupResponseDto = {
      groups: results,
    } 

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
