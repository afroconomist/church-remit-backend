import { CreateTransaction } from "../dtos/create-transaction.dto";
import { ITransaction } from "../model/transaction.model";

class TransactionFactory {
  static createTransaction(data: CreateTransaction) {
    const transaction = {} as ITransaction;

    transaction.userId = data.userId;
    transaction.accountNumber = data.accountNumber;
    transaction.amount = data.amount;
    transaction.recipientAccountNumber = data.recipientAccountNumber;
    transaction.recipientBankCode = data.recipientBankCode;
    transaction.recipientBankName = data.recipientBankName;
    transaction.recipientAccountName = data.recipientAccountName;
    transaction.transactionType = data.transactionType;
    transaction.transactionChannel = data.transactionChannel;
    transaction.nameEnquiryReference = data.nameEnquiryReference;
    transaction.reference = data.reference;
    transaction.narration = data.narration;
    transaction.callBackURL = data.callBackURL;
    
    return transaction;
  }
}

export default TransactionFactory;
