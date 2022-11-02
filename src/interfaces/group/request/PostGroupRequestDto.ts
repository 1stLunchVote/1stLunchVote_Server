import mongoose from "mongoose";

export interface PostGroupRequestDto {
  groupName: string;
  membersEmail: mongoose.Types.ObjectId[]
}