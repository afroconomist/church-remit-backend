import { CreateWallet } from "../dtos/create-wallet.dto";
import { IWallet } from "../model/wallet.model";

class WalletFactory {
  static createWallet(data: CreateWallet) {
    const wallet = {} as IWallet;

    wallet.userId = data.userId;
    wallet.accountNumber = data.accountNumber;
    wallet.balance = 0.00;
    wallet.ledgerBalance = 0.00;
    
    return wallet;
  }
}

export default WalletFactory;
