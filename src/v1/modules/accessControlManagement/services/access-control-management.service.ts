import logger from "@shared/utils/logger";
import { injectable } from "tsyringe";
import PermissionRepo from "../repositories/permission.repo";
import RoleRepo from "../repositories/role.repo";
import { CreateRole } from "../dtos/create-role.dto";
import { IRole } from "../model/role.model";
import { IPermission } from "../model/permission.model";
import ServiceUnavailableError from "@shared/error/service-unavailable.error";
import ConflictError from "@shared/error/conflict.error";
import NotFoundError from "@shared/error/not-found.error";
import PermissionFactory from "../factories/permission.factory";
import RoleFactory from "../factories/role.factory";
import RolePermissionFactory from "../factories/role-permission.factory";

@injectable()
class AccessControlManagementService {
	constructor(
		private readonly roleRepo: RoleRepo,
		private readonly permissionRepo: PermissionRepo
	) {}

	async createRole(data: CreateRole) {
		const roleExist = await this.roleRepo.findWhere({ name: data.name });
		if (roleExist.length > 0) {
			throw new ConflictError("Role already exists");
		}

		const roleData = RoleFactory.createRoleDto(data);

		const relationsData = RolePermissionFactory.createRolePermissionDto(data);

		const savedRole = await this.roleRepo
			.saveWithRelations(roleData, relationsData.permissions, "role_permissions", "roleId")
			.catch((error) => {
				logger.error(`Error creating role: ${error.message}`);
				throw new ServiceUnavailableError();
			});

		return RoleFactory.readRoleDto(savedRole);
	}

	async getRole(id: string) {
		const roleExist: IRole = await this.roleRepo.findById(id);
		if (!roleExist) {
			throw new NotFoundError();
		}

		const role = await this.roleRepo
			.findById(id, ["permissions"])
			.catch((error) => {
				logger.error(`Error fetching role by ID: ${error.message}`);
				throw new ServiceUnavailableError();
			});

		return RoleFactory.readRoleDto(role);
	}

	async getAllRoles() {
		const roleWithPermissions = await this.roleRepo
			.getAllWithRelations(["permissions"])
			.catch((error) => {
				logger.error(`Error fetching all roles: ${error.message}`);
				throw new ServiceUnavailableError();
			});

		return RolePermissionFactory.readRolePermissionDto(roleWithPermissions);
	}

	async updateRole(id: string, data: CreateRole) {
		const roleExist: IRole = await this.roleRepo.findById(id);
		if (!roleExist) {
			throw new NotFoundError();
		}

		const updateData = RoleFactory.createRoleDto(data);

		const rolePermissions = RolePermissionFactory.createRolePermissionDto(data);

		const updatedRole = await this.roleRepo
			.updateWithRelations(
				id,
				updateData,
				{ role_permissions: rolePermissions },
				"role_permissions",
				"roleId"
			)
			.catch((error) => {
				logger.error(`Error updating role: ${error.message}`);
				throw new ServiceUnavailableError();
			});

		return RoleFactory.readRoleDto(updatedRole);
	}

	async deleteRole(id: string) {
		const existingRole: IRole = await this.roleRepo.findById(id);
		if (!existingRole) {
			throw new NotFoundError();
		}

		const roleUsers: any = await this.roleRepo.findWhere({ id }, ["users"]);
		if (roleUsers.length > 0) {
			throw new ConflictError("Role has users assigned to it");
		}

		await this.roleRepo.deleteWithRelations(id, "role_permissions", "roleId");
	}

	async getPermission(id: string) {
		const permission: IPermission = await this.permissionRepo.findById(id);
		if (!permission) {
			throw new NotFoundError();
		}
		return PermissionFactory.readPermissionDto(permission);
	}

	async getAllPermissions() {
		const permissions = await this.permissionRepo.getAll();
		return PermissionFactory.readPermissionsDto(permissions);
	}

	async createPermission(data: IPermission) {
		const permissionExist = await this.permissionRepo.findWhere({ name: data.name });
		if (permissionExist.length > 0) {
			throw new ConflictError("Permission already exists");
		}

		const permissionData = PermissionFactory.createPermission(data);
		const savedPermission = await this.permissionRepo.save(permissionData).catch((error) => {
			logger.error(`Error creating permission: ${error.message}`);
			throw new ServiceUnavailableError();
		});
		return PermissionFactory.readPermissionDto(savedPermission);
	}

}

export default AccessControlManagementService;
