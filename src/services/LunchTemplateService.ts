import { LunchTemplateDto } from '../interfaces/lunchTemplate/LunchTemplateDto';
import responseMessage from '../modules/responseMessage';
import LunchTemplate from '../models/LunchTemplate';
import { GetAllLunchTemplateResponseDto } from '../interfaces/lunchTemplate/response/GetAllLunchTemplateResponseDto';
import { GetLunchTemplateResponseDto } from '../interfaces/lunchTemplate/response/GetLunchTemplateResponseDto';
import Menu from '../models/Menu';
import { UpdateLunchTemplateRequestDto } from '../interfaces/lunchTemplate/request/UpdateLunchTemplateRequestDto';
import mongoose from 'mongoose';

const postLunchTemplate = async (userId: string, lunchTemplateDto: LunchTemplateDto): Promise<LunchTemplateDto | string> => {
  try {
    const templateName = lunchTemplateDto.templateName;

    if (!isTemplateNameValid(templateName)) {
      return responseMessage.INVALID_TEMPLATE_NAME_LENGTH;
    }

    const lunchTemplate = new LunchTemplate({
      userId: userId,
      templateName: lunchTemplateDto.templateName,
      likesMenu: lunchTemplateDto.likesMenu,
      dislikesMenu: lunchTemplateDto.dislikesMenu,
    });
    await lunchTemplate.save();

    return lunchTemplateDto;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllLunchTemplate = async (userId: string): Promise<GetAllLunchTemplateResponseDto | string> => {
  try {
    const lunchTemplateList = await LunchTemplate.find({
      userId: userId,
    });

    const results = await Promise.all(
      lunchTemplateList.map(async (template) => {
        const result = {
          lunchTemplateId: template._id,
          templateName: template.templateName,
        };

        return result;
      }),
    );

    if (results.length == 0) {
      return responseMessage.NO_LUNCH_TEMPLATE_CONTENT;
    }

    const data: GetAllLunchTemplateResponseDto = {
      lunchTemplates: results,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getLunchTemplate = async (lunchTemplateId: string): Promise<GetLunchTemplateResponseDto | string> => {
  try {
    const lunchTemplate = await LunchTemplate.findById(lunchTemplateId);
    if (!lunchTemplate) {
      return responseMessage.INVALID_LUNCH_TEMPLATE;
    }
    const menuList = await Menu.find();

    const results = await Promise.all(
      menuList.map(async (eachMenu) => {
        let likesAndDislikes = 'NORMAL';
        if (lunchTemplate.likesMenu.includes(eachMenu._id)) {
          likesAndDislikes = 'LIKES';
        } else if (lunchTemplate.dislikesMenu.includes(eachMenu._id)) {
          likesAndDislikes = 'DISLiKES';
        }

        const menu = {
          menuId: eachMenu._id,
          menuName: eachMenu.menuName,
          image: eachMenu.image,
          likesAndDislikes: likesAndDislikes,
        };

        return menu;
      }),
    );

    const data = {
      templateName: lunchTemplate.templateName,
      menu: results,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateLunchTemplate = async (userId: string, updatelunchTemplateRequestDto: UpdateLunchTemplateRequestDto): Promise<LunchTemplateDto | string> => {
  try {
    const templateName = updatelunchTemplateRequestDto.templateName;

    if (!isTemplateNameValid(templateName)) {
      return responseMessage.INVALID_TEMPLATE_NAME_LENGTH;
    }

    const lunchTemplate = await LunchTemplate.findById(updatelunchTemplateRequestDto.lunchTemplateId);
    if (!lunchTemplate) {
      return responseMessage.INVALID_PARAMETER;
    }
    
    let likesMenu = updatelunchTemplateRequestDto.likesMenu;
    let dislikesMenu = updatelunchTemplateRequestDto.dislikesMenu;
    if (!likesMenu) {
      likesMenu = [];
    }
    if (!dislikesMenu) {
      dislikesMenu = [];
    }

    const updateLunchTemplateDao = {
      userId: userId,
      templateName: templateName,
      likesMenu: likesMenu,
      dislikesMenu: dislikesMenu,
    };
    await lunchTemplate.updateOne(updateLunchTemplateDao);

    const data = {
      templateName: updatelunchTemplateRequestDto.templateName,
      likesMenu: likesMenu,
      dislikesMenu: dislikesMenu,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteLunchTemplate = async (lunchTemplateId: string): Promise<string | undefined> => {
  try {
    const lunchTemplate = await LunchTemplate.findById(lunchTemplateId);
    if (!lunchTemplate) {
      return responseMessage.INVALID_PARAMETER;
    }

    await lunchTemplate.deleteOne();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const isTemplateNameValid = (templateName: string) => {
  if (templateName.length < 2 || templateName.length > 10) {
    return false;
  }
  return true;
};

const LunchTemplateService = {
  postLunchTemplate,
  getAllLunchTemplate,
  getLunchTemplate,
  updateLunchTemplate,
  deleteLunchTemplate,
};

export default LunchTemplateService;
