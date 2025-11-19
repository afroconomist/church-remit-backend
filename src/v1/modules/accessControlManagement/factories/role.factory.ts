import slugify from "slugify";
import { CreateRole } from "../dtos/create-role.dto";
import { IRole } from "../model/role.model";

class RoleFactory {
	static createRoleDto(data: CreateRole) {
		const role = {} as IRole;

    role.name = data.name;
    role.description = data.description;
    role.slug = slugify(data.name, { lower: true });

    return role;
	}

  static readRoleDto(data: any) {
    const role = {} as any;

    role.id = data.id;
    role.name = data.name;
    role.description = data.description;
    role.slug = data.slug;
    role.permissions = data.permissions;

    return role;
  }

  static readRolesDto(data: IRole[]) {
    return data.length > 0 ? data.map((role) => this.readRoleDto(role)) : [];
  }
}

export default RoleFactory;
