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
    votedMembers: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    ],
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
    menus: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Menu',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<GroupInfo & mongoose.Document>('Group', GroupSchema);
