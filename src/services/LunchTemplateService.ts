import { PostLunchTemplateResponseDto } from "../interfaces/lunchTemplate/response/PostLunchTemplateResponseDto";
import { PostLunchTemplateRequestDto } from "../interfaces/lunchTemplate/request/postLunchTemplateRequestDto";
import responseMessage from '../modules/responseMessage';

const postLunchTemplate = async (postLunchTemplateRequestDto: PostLunchTemplateRequestDto): Promise<PostLunchTemplateResponseDto | string> => {
  try {
    const templateName = postLunchTemplateRequestDto.templateName;

    if (!isTemplateNameValid(templateName)) {
      return responseMessage.INVALID_TEMPLATE_NAME_LENGTH;
    }

    const data: PostLunchTemplateResponseDto = postLunchTemplateRequestDto;

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const isTemplateNameValid = async (templateName: string) => {
  if (templateName.length < 2 || templateName.length > 10) {
    return false;
  }
  return true;
}

const LunchTemplateService = {
  postLunchTemplate,
};

export default LunchTemplateService;
