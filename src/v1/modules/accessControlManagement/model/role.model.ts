import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";
import { Permission } from "./permission.model";

export class Role extends Model {
	static tableName = DB_TABLES.ROLES;

	id: string;
	name: string;
	description: string;
	slug: string;
	createdAt: Date;
	updatedAt: Date;

	static relationMappings = {
		permissions: {
			relation: Model.ManyToManyRelation,
			modelClass: Permission,
			join: {
				from: "roles.id",
				through: {
					from: "role_permissions.roleId",
					to: "role_permissions.permissionId",
				},
				to: "permissions.id",
			},
		},
	};
}

export type IRole = ModelObject<Role>;
