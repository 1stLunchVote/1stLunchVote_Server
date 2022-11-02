import { Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import AuthService from '../services/AuthService';
import util from '../modules/util';
import message from '../modules/responseMessage';
import { LoginRequestDto } from '../interfaces/auth/request/LoginRequestDto';

/**
 *  @route Post /login/:social
 *  @desc social login
 *  @access Public
 */
const socialLogin = async (req: Request, res: Response) => {
  try {
    const { social } = req.params;
    if (social != 'KAKAO') {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.UNDEFINED_SOCIAL_TYPE));
    }

    const loginRequestDto: LoginRequestDto = req.body;

    const data = await AuthService.kakaoLogin(loginRequestDto);

    if (data === message.NULL_VALUE) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    } else if (data === message.INVALID_USER) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.INVALID_USER));
    } else if (!data) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.KAKAO_TOKEN_ERROR));
    }

    res.status(statusCode.OK).send(util.success(statusCode.OK, message.USER_LOGIN_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

const AuthContoller = {
  socialLogin,
};

export default AuthContoller;
