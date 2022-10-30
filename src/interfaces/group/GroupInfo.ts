import mongoose from 'mongoose';

export interface GroupInfo {
  captain: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  templates: mongoose.Types.ObjectId[];
  isDrawing: boolean;
  groupName: string;
}
