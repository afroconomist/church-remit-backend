
export type CreateOTP = {
  userId: string;
  token: string;
  status: number;
  otpType: string,
  expiringDatetime: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
