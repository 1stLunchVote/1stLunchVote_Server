import mongoose from "mongoose";

export interface GetLunchTemplateResponseDto {
  templateName: string;
  menu: GetLikeOrDislikeDetail[];
}

interface GetLikeOrDislikeDetail {
  menuId: mongoose.Types.ObjectId;
  menuName: string;
  image: string;
  likesAndDislikes: string;
}