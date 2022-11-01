import { PostLunchTemplateResponseDto } from '../interfaces/lunchTemplate/response/PostLunchTemplateResponseDto';
import { PostLunchTemplateRequestDto } from '../interfaces/lunchTemplate/request/postLunchTemplateRequestDto';
import responseMessage from '../modules/responseMessage';
import LunchTemplate from '../models/LunchTemplate';

const postLunchTemplate = async (userId: string, postLunchTemplateRequestDto: PostLunchTemplateRequestDto): Promise<PostLunchTemplateResponseDto | string> => {
  try {
    const templateName = postLunchTemplateRequestDto.templateName;

    if (!isTemplateNameValid(templateName)) {
      return responseMessage.INVALID_TEMPLATE_NAME_LENGTH;
    }

    const data: PostLunchTemplateResponseDto = postLunchTemplateRequestDto;
    const lunchTemplate = new LunchTemplate({
      userId: userId,
      templateName: data.templateName,
      likesMenu: data.likesMenu,
      dislikesMenu: data.dislikesMenu,
    });
    await lunchTemplate.save();

    return data;
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
};

export default LunchTemplateService;
