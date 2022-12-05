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

/**
 *  @route Patch /:groupId/invite
 *  @desc patch group members
 *  @access Public
 */
const inviteMember = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const email = req.body.email;
    const data = await GroupService.inviteMember(groupId, email);
    if (data === message.NO_USER) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NO_USER));
    } else if (data === message.ALREADY_IN_GROUP) {
      return res.status(statusCode.OK).send(util.success(statusCode.OK, message.ALREADY_IN_GROUP));
    } else if (data === message.NO_GROUP) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NO_GROUP));
    }

    res.status(statusCode.CREATED).send(util.success(statusCode.CREATED, message.INVITE_MEMBER_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

/**
 *  @route Patch /:groupId/join
 *  @desc join group
 *  @access Public
 */
const joinGroup = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  try {
    const groupId = req.params.groupId;
    const data = await GroupService.joinGroup(userId, groupId);
    if (data === message.NO_GROUP) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NO_GROUP));
    } else if (data === message.NOT_IN_GROUP) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NOT_IN_GROUP));
    } else if (data === message.NO_USER) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NO_USER));
    }
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.JOIN_GROUP_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
}

/**
 *  @route Get /:groupId
 *  @desc get group
 *  @access Public
 */
const getGroup = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  try {
    const groupId = req.params.groupId;
    const data = await GroupService.getGroup(userId, groupId);
    if (data === message.NO_GROUP) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NO_GROUP));
    }
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.GET_GROUP_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

/**
 *  @route Patch /:groupId/vote/first
 *  @desc vote first
 *  @access Public
 */
const firstVote = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const templateId = req.body.templateId;
    const data = await GroupService.firstVote(groupId, templateId);
    if (data === message.NO_GROUP) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NO_GROUP));
    } else if (data === message.NO_TEMPLATE) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NO_TEMPLATE));
    } else if (data === message.ALREADY_VOTED) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.ALREADY_VOTED));
    } 
    res.status(statusCode.CREATED).send(util.success(statusCode.CREATED, message.FIRST_VOTE_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
}

/**
 *  @route Get /:groupId/vote/first/status
 *  @desc get first vote status
 *  @access Public
 */
const getFirstVoteStatus = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const data = await GroupService.getFirstVoteStatus(groupId);
    if (data === message.NO_GROUP) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NO_GROUP));
    }
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.GET_FIRST_VOTE_STATUS_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

/**
 *  @route Get /:groupId/vote/first/result
 *  @desc get first vote result
 *  @access Public
 */
const getFirstVoteResult = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const data = await GroupService.getFirstVoteResult(groupId);
    if (data === message.NO_GROUP) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NO_GROUP));
    }
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.GET_FIRST_VOTE_RESULT_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

/**
 *  @route Patch /:groupId/vote/second
 *  @desc vote second
 *  @access Public
 */
const secondVote = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const menuId = req.body.menuId;
    const data = await GroupService.secondVote(groupId, menuId);
    if (data === message.NO_GROUP) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NO_GROUP));
    } else if (data === message.NO_MENU) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NO_MENU));
    }
    res.status(statusCode.CREATED).send(util.success(statusCode.CREATED, message.SECOND_VOTE_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
}

const GroupContoller = {
  postGroup,
  inviteMember,
  joinGroup,
  getGroup,
  firstVote,
  getFirstVoteStatus,
  getFirstVoteResult,
  secondVote,
};

export default GroupContoller;