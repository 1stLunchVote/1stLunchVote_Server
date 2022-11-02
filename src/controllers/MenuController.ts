import { Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import message from '../modules/responseMessage';
import MenuService from '../services/MenuService';

/**
 *  @route Get /menu
 *  @desc get menu list
 *  @access Public
 */
const getAllMenu = async (req: Request, res: Response) => {
  try {
    const data = await MenuService.getAllMenu();

    res.status(statusCode.CREATED).send(util.success(statusCode.OK, message.GET_ALL_MENU_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

const MenuContoller = {
  getAllMenu,
};

export default MenuContoller;
