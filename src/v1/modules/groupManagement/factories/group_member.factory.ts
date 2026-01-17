import { AddMemberToGroup } from "../dtos/add-member.dto";
import { IGroupMember } from "../model/group_member.model";

class GroupMemberFactory {
  static addMemberToGroup(data: AddMemberToGroup) {
    const groupMember = {} as IGroupMember;

    groupMember.groupMemberName = data.groupMemberName;
    groupMember.groupMemberRole = data.groupMemberRole;
    groupMember.joined = data.joined;
    groupMember.status = data.status;
    groupMember.present = data.present;
    groupMember.absent = data.absent;
    groupMember.excused = data.excused;
    groupMember.group = data.group;

    return groupMember;
  }
}

export default GroupMemberFactory;
