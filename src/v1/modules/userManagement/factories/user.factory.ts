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
    user.role = data.role;
    user.supervisorId = data.supervisorId;
    user.password = data.password;
    user.address = data.address;
    user.region = data.region;
    user.addedBy = data.addedBy;


     
    return user;
  }
}

export default UserFactory;
