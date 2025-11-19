import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class RolePermission extends Model {
  static tableName = DB_TABLES.ROLE_PERMISSIONS;
  id: string;
  roleId: string;
  permissionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IRolePermission = ModelObject<RolePermission>;
