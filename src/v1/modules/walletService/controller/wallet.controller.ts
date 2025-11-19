import { Response, Request } from "express";
import { SuccessResponse } from "@shared/utils/response.util";
import { injectable } from "tsyringe";
import WalletService from "../services/wallet.service";
import { NextFunction } from "express-serve-static-core";

@injectable()
class WalletController {
  constructor(private readonly walletService: WalletService) {}

  getAllBanks = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const allBanks = await this.walletService.getAllBanks();
      res.send(SuccessResponse("Operation successful", allBanks));
    } catch (error) {
      next(error);
    }
  };
  resolveAccountNumber = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.walletService.resolveAccountNumber(req.body);
      res.send(SuccessResponse("Operation successful", response));
    } catch (error) {
      next(error);
    }
  };
  withdraw = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.walletService.transfer(req.user.id, req.body);
      res.send(SuccessResponse("Operation successful", response));
    } catch (error) {
      next(error);
    }
  };

  transactionHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.walletService.transactionHistory(req.user.id);
      res.send(SuccessResponse("Operation successful", response));
    } catch (error) {
      next(error);
    }
  };

  transferCallBack = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.walletService.callBackProcess(req.body);
      res.send(SuccessResponse("Operation successful", response));
    } catch (error) {
      next(error);
    }
  };
}

export default WalletController;
