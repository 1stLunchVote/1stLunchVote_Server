import { Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import message from '../modules/responseMessage';
import GroupService from '../services/GroupService';

/**
 *  @route Post /
 *  @desc post group
 *  @access Public
 */
const postGroup = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  try {
    const data = await GroupService.postGroup(userId);
    if (data === message.NO_USER) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NO_USER));
    }

    res.status(statusCode.CREATED).send(util.success(statusCode.CREATED, message.POST_GROUP_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

const GroupContoller = {
  postGroup,
};

export default GroupContoller;