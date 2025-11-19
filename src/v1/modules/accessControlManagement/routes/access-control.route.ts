import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { validate } from "@shared/middlewares/validator.middleware";

import AccessControlManagementController from "../controller/access-control-management.controller";
import {
	createRoleRules,
	updateRoleRules,
	getRoleRules,
	deleteRoleRules,
} from "../validations/access-control.validator";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";

const accessControlManagementController = container.resolve(
	AccessControlManagementController
);
const router = express.Router();

router.post(
	"/admin/roles",
	[
		validate(createRoleRules),
		authMiddleware,
		accessControlMiddleware(AccessControls.ROLE_CREATION)
	],
	(req: Request, res: Response, next) => {
		accessControlManagementController.createRole(req, res).catch(e => next(e));
	}
);

router.get(
	"/admin/roles/:id",
	[
		validate(getRoleRules),
		authMiddleware,
		accessControlMiddleware(AccessControls.ROLE_LIST),
	],
	(req: Request, res: Response, next) => {
		accessControlManagementController.getRole(req, res).catch(e => next(e));
	}
);

router.get(
	"/admin/roles",
	[authMiddleware, accessControlMiddleware(AccessControls.ROLE_LIST)],
	(_req: Request, res: Response, next) => {
		accessControlManagementController.getAllRoles(res).catch(e => next(e));
	}
);

router.put(
	"/admin/roles/:id",
	[
		validate(updateRoleRules),
		authMiddleware,
		accessControlMiddleware(AccessControls.ROLE_UPDATE)
	],
	(req: Request, res: Response, next) => {
		accessControlManagementController.updateRole(req, res).catch(e => next(e));
	}
);

router.delete(
	"/admin/roles/:id",
	[
		validate(deleteRoleRules),
		authMiddleware,
		accessControlMiddleware(AccessControls.ROLE_DELETION),
	],
	(req: Request, res: Response, next) => {
		accessControlManagementController.deleteRole(req, res).catch(e => next(e));
	}
);

router.get("/admin/permissions/:id", (req: Request, res: Response, next) => {
	accessControlManagementController.getPermission(req, res).catch(e => next(e));
});

router.get("/admin/permissions", (_req: Request, res: Response, next) => {
	accessControlManagementController.getAllPermissions(res).catch(e => next(e));
});

router.post("/admin/permissions", (req: Request, res: Response, next) => {
	accessControlManagementController.createPermission(req, res).catch(e => next(e));
});

export default router;