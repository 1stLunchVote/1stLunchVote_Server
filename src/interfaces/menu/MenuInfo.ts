import mongoose from "mongoose";

export interface MenuInfo {
  menuId: mongoose.Types.ObjectId;
  menuName: string;
  image: string;
}
