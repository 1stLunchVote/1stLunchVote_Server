import mongoose from 'mongoose';
import { UserInfo } from '../interfaces/user/UserInfo';

const UserSchema = new mongoose.Schema(
  {
    socialType: {
      type: String,
      enum: ['KAKAO'],
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    nickname: {
      type: String,
      require: true,
    },
    profileImage: {
      type: String,
      require: true,
    },
    fcmToken: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<UserInfo & mongoose.Document>('User', UserSchema);
