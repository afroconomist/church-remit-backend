import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import {
  MemberBirthday,
  IMemberBirthday,
} from "../model/member_birthday.model";

@injectable()
class MemberBirthdayRepository extends BaseRepository<
  IMemberBirthday,
  MemberBirthday
> {
  constructor() {
    super(MemberBirthday);
  }
}

export default MemberBirthdayRepository;
