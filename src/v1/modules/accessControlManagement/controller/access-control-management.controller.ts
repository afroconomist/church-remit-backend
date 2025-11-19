import httpStatus from "http-status";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import AccessControlManagementService from "../services/access-control-management.service";
import { SuccessResponse } from "@shared/utils/response.util";

@injectable()
class AccessControlManagementController {
	constructor(
		private readonly accessControlManagementService: AccessControlManagementService
	) {}

	createRole = async (req: Request, res: Response) => {
		const response = await this.accessControlManagementService.createRole(
			req.body
		);

		return res
			.status(httpStatus.CREATED)
			.send(SuccessResponse("Operation successful", response));
	};

	updateRole = async (req: Request, res: Response) => {
		const response = await this.accessControlManagementService.updateRole(
			req.params.id,
			req.body
		);

		return res
			.status(httpStatus.OK)
			.send(SuccessResponse("Operation successful", response));
	};

	getRole = async (req: Request, res: Response) => {
		const response = await this.accessControlManagementService.getRole(
			req.params.id
		);

		return res
			.status(httpStatus.OK)
			.send(SuccessResponse("Operation successful", response));
	};

	getAllRoles = async (res: Response) => {
		const response = await this.accessControlManagementService.getAllRoles();

		return res.status(httpStatus.OK).send(response);
	};

	deleteRole = async (req: Request, res: Response) => {
		await this.accessControlManagementService.deleteRole(
			req.params.id
		);

		return res
			.status(httpStatus.NO_CONTENT)
			.send(SuccessResponse("Operation successful"));
	};

	getPermission = async (req: Request, res: Response) => {
		const response =
			await this.accessControlManagementService.getPermission(req.params.id);

			return res.status(httpStatus.OK).send(SuccessResponse("Operation successful", response));
	};

	getAllPermissions = async (res: Response) => {
		const response =
			await this.accessControlManagementService.getAllPermissions();

		return res.status(httpStatus.OK).send(SuccessResponse("Operation successful", response));
	};

	createPermission = async (req: Request, res: Response) => {
		const response =
			await this.accessControlManagementService.createPermission(req.body);

		return res.status(httpStatus.CREATED).send(SuccessResponse("Operation successful", response));
	}
}

export default AccessControlManagementController;