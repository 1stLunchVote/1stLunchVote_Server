import mongoose from "mongoose"

export interface GetAllLunchTemplateResponseDto {
  lunchTemplates: GetEachLunchTemplate[];
}

interface GetEachLunchTemplate {
  lunchTemplateId: mongoose.Types.ObjectId;
  templateName: string;
}