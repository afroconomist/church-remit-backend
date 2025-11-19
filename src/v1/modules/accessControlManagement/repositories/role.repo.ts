import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Role, IRole } from "../model/role.model";

@injectable()
class RoleRepo extends BaseRepository<IRole, Role> {
	constructor() {
		super(Role);
	}
}

export default RoleRepo;
