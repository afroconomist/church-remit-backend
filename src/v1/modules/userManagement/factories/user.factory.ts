import { CreateUser } from "../dtos/create-user.dto";
import { IUser } from "../model/user.model";

class UserFactory {
  static createUser(data: CreateUser) {
    const user = {} as IUser;

    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.middleName = data.middleName;
    user.email = data.email;
    user.phoneNumber = data.phoneNumber;
    user.password = data.password;
    user.address = data.address;
    user.addedBy = data.addedBy;
    user.isDefaultPassword = data.isDefaultPassword;
    user.churchId = data.churchId;
    user.campusId = data.campusId;
    user.roleId = data.roleId;
     
    return user;
  }
}

export default UserFactory;
