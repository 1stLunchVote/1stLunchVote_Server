import mongoose from 'mongoose';

export interface PostGroupResponseDto {
  captain: string;
  groupName: string;
  members: mongoose.Types.ObjectId[];
}
