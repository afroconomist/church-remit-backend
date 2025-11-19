import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { createUserRules } from "../validations/create-user.validator";
import { profilePictureUploadRules } from "../validations/profile-picture.validator";
import { uploadBulkUserRules } from "../validations/create-bulk-user.validator";
import {
  validate,
  validateArray,
} from "@shared/middlewares/validator.middleware";
import { updateUserRules } from "../validations/update-user.validator";
import { signatureUploadRules } from "../validations/signature.validator";
import { setTransactionPinRules, updateTransactionPin } from "../validations/set-transaction-pin.validator";
import UserManagementController from "../controller/user.controller";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";

const userController = container.resolve(UserManagementController);
import { getSingleUserRules } from "../validations/get-single-user.validator";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

import { deactivateReasonRules } from "../validations/deactivation-reason.validator";
import { deleteReasonRules } from "../validations/delete-reason.validator";

const router = express.Router();


router.post("/admin/create-user", [authMiddleware, accessControlMiddleware(AccessControls.USER_ONBOARDING), validate(createUserRules)], (req: Request, res: Response, next) => userController.createUser(req, res).catch((err)=> next(err) )
);

router.post("/admin/upload-bulk-user", [authMiddleware, accessControlMiddleware(AccessControls.BULK_USER_ONBOARDING), validateArray(uploadBulkUserRules)], (req: Request, res: Response) => 
  userController.uploadBulkUser(req, res)
);

router.get("/admin/fetch-users", [authMiddleware, accessControlMiddleware(AccessControls.USER_LIST)], (req: Request, res: Response) => {
  userController.getAll(req, res);
});

router.get("/admin/export-users", [authMiddleware, accessControlMiddleware(AccessControls.USER_LIST)], (req: Request, res: Response) => {
  userController.exportUserToCSV(req, res);
});

router.post("/admin/reactivate-user/:id", [authMiddleware, accessControlMiddleware(AccessControls.USER_ACCOUNT_REACTIVATION)], (req: Request, res: Response) => {
  userController.reactiveUserAccount(req, res);
});


router.post("/admin/deactivate-user/:id", [authMiddleware, validate(deactivateReasonRules), accessControlMiddleware(AccessControls.USER_ACCOUNT_DEACTIVATION)], (req: Request, res: Response) => {
  userController.deactiveUserAccount(req, res);
});

router.put("/admin/update-user/:id", [authMiddleware, accessControlMiddleware(AccessControls.USER_PROFILE_UPDATE), validate(updateUserRules)], (req: Request, res: Response) => {
  userController.updateUser(req, res);
});

router.post("/dashboard/upload-signature", [
  authMiddleware,
  accessControlMiddleware(AccessControls.USER_PROFILE_UPDATE), 
  validate(signatureUploadRules)], (req: Request, res: Response, next) => userController.uploadSignature(req, res).catch((err)=> next(err) ))

router.post("/dashboard/upload-profile-pic", [
  authMiddleware,
  accessControlMiddleware(AccessControls.USER_PROFILE_UPDATE),
  validate(profilePictureUploadRules)], (req: Request, res: Response, next) => userController.profilePictureUpload(req, res).catch((err)=> next(err) )
);

router.post("/dashboard/set-transaction-pin", [authMiddleware, accessControlMiddleware(AccessControls.TRANSACTION_PIN), validate(setTransactionPinRules)], (req: Request, res: Response, next) => userController.setTransactionPin(req, res).catch((err)=> next(err) )
);

router.post("/dashboard/update-transaction-pin", [authMiddleware, accessControlMiddleware(AccessControls.TRANSACTION_PIN), validate(updateTransactionPin)], (req: Request, res: Response, next) => userController.updateTransactionPin(req, res).catch((err)=> next(err) )
);

router.get(
  "/admin/user/:id",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.USER_LIST),
    validate(getSingleUserRules),
  ],
  (req: Request, res: Response, next) => {
    userController.getUser(req, res).catch((e) => next(e));
  }
);

router.delete(
  "/admin/user/:id",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.USER_LIST),
    validate(deleteReasonRules),
  ],
  (req: Request, res: Response, next) => {
    userController.deleteUser(req, res).catch((e) => next(e));
  }
);

router.post(
	"/upload-media",
	upload.single("file"),
	(req: Request, res: Response, next) => {
		userController.uploadFile(req, res).catch((e) => next(e));
	}
);

export default router;
