import { ErrorResponse, SuccessResponse } from "@shared/utils/response.util";
import { Request } from "express";
import { injectable } from "tsyringe";
import AuthService from "../services/auth.service";
import ServiceUnavailableError from "@shared/error/service-unavailable.error";
import httpStatus from "http-status";

@injectable()
class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  forgetPassword = async(req: Request, res) => {
    try {
      const result: any  = await this.authService.forgetPassword(req.body);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res.status(400).json({ status: result.success, message: result.message });
      }
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server: ", error));
    }
  };

  passwordReset = async(req: Request, res) => {
    try {
      const result: any  = await this.authService.resetPassword(req.body);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res.status(400).json({ status: result.success, message: result.message });
      }
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server: ", error));
    }
    
  };

  createPassword = async(req: Request, res) => {
    try {
      const result: any  = await this.authService.changePasswordOnFirstLogin(req.body);
      if (result.success) {
        return res.send(SuccessResponse(result.message, result.data));
      } else {
        return res.status(400).json({ status: result.success, message: result.message });
      }
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server: ", error));
    }
    
  };

  login = async(req: Request, res) => {
    try {
      const result: any  = await this.authService.login(req.body);
      return res.status(result.status ? httpStatus.OK : httpStatus.BAD_REQUEST).json(result);
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server: ", error));
    }
    
  };

  refreshToken = async(req: Request, res) => {
    try {
      const result: any  = await this.authService.refreshToken(req.body);
      return res.send(SuccessResponse(result.message, result.data)); 
    } catch (error: any) {
      throw new ServiceUnavailableError(error.message)
    }

  };
}

export default AuthController;
