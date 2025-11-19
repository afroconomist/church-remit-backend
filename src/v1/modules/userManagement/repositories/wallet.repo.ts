import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Wallet, IWallet } from "../model/wallet.model";

@injectable()
class WalletRepo extends BaseRepository<IWallet, Wallet> {
  constructor() {
    super(Wallet);
  }
}

export default WalletRepo;
