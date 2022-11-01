import mongoose from "mongoose";

export interface PostLunchTemplateRequestDto {
  templateName: string;
  likesMenu: mongoose.Types.ObjectId[];
  dislikesMenu: mongoose.Types.ObjectId[];
}