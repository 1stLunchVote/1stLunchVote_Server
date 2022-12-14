import axios from 'axios';
import { LoginRequestDto } from '../interfaces/auth/request/LoginRequestDto';
import { LoginResponseDto } from '../interfaces/auth/response/LoginResponseDto';
import User from '../models/User';
import getToken from '../modules/jwtHandler';
import responseMessage from '../modules/responseMessage';

const kakaoLogin = async (loginRequestDto: LoginRequestDto): Promise<LoginResponseDto | string | null> => {
  try {
    // 필요한 값이 들어있는지 체크
    if (!loginRequestDto.socialToken || !loginRequestDto.fcmToken) {
      return responseMessage.NULL_VALUE;
    }

    const kakaoUser = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${loginRequestDto.socialToken}`,
      },
    });

    const kakaoUserData = kakaoUser.data;

    // 카카오 계정이 있는지 체크
    if (!kakaoUserData.id) {
      return responseMessage.INVALID_USER;
    }

    let existUser = await User.findOne({
      email: kakaoUserData.kakao_account.email,
    });

    // 유저가 db에 없는 경우 유저 회원 가입
    if (!existUser) {
      const user = new User({
        socialType: 'KAKAO',
        email: kakaoUserData.kakao_account.email,
        nickname: kakaoUserData.kakao_account.profile.nickname,
        profileImage: kakaoUserData.kakao_account.profile.profile_image_url,
        fcmToken: loginRequestDto.fcmToken,
      });
      if (!user.profileImage) {
        user.profileImage = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';
      }

      await user.save();
      existUser = user;
    } else {
      existUser.fcmToken = loginRequestDto.fcmToken;
      existUser.save();
    }

    await User.findByIdAndUpdate(existUser._id, existUser);

    const loginResponseDto: LoginResponseDto = {
      email: existUser.email,
      nickname: existUser.nickname,
      accessToken: getToken(existUser._id),
    };

    return loginResponseDto;
  } catch (error) {
    console.log('kakao token error');
    return null;
  }
};

const AuthService = {
  kakaoLogin,
};

export default AuthService;
