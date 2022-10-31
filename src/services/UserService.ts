import { NicknameUpdateRequestDto } from '../interfaces/user/request/NicknameUpdateRequestDto';
import { NicknameUpdateResponseDto } from '../interfaces/user/response/NicknameUpdateResponseDto';
import User from '../models/User';
import responseMessage from '../modules/responseMessage';

const updateUserNickname = async (userId: string, nicknameUpdateRequestDto: NicknameUpdateRequestDto): Promise<NicknameUpdateResponseDto | string> => {
  try {
    const user = await User.findByIdAndUpdate(userId, nicknameUpdateRequestDto);
    if (!user) {
      return responseMessage.NO_USER;
    }
    const data: NicknameUpdateResponseDto = {
      nickname: user.nickname,
    };
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const UserService = {
  updateUserNickname,
};

export default UserService;
