import mongoose from "mongoose";
import { MenuInfo } from "../menu/MenuInfo";

export interface LunchTemplateInfo {
  userId: mongoose.Types.ObjectId;
  likesMenu: MenuInfo[];
  dislikesMenu: MenuInfo[];
  templateName: string;
}
