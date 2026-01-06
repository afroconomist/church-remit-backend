import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";
import { Member } from "../../memberManagement/model/member.model";

export class Leave extends Model {
  static tableName = DB_TABLES.LEAVES;
  id: string;
  staffName: string;
  leaveType: string;
  totalDays: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: string;
  memberId: string;
  church: string;

  static relationMappings = {
    userRole: {
      relation: Model.BelongsToOneRelation,
      modelClass: Member,
      join: {
        from: "leaves.memberId",
        to: "members.id",
      },
    },
  };
}

export type ILeave = ModelObject<Leave>;
