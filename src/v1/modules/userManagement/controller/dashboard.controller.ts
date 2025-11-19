import { ErrorResponse, SuccessResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import UserService from "../services/user.service";

@injectable()
class DashboardController {
  constructor(private readonly userService: UserService) {}

  getProfile = async(req: Request, res) => {
    try {
      const result: any  = await this.userService.getProfile(req);
      return res.send(SuccessResponse(result.message, result));
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server: ", error));
    }
    
  };

  updateProfile = async(req: Request, res) => {
    try {
      const result: any  = await this.userService.updateProfile(req);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res.status(400).json({ status: result.success, message: result.message });
      }
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server: ", error));
    }
    
  };
  
}

export default DashboardController;
