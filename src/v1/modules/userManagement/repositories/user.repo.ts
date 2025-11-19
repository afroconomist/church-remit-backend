import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { User, IUser } from "../model/user.model";

@injectable()
class UserRepo extends BaseRepository<IUser, User> {
  constructor() {
    super(User);
  }
}

export default UserRepo;
