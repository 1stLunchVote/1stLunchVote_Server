import mongoose from 'mongoose';
import { LunchTemplateInfo } from '../interfaces/lunchTemplate/LunchTemplateInfo';

const LunchTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    likesMenu: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Menu',
      },
    ],
    dislikesMenu: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Menu',
      },
    ],
    templateName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<LunchTemplateInfo & mongoose.Document>('LunchTemplate', LunchTemplateSchema);
