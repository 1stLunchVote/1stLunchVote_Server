import { NextFunction, Request, Response } from 'express';
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
const socialLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { social } = req.params;
  const loginRequestDto: LoginRequestDto = req.body;

  try {
    if (social != 'KAKAO') {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.UNDEFINED_SOCIAL_TYPE));
    }

    const data = await AuthService.kakaoLogin(loginRequestDto);

    if (data === message.NULL_VALUE) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    } else if (data === message.INVALID_USER) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.INVALID_USER));
    } else if (!data) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.KAKAO_TOKEN_ERROR));
    }
    const responseData = {
      accessToken: data,
    };
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.USER_LOGIN_SUCCESS, responseData));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send;
  }
};

const AuthContoller = {
  socialLogin,
};

export default AuthContoller;
