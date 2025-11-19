import { CreateRolePermission } from "../dtos/create-role-permission.dto";
import PermissionFactory from "./permission.factory";
import RoleFactory from "./role.factory";

class RolePermissionFactory {
	static createRolePermissionDto(data: CreateRolePermission) {
		const rolePermission = {} as any;

		rolePermission.permissions = data.permissions.map((permission) => ({
				permissionId: permission,
			}));

		return rolePermission;
	}

	static readRolePermissionDto(data: any) {
		const rolePermission = {} as any;

		rolePermission.role = RoleFactory.readRolesDto(data);

		rolePermission.role.forEach(role => {
			role.permissions = PermissionFactory.readPermissionsDto(role.permissions);
		});

		return rolePermission;
	}
}

export default RolePermissionFactory;
