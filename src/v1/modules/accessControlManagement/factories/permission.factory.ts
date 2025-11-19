import { CreatePermission } from "../dtos/create-permission.dto";
import { IPermission } from "../model/permission.model";
import slugify from "slugify";

class PermissionFactory {
	static createPermission(data: CreatePermission) {
		const permission = {} as IPermission;

		permission.name = data.name;
		permission.description = data.description;
		permission.action = data.action;
		permission.moduleId = data.moduleId;
		permission.slug = slugify(data.name, { lower: true });

		return permission;
	}

	static readPermissionDto(data: any) {
		const permission = {} as IPermission;

		permission.id = data.id;
		permission.name = data.name;
		permission.description = data.description;
		permission.action = data.action;
		permission.moduleId = data.moduleId;
		permission.slug = data.slug;

		return permission;
	}

	static readPermissionsDto(data: any) {
		return data.length > 0 ? data.map((permission) => this.readPermissionDto(permission)) : [];
	}
}

export default PermissionFactory;
