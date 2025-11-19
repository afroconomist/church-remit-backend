export type CreateTransaction = {
  userId: string;
  accountNumber: string;
  amount: number;
  narration: string;
  recipientAccountNumber: string,
  recipientBankCode: string,
  recipientBankName: string,
  recipientAccountName: string
  transactionType: string;
  transactionChannel: string;
  reference: string;
  nameEnquiryReference: string;
  status: string;
  transactionPin: string;
  callBackURL: string
};

export type transactionPayload = {
  userId: string,
  amount: number,
  destinationAccountNumber: string,
  destinationBankCode: string,
  destinationBankName: string,
  destinationAccountName: string
}
