import express from "express";
import { container } from "tsyringe";
import WalletController from "../controller/wallet.controller";
import { validate } from "@shared/middlewares/validator.middleware";
import { createTransferRules } from "../validations/transfer.validator";
import { resolveAccountNumberRules } from "../validations/resolveAccount.validator";
import { transferCallbackRules } from "../validations/transferCallback.validator";
import authMiddleware from "@shared/middlewares/auth.middleware";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";

const walletController = container.resolve(WalletController);
const router = express.Router();

router.get("/wallet/get-all-banks", [authMiddleware, accessControlMiddleware(AccessControls.WALLET)], (req, res, next) => walletController.getAllBanks(req, res, next));

router.post("/wallet/resolve-account", [authMiddleware, accessControlMiddleware(AccessControls.WALLET), validate(resolveAccountNumberRules)], (req, res, next) => walletController.resolveAccountNumber(req, res, next));

router.post("/wallet/withdraw", [authMiddleware, accessControlMiddleware(AccessControls.WALLET), validate(createTransferRules)], (req, res, next) => walletController.withdraw(req, res, next));

router.get("/wallet/transaction-history", [authMiddleware, accessControlMiddleware(AccessControls.WALLET)], (req, res, next) => walletController.transactionHistory(req, res, next));

router.post("/wallet/transfer-callback", [validate(transferCallbackRules)], (req, res, next) => walletController.transferCallBack(req, res, next));

export default router;
