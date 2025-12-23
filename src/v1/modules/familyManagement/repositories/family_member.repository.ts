import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { FamilyMember, IFamilyMember } from "../model/family_member.model";

@injectable()
class FamilyMemberRepository extends BaseRepository<
  IFamilyMember,
  FamilyMember
> {
  constructor() {
    super(FamilyMember);
  }
}

export default FamilyMemberRepository;
