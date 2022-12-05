import { Request, Response } from 'express';
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
const updateUserNickname = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  try {
    const nicknameUpdateRequestDto: NicknameUpdateRequestDto = req.body;
    if (!nicknameUpdateRequestDto) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }

    const data = await UserService.updateUserNickname(userId, nicknameUpdateRequestDto);
    if (data === message.NO_USER) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NO_USER));
    } else if (data === message.INVALID_NICKNAME_LENGTH) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.INVALID_NICKNAME_LENGTH));
    }

    res.status(statusCode.CREATED).send(util.success(statusCode.CREATED, message.NICKNAME_UPDATE_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

/**
 *  @route Get /
 *  @desc get user information
 *  @access Public
 */
const getUserInfo = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  try {
    const data = await UserService.getUserInfo(userId);
    if (data === message.NO_USER) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NO_USER));
    }
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.GET_USER_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
}

const UserContoller = {
  updateUserNickname,
  getUserInfo,
};

export default UserContoller;
