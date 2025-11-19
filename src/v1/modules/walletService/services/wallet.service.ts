import { injectable } from "tsyringe";
import WalletRepository from "../repositories/wallet.repository";
import AppError from "@shared/error/app.error";
import { CreateTransaction } from "../dtos/create-transaction.dto";
import TransactionRepository from "../repositories/transaction.repository";
import TransactionFactory from "../factories/transaction.factory";
import { ITransaction } from "../model/transaction.model";
import logger from "@shared/utils/logger";
import ServiceUnavailableError from "@shared/error/service-unavailable.error";
import { generateTransactionReference } from "@shared/utils/functions.util";
import { ExternalWalletService } from "@shared/external-services/wallets/wallets.service";
import { ResolveAccountNumber } from "@shared/external-services/wallets/wallets.interface";
import UserService from "../../userManagement/services/user.service";
import { bcryptCompareHashedString } from "@shared/utils/hash.util";
import appConfig from "@config/app.config";

@injectable()
class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly externalWalletService: ExternalWalletService,
    private readonly userService: UserService
  ) {}

  async getWallet(userId: string) {
    const wallet = await this.walletRepository.findOneWhere({ userId: userId });
    if (!wallet) {
      throw new AppError(400, "Wallet not found");
    }
    return {
      id: wallet?.id,
      accountNumber: wallet?.accountNumber,
      walletId: wallet?.walletId,
      balance: wallet?.balance,
    };
  }

  public async getAllBanks() {
    return await this.externalWalletService.getAllBanks();
  }

  public async resolveAccountNumber(payload: ResolveAccountNumber) {
    return await this.externalWalletService.resolveAccountNumber(payload);
  }

  async debitWallet(userId: string, amount: number) {
    const wallet = await this.getWallet(userId);
    await this.checkBalance(userId, amount);
    const newBalance = wallet.balance - amount;
    await this.walletRepository.updateById(wallet.id, {
      balance: newBalance,
    });
    return wallet;
  }

  async checkBalance(userId: string, amount: number) {
    const wallet = await this.getWallet(userId);
    if (amount <= 0) {
      throw new AppError(400, "Amount must be greater than zero");
    }
    if (wallet.balance < amount) {
      throw new Error("Insufficient funds");
    }
    return wallet;
  }

  async transfer(userId: string, transferData: CreateTransaction) {
    try {
      const wallet = await this.getWallet(userId);
      const user = await this.userService.userInformation(userId);
      await this.validatePin(transferData.transactionPin, user.transactionPin);
      await this.checkBalance(userId, transferData.amount);
      await this.debitWallet(userId, transferData.amount);

      const reference = await generateTransactionReference();
      transferData.accountNumber = wallet.accountNumber;
      transferData.userId = userId;
      transferData.transactionType = "debit";
      transferData.transactionChannel = "withdrawal";
      transferData.callBackURL = appConfig.app.base_url+"/v1/wallet/transfer-callback";
      transferData.reference = reference;
      await this.logTransaction({ ...transferData });
      await this.externalWalletService.processTransfer({
        ...transferData,
        senderAccountName: user.firstName+ " "+user.lastName,
        senderAccountNumber: wallet.accountNumber,
      });
      return transferData;
    } catch (error: any) {
      logger.error(error, "Unable to process transaction");
      throw new AppError(400, error.message);
    }
  }

  async validatePin(transactionPin: string, hashedPin: string) {
    const pinMatch = await bcryptCompareHashedString(transactionPin, hashedPin);
    if (!pinMatch) {
      throw new AppError(400, "Transaction Pin is incorrect. Kindly check!");
    }
  }

  async logTransaction(transactionData: CreateTransaction) {
    const repository = new TransactionRepository();
    const existingTransaction = await repository.findOneWhere({
      reference: transactionData.reference,
    });
    if (existingTransaction) {
      throw new AppError(400, "Duplicate transaction detected");
    }
    const transaction = TransactionFactory.createTransaction(transactionData);

    return await this.transactionRepository
      .save(transaction)
      .catch((error) => this.handleTransactionError(transaction, error));
  }

  async transactionHistory(userId: string) {
    return await this.transactionRepository.findWhere({ userId });
  }

  async callBackProcess(payload: { status: string; reference: string }) {
    try {
      const transaction = await this.transactionRepository.findOneWhere({
        reference: payload.reference,
        status: 'pending'
      });
      if (!transaction) {
        throw new AppError(400, "Transaction does not exist");
      }
      if (payload.status !== "successful") {
        const wallet = await this.getWallet(transaction?.userId);
        const newBalance = wallet.balance + transaction.amount;
        await this.walletRepository.updateById(wallet.id, {
          balance: newBalance,
        });
      }
      await this.transactionRepository.updateById(transaction?.id, {
        status: payload.status,
      });
      return payload;
    } catch (error: any) {
      logger.error(error, "Unable to process transaction");
      throw new AppError(400, error.message);
    }
  }

  private handleTransactionError = (transaction: ITransaction, error: any) => {
    logger.error(
      { error, transaction },
      "TransactionService[handleTransactionError]: Error occured creating Transaction."
    );
    throw new ServiceUnavailableError();
  };
}

export default WalletService;
