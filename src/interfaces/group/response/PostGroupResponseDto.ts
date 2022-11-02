import mongoose from 'mongoose';

export interface PostGroupResponseDto {
  userId: string;
  groupName: string;
  membersEmail: mongoose.Types.ObjectId[];
}
