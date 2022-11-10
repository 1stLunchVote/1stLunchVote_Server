import { Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import message from '../modules/responseMessage';
import { PostGroupRequestDto } from '../interfaces/group/request/PostGroupRequestDto';
import GroupService from '../services/GroupService';

/**
 *  @route Post /
 *  @desc post group
 *  @access Public
 */
const postGroup = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  try {
    const postGroupRequestDto: PostGroupRequestDto = {
      membersEmail: req.body.membersEmail,
    };

    if (!postGroupRequestDto) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }

    const data = await GroupService.postGroup(userId, postGroupRequestDto);
    if (data === message.NO_USER) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NO_USER));
    } else if (Array.isArray(data)) {
      const emails = data.join(', ');
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, emails + message.INVALID_EMAIL));
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