
export type CreateWallet = {
  userId: string;
  accountNumber: string;
  balance: number;
  ledgerBalance: number;
  createdAt?: Date;
  updatedAt?: Date;
};
