import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { GroupMember, IGroupMember } from "../model/group_member.model";

@injectable()
class GroupMemberRepository extends BaseRepository<IGroupMember, GroupMember> {
  constructor() {
    super(GroupMember);
  }
}

export default GroupMemberRepository;
