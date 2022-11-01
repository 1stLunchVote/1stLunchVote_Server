import mongoose from "mongoose";

export interface PostLunchTemplateResponseDto {
  templateName: string;
  likesMenu: mongoose.Types.ObjectId[];
  dislikesMenu: mongoose.Types.ObjectId[];
}