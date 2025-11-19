
export type IDVerification = {
  userId: string;
  idType: string;
  idNumber: string;
  issuingDate: Date;
  expiringDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
