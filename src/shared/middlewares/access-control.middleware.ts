import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { IPermission } from "../../v1/modules/accessControlManagement/model/permission.model";
import RoleRepo from "../../v1/modules/accessControlManagement/repositories/role.repo";
import ServiceUnavailableError from "@shared/error/service-unavailable.error";
import { ErrorResponse } from "@shared/utils/response.util";

const accessControlMiddleware = (requiredPermission: string) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const roleRepo = new RoleRepo();
			const userRoleId: string = (req as any).user.accessGroup;
			const roleWithPermissions: any = await roleRepo.findByNameWithRelations(
				userRoleId,
				["permissions"]
			);

			const userPermissions: IPermission[] = roleWithPermissions.permissions;

			const hasPermission = userPermissions.some(
				(permission) => permission.name === requiredPermission
			);

			if (!hasPermission) {
				return next(res.status(httpStatus.UNAUTHORIZED).send(ErrorResponse("You are not unauthorized to perform this action")));
			}
			next();
		} catch (error) {
			return new next(new ServiceUnavailableError("Error checking user permissions"));
		}
	};
};

export default accessControlMiddleware;
