
export type CreateUser = {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  address?: string;
  avatar?: string;
  status?: string;
  isDefaultPassword?: boolean;
  roleId?: string;
  refreshToken?: string;
  addedBy?: string;
  churchId?: string;
  campusId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
