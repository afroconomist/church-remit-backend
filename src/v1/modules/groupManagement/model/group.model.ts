import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Group extends Model {
  static tableName = DB_TABLES.GROUPS;
  id: string;
  groupName: string;
  category: string;
  description?: Text;
  groupLeader: string;
  capacity?: number;
  capacityTracker?: number;
  meetingDay: string;
  meetingTime: string;
  frequency: string;
  location: string;
  publicGroup?: boolean;
  allowGuestInvites?: boolean;
  requireLeaderApproval?: boolean;
  enableGroupChat?: boolean;
  groupCreator: string;
  campusId?: string;
  church: string;
}

export type IGroup = ModelObject<Group>;
