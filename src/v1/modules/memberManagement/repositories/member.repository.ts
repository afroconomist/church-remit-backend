import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Member, IMember } from "../model/member.model";

@injectable()
class MemberRepository extends BaseRepository<IMember, Member> {
  constructor() {
    super(Member);
  }
}

export default MemberRepository;
