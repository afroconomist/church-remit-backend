export type AddMemberToGroup = {
  groupMemberName: string;
  groupMemberRole?: string;
  joined?: Date;
  status?: string;
  present?: boolean;
  absent?: boolean;
  excused?: boolean;
  group: string;
};
