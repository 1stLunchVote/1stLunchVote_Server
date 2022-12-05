import mongoose from 'mongoose';
import { MemberInfoResponseDto } from '../../user/response/MemberInfoResponseDto';

export interface GroupResponseDto {
  groupId: mongoose.Types.ObjectId;
  members: MemberInfoResponseDto[];
}
