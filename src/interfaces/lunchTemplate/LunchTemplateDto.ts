import mongoose from 'mongoose';

export interface LunchTemplateDto {
  templateName: string;
  likesMenu: mongoose.Types.ObjectId[];
  dislikesMenu: mongoose.Types.ObjectId[];
}
