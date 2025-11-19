
export type CreateUser = {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  avatar?: string;
  status?: string;
  isDefaultPassword?: boolean;
  idType?: string;
  idNumber?: string;
  role: string;
  supervisorId?: string;
  transactionPin?: string;
  region: string;
  refreshToken?: string;
  signature?: string
  addedBy: string
  createdAt?: Date;
  updatedAt?: Date;
};
