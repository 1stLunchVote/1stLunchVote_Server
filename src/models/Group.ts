import mongoose from 'mongoose';
import { GroupInfo } from '../interfaces/group/GroupInfo';

const GroupSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    ],
    templates: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'LunchTemplate',
      },
    ],
    isDrawing: {
      type: Boolean,
      default: false,
      required: true,
    },
    groupName: {
        type: String,
        required: true,
    }
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<GroupInfo & mongoose.Document>('Group', GroupSchema);
