import mongoose from 'mongoose';

export interface UpdateLunchTemplateRequestDto {
  lunchTemplateId: string;
  templateName: string;
  likesMenu: mongoose.Types.ObjectId[];
  dislikesMenu: mongoose.Types.ObjectId[];
}
