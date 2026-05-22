import { AddMemberToGroup } from "../dtos/add-member.dto";
import { IGroupMember } from "../model/group_member.model";

class GroupMemberFactory {
  static addMemberToGroup(data: AddMemberToGroup) {
    const groupMember = {} as IGroupMember;

    groupMember.groupMemberName = data.groupMemberName;
    groupMember.groupMemberRole = data.groupMemberRole;
    groupMember.joined = data.joined;
    groupMember.status = data.status;
    groupMember.group = data.group;
    groupMember.churchMemberId = data.churchMemberId;

    return groupMember;
  }
}

export default GroupMemberFactory;
