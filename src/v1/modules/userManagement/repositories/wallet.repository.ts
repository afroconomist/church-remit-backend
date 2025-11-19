import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { IWallet, Wallet } from "../model/wallet.model";

@injectable()
class WalletRepository extends BaseRepository<IWallet, Wallet> {
  constructor() {
    super(Wallet);
  }
}

export default WalletRepository;
