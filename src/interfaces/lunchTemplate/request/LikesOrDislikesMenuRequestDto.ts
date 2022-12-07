import mongoose from 'mongoose';

export interface LikesOrDislikesMenuRequestDto {
  likesMenu: mongoose.Types.ObjectId[];
  dislikesMenu: mongoose.Types.ObjectId[];
}
