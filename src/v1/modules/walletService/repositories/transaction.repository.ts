import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { ITransaction, Transaction } from "../model/transaction.model";

@injectable()
class TransactionRepository extends BaseRepository<ITransaction, Transaction> {
  constructor() {
    super(Transaction);
  }
}

export default TransactionRepository;
