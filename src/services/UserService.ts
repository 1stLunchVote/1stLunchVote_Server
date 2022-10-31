import { NicknameUpdateRequestDto } from '../interfaces/user/request/NicknameUpdateRequestDto';
import { NicknameUpdateResponseDto } from '../interfaces/user/response/NicknameUpdateResponseDto';
import User from '../models/User';
import responseMessage from '../modules/responseMessage';

const updateUserNickname = async (userId: string, nicknameUpdateRequestDto: NicknameUpdateRequestDto): Promise<NicknameUpdateResponseDto | string> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return responseMessage.NO_USER;
    }
    await User.findByIdAndUpdate(userId, nicknameUpdateRequestDto);

    const data: NicknameUpdateResponseDto = {
      nickname: nicknameUpdateRequestDto.nickname,
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
