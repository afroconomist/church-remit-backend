import { CreateGroup } from "../dtos/create-new-group.dto";
import { IGroup } from "../model/group.model";

class GroupFactory {
  static createGroup(data: CreateGroup) {
    const group = {} as IGroup;

    group.groupName = data.groupName;
    group.category = data.category;
    group.description = data.description;
    group.groupLeader = data.groupLeader;
    group.capacity = data.capacity;
    group.capacityTracker = data.capacityTracker;
    group.meetingDay = data.meetingDay;
    group.meetingTime = data.meetingTime;
    group.frequency = data.frequency;
    group.location = data.location;
    group.criteriaType = data.criteriaType;
    group.minAge = data.minAge;
    group.maxAge = data.maxAge;
    group.publicGroup = data.publicGroup;
    group.allowGuestInvites = data.allowGuestInvites;
    group.requireLeaderApproval = data.requireLeaderApproval;
    group.enableGroupChat = data.enableGroupChat;
    group.groupCreator = data.groupCreator;
    group.church = data.church;

    return group;
  }
}

export default GroupFactory;
