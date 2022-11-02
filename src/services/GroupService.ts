import { PostGroupRequestDto } from "../interfaces/group/request/PostGroupRequestDto";
import { PostGroupResponseDto } from "../interfaces/group/response/PostGroupResponseDto";
import Group from "../models/Group";
import User from "../models/User";
import responseMessage from '../modules/responseMessage';

const postGroup = async (userId: string, postGroupRequestDto: PostGroupRequestDto): Promise<PostGroupResponseDto | string> => {
  try {
    const invalidEmails: string[] = [];
    const members = await Promise.all(
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
    if (invalidEmails) {
      return invalidEmails.join(', ');
    }

    const group = new Group({
      captain: userId,
      groupName: postGroupRequestDto.groupName,
      members: members,
      templates: [],
    });

    const captain = await User.findById(userId);
    if (!captain) {
      return responseMessage.NO_USER;
    }
    const data: PostGroupResponseDto = {
      captain: captain.nickname,
      groupName: group.groupName,
      members: group.members,
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const GroupService = {
  postGroup,
};

export default GroupService;
