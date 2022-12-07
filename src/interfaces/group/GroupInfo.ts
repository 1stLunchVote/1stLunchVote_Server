import mongoose from 'mongoose';

export interface GroupInfo {
  members: mongoose.Types.ObjectId[];
  votedMembers: mongoose.Types.ObjectId[];
  likesMenu: mongoose.Types.ObjectId[];
  dislikesMenu: mongoose.Types.ObjectId[];
  menus: mongoose.Types.ObjectId[];
}
