import { PostLunchTemplateResponseDto } from "../interfaces/lunchTemplate/response/PostLunchTemplateResponseDto";
import { PostLunchTemplateRequestDto } from "../interfaces/lunchTemplate/request/postLunchTemplateRequestDto";
import responseMessage from '../modules/responseMessage';

const postLunchTemplate = async (postLunchTemplateRequestDto: PostLunchTemplateRequestDto): Promise<PostLunchTemplateResponseDto | string> => {
  try {
    const templateName = postLunchTemplateRequestDto.templateName;

    if (templateName.length < 2 || templateName.length > 10) {
      return responseMessage.INVALID_TEMPLATE_NAME_LENGTH;
    }

    

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const LunchTemplateService = {
  postLunchTemplate,
};

export default LunchTemplateService;
