import mongoose from 'mongoose';
import { UserInfo } from '../../user/UserInfo';

export interface PostGroupResponseDto {
  groupId: mongoose.Types.ObjectId;
  members: UserInfo[];
}
