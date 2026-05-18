import { IGroupCriteria } from "../model/group_criteria.model";

export interface CreateGroupCriteria {
  criteriaType: "age" | "gender" | "marital-status";
  minAge?: number;
  maxAge?: number;
  gender?: string;
  maritalStatus?: string;
  groupId: string;
}

class GroupCriteriaFactory {
  static createGroupCriteria(data: CreateGroupCriteria) {
    const criteria = {} as IGroupCriteria;

    criteria.criteriaType = data.criteriaType;
    criteria.minAge = data.minAge;
    criteria.maxAge = data.maxAge;
    criteria.gender = data.gender;
    criteria.maritalStatus = data.maritalStatus;
    criteria.groupId = data.groupId;

    return criteria;
  }
}

export default GroupCriteriaFactory;
