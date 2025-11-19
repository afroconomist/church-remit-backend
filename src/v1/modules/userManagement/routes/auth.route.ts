import express, { Request, Response } from "express";
import { container } from "tsyringe";
import AuthController from "../controller/auth.controller";
import { validate } from "@shared/middlewares/validator.middleware";
import { passwordResetRules } from "../validations/password-reset.validator";
import { resetPasswordRules } from "../validations/reset-password.validator";
import { changePasswordRules } from "../validations/change-password.validator";
import { loginRules } from "../validations/login.validator";
import { refreshTokenRules } from "../validations/refresh-token.validator";

const authController = container.resolve(AuthController);
const router = express.Router();

// auth routes
router.post("/auth/forgot-password", validate(passwordResetRules), (req: Request, res: Response) => {
  authController.forgetPassword(req, res);
});


router.post("/auth/resend-otp", validate(passwordResetRules), (req: Request, res: Response) => {
  authController.forgetPassword(req, res);
});

router.post("/auth/reset-password", validate(resetPasswordRules), (req: Request, res: Response) => {
  authController.passwordReset(req, res);
});

router.post("/auth/create-password", validate(changePasswordRules), (req: Request, res: Response) => {
  authController.createPassword(req, res);
});

router.post("/auth/login", validate(loginRules), (req: Request, res: Response) => {
  authController.login(req, res);
});

router.post("/auth/refreshToken", validate(refreshTokenRules), (req: Request, res: Response) => {
  authController.refreshToken(req, res);
});


export default router;
