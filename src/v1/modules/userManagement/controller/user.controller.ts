import { ErrorResponse, SuccessResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import UserService from "../services/user.service";
import httpStatus from "http-status";
import logger from "@shared/utils/logger";

@injectable()
class UserManagementController {
  constructor(private readonly userService: UserService) {}


  createUser = async (req: Request, res: Response) => {
    const result: any = await this.userService.createUser(req.body, req.user.id);
    return res.status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST).json(result);
  };

  uploadBulkUser = async (req: Request, res: Response) => {
    const result: any = await this.userService.uploadBulkUsers(req);
    if (result.success) {
      return res.status(200).json({status: result.success,message: result.message,data: result.data});
    } else {
      return res.status(400).json({ status: result.success, message: result.message });
    }
  };

  getProfile = async (req: Request, res: Response) => {
    const result: any = await this.userService.getProfile(req);
    return res.status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST).json(result);
  };

  getAll = async (req: Request, res) => {
    try {
      const users = await this.userService.getAllUsers(req);
      res.send(SuccessResponse("Operation successful", users));
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  exportUserToCSV = async (req: Request, res: Response) => {
    try {
      const { csvContent, fileName } = await this.userService.exportUser(req);
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition",`attachment; filename="${fileName}.csv"`);
  
      res.send(csvContent);
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server Error: ", error.message));
    }
  }

  deactiveUserAccount = async (req: Request, res: Response) => {
    try {
        const result = await this.userService.deactivateUserAccount(req);
        return res.status(result.success ? 200 : 400).json({ status: result.success, message: result.message });
    } catch (error: any) {
        logger.error({ error: error.message }, "Error in deactiveUserAccount:");
        return res.status(500).json({ status: false, message: error.message || "Failed to deactivate user account" });
    }
};
  
  reactiveUserAccount = async (req: Request, res: Response) => {
    try {
      const result = await this.userService.reactivateUserAccount(req);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res.status(400).json({ status: result.success, message: result.message });
      }
    } catch (error: any) {
      logger.error({error: error.message}, "Error deactivating user");
      return res.status(500).json({ status: false, message: "Failed to reactivate user account" });
    }
  };


  updateUser = async(req: Request, res: Response) => {
    try {
      const result: any  = await this.userService.updateUser(req);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res.status(400).json({ status: result.success, message: result.message });
      }
    } catch (error) {
      return res.status(500).json({ status: false, message: "Failed to update user account" });
    }    
  };
  
  uploadSignature = async (req: Request, res: Response) => {
		const role: any = await this.userService.uploadSignature(
      req,
			res
		);
		return res
			.status(httpStatus.CREATED)
			.send(SuccessResponse("Profile Picture uploaded successfully", role));
	};

  profilePictureUpload = async (req: Request, res: Response) => {
    const role: any = await this.userService.uploadProfilePicture(
        req,
        res
    );
    return res
        .status(httpStatus.CREATED)
        .send(SuccessResponse("Profile Picture uploaded successfully", role));
};


setTransactionPin = async (req: Request, res: Response) => {
  return await this.userService.setTransactionPin(
      req,
      res
  );
};

updateTransactionPin = async (req: Request, res: Response) => {
  return await this.userService.setTransactionPin(
      req,
      res
  );
};

getUser = async (req: Request, res: Response) => {
    const response = await this.userService.getUser(
      req.params.id
    );

    return res
      .status(httpStatus.OK)
      .send(SuccessResponse("Operation successful", response));
  };

  deleteUser = async (req: Request, res: Response) => {
    const response = await this.userService.deleteUser(
      req
    );

    return res
      .status(httpStatus.OK)
      .send(SuccessResponse(response));
  };

  uploadFile = async (req: Request, res: Response): Promise<void> => {
    const response = await this.userService.uploadFile(req);
  
	  res.send(SuccessResponse("Operation successful", { url: response }));
	};
}

export default UserManagementController;
