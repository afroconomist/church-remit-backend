import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Permission, IPermission } from "../model/permission.model";

@injectable()
class PermissionRepo extends BaseRepository<IPermission, Permission> {
	constructor() {
		super(Permission);
	}
}

export default PermissionRepo;
