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
      groupName: req.body.groupName,
      membersEmail: req.body.membersEmail,
    };

    if (!postGroupRequestDto) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }

    const data = await GroupService.postGroup(userId, postGroupRequestDto);
    if (data === message.INVALID_GROUP_NAME_LENGTH) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.INVALID_GROUP_NAME_LENGTH));
    } else if (data === message.NO_USER) {
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

/**
 *  @route Get /
 *  @desc get all groups
 *  @access Public
 */
const getAllGroup = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  try {
    const data = await GroupService.getAllGroup(userId);
    if (data === message.NO_GROUPS) {
      return res.status(statusCode.OK).send(util.success(statusCode.NO_CONTENT, message.NO_GROUPS));
    }

    res.status(statusCode.CREATED).send(util.success(statusCode.OK, message.GET_ALL_GROUPS_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

const GroupContoller = {
  postGroup,
  getAllGroup,
};

export default GroupContoller;