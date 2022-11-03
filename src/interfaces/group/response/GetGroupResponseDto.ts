import { UserInfo } from "../../user/UserInfo";

export interface GetGroupResponseDto {
  groupName: string;
  isDrawing: boolean;
  captain: UserInfo;
  members: UserInfo[];
}