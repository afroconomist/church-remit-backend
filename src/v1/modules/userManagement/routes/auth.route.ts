import express, { Request, Response } from "express";
import { container } from "tsyringe";
import AuthController from "../controller/auth.controller";
import { validate } from "@shared/middlewares/validator.middleware";
import { passwordResetRules } from "../validations/password-reset.validator";
import { resetPasswordRules } from "../validations/reset-password.validator";
import { changePasswordRules } from "../validations/change-password.validator";
import { loginRules } from "../validations/login.validator";
import { confirmOTPRules } from "../validations/confirm-otp.validator";
import { resendOTPRules } from "../validations/resend-otp.validator";
import { refreshTokenRules } from "../validations/refresh-token.validator";

const authController = container.resolve(AuthController);
const router = express.Router();

router.post(
  "/auth/verify-otp",
  validate(confirmOTPRules),
  (req: Request, res: Response) => authController.verifyOtp(req, res)
);

router.post(
  "/auth/resend-otp",
  validate(resendOTPRules),
  (req: Request, res: Response) => authController.resendOtp(req, res)
);

router.post(
  "/auth/request-password-reset",
  validate(passwordResetRules),
  (req: Request, res: Response) => {
    authController.requestPasswordReset(req, res);
  }
);

router.post(
  "/auth/reset-password",
  validate(resetPasswordRules),
  (req: Request, res: Response) => {
    authController.resetPassword(req, res);
  }
);

router.post(
  "/auth/create-password",
  validate(changePasswordRules),
  (req: Request, res: Response) => {
    authController.createPassword(req, res);
  }
);

router.post(
  "/auth/login",
  validate(loginRules),
  (req: Request, res: Response) => {
    authController.login(req, res);
  }
);

router.post(
  "/auth/refreshToken",
  validate(refreshTokenRules),
  (req: Request, res: Response) => {
    authController.refreshToken(req, res);
  }
);

export default router;
