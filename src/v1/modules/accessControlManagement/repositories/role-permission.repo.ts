import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { RolePermission, IRolePermission } from "../model/role-permission.model";

@injectable()
class RolePermissionRepo extends BaseRepository<IRolePermission, RolePermission> {
	constructor() {
		super(RolePermission);
	}
}

export default RolePermissionRepo;
