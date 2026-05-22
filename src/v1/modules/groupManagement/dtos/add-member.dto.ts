export type AddMemberToGroup = {
  groupMemberName: string;
  groupMemberRole?: string;
  joined?: Date;
  status?: string;
  group: string;
  churchMemberId?: string;
};
