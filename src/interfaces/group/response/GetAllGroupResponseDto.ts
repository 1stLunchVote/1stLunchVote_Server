export interface GetAllGroupResponseDto {
  groups: Group[];
}

interface Group {
  groupId: string;
  groupName: string;
  memberCount: number;
}