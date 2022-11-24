import mongoose from 'mongoose';

export interface GroupInfo {
  members: mongoose.Types.ObjectId[];
  templates: mongoose.Types.ObjectId[];
}
