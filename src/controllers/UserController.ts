import { NextFunction, Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import UserService from '../services/UserService';
import util from '../modules/util';
import message from '../modules/responseMessage';
import { NicknameUpdateRequestDto } from '../interfaces/user/request/NicknameUpdateRequestDto';

/**
 *  @route Patch /nickname
 *  @desc update nickname
 *  @access Public
 */
const updateUserNickname = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.userId;
  try {
    const nicknameUpdateRequestDto: NicknameUpdateRequestDto = req.body;
    if (!nicknameUpdateRequestDto) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }

    const data = await UserService.updateUserNickname(userId, nicknameUpdateRequestDto);
    if (data === message.NO_USER) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NO_USER));
    }

    res.status(statusCode.CREATED).send(util.success(statusCode.CREATED, message.NICKNAME_UPDATE_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

const UserContoller = {
  updateUserNickname,
};

export default UserContoller;
