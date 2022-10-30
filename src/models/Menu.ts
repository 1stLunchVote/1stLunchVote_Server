import mongoose from 'mongoose';
import { MenuInfo } from '../interfaces/menu/MenuInfo';

const MenuSchema = new mongoose.Schema(
  {
    menuName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<MenuInfo & mongoose.Document>('Menu', MenuSchema);
