import { CreateWallet } from "../dtos/create-wallet.dto";
import { IWallet } from "../model/wallet.model";

class WalletFactory {
  static createWallet(data: CreateWallet) {
    const wallet = {} as IWallet;

    wallet.userId = data.userId;
    wallet.walletId = data.walletId;
    wallet.accountNumber = data.accountNumber;

    return wallet;
  }
}

export default WalletFactory;
