import mongoose from "mongoose";

export interface UserInfo {
  userId: mongoose.Types.ObjectId;
  email: string;
  nickname: string;
}
