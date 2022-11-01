import { NextFunction, Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import message from '../modules/responseMessage';
import LunchTemplateService from '../services/LunchTemplateService';
import { PostLunchTemplateRequestDto } from '../interfaces/lunchTemplate/request/postLunchTemplateRequestDto';

/**
 *  @route Post /
 *  @desc post lunch template
 *  @access Public
 */
const postLunchTemplate = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.userId;
  try {
    const postLunchTemplateRequestDto: PostLunchTemplateRequestDto = {
      templateName: req.body.templateName,
      likesMenu: req.body.likesMenu,
      dislikesMenu: req.body.dislikesMenu,
    };

    if (!postLunchTemplateRequestDto) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }

    const data = await LunchTemplateService.postLunchTemplate(userId, postLunchTemplateRequestDto);
    if (data === message.INVALID_TEMPLATE_NAME_LENGTH) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.INVALID_TEMPLATE_NAME_LENGTH));
    }

    res.status(statusCode.CREATED).send(util.success(statusCode.CREATED, message.POST_LUNCH_TEMPLATE_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

/**
 *  @route Get /
 *  @desc get all lunch template
 *  @access Public
 */
const getAllLunchTemplate = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.userId;
  try {
    const data = await LunchTemplateService.getAllLunchTemplate(userId);

    if (data === message.NO_LUNCH_TEMPLATE_CONTENT) {
      return res.status(statusCode.OK).send(util.success(statusCode.NO_CONTENT, message.NO_LUNCH_TEMPLATE_CONTENT));
    }

    res.status(statusCode.OK).send(util.success(statusCode.OK, message.GET_ALL_LUNCH_TEMPLATE_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

/**
 *  @route Get /:lunchTemplateId
 *  @desc get lunch template detail
 *  @access Public
 */
const getLunchTemplate = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.userId;
  try {
    const lunchTemplateId = req.params.lunchTemplateId;
    if (!lunchTemplateId) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.INVALID_PARAMETER));
    }

    const data = await LunchTemplateService.getLunchTemplate(lunchTemplateId);
    if (data === message.INVALID_LUNCH_TEMPLATE) {
      return res.status(statusCode.BAD_REQUEST).send(util.success(statusCode.BAD_REQUEST, message.INVALID_LUNCH_TEMPLATE));
    }

    res.status(statusCode.OK).send(util.success(statusCode.OK, message.GET_LUNCH_TEMPLATE_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
}

const LunchTemplateContoller = {
  postLunchTemplate,
  getAllLunchTemplate,
  getLunchTemplate,
};

export default LunchTemplateContoller;
