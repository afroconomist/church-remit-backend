import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";
import bcrypt from "bcrypt";
import { Role } from "../../accessControlManagement/model/role.model";

const SALT_ROUNDS = 10;

export class Member extends Model {
  static tableName = DB_TABLES.MEMBERS;
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  gender?: string;
  maritalStatus?: string;
  occupation?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  contactName?: string;
  contactNumber?: string;
  relationship?: string;
  membershipStatus?: string;
  joinDate?: Date;
  baptismDate?: Date;
  notes?: string;
  avatar?: string;
  roleId: string;
  status?: string;
  isDefaultPassword?: boolean;
  refreshToken?: string;
  addedBy: string;
  churchId: string;
  linkedToFamily?: boolean;

  static relationMappings = {
    userRole: {
      relation: Model.BelongsToOneRelation,
      modelClass: Role,
      join: {
        from: "members.role",
        to: "roles.id",
      },
    },
  };

  async $beforeInsert(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    }
  }

  async $beforeUpdate(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    }
  }

  static async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

export type IMember = ModelObject<Member>;
