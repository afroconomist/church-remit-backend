export interface IWalletResponse<T>{
    status: boolean;
    message: string;
    data: T;
   }
   
   export interface ResolveAccountNumber {
       accountNumber: string;
       bankCode: string;
   }

   export interface IResolveAccountNumberResponse {
    bankName: string;
    accountName: string;
    accountNumber: string;
    bankCode: string;
    nameEnquiryReference: string
}

export interface TransferDetails {
    reference: string;
    amount: number;
    narration: string;
    senderAccountName: string;
    senderAccountNumber: string;
    nameEnquiryReference: string;
    recipientAccountName: string;
    recipientAccountNumber: string;
    recipientBankCode: string;
  }
