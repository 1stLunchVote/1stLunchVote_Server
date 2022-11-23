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
    ]
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<GroupInfo & mongoose.Document>('Group', GroupSchema);
