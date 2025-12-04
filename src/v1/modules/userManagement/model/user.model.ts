import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";
import bcrypt from "bcrypt";
import { Role } from "../../accessControlManagement/model/role.model";

const SALT_ROUNDS = 10;

export class User extends Model {
  static tableName = DB_TABLES.USERS;
  id!: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  roleId?: string;
  status!: string;
  isDefaultPassword?: boolean;
  refreshToken!: string;
  addedBy?: string;
  churchId?: string;

  static relationMappings = {
    userRole: {
      relation: Model.BelongsToOneRelation,
      modelClass: Role,
      join: {
        from: "users.role",
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

export type IUser = ModelObject<User>;
