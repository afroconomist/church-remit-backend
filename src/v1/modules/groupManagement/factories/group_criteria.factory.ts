import { IGroupCriteria } from "../model/group_criteria.model";

export interface CreateGroupCriteria {
  criteriaType: "age" | "gender" | "marital-status";
  minAge?: number;
  maxAge?: number;
  status?: string;
  sex?: string;
  groupId: string;
}

class GroupCriteriaFactory {
  static createGroupCriteria(data: CreateGroupCriteria) {
    const criteria = {} as IGroupCriteria;

    criteria.criteriaType = data.criteriaType;
    criteria.minAge = data.minAge;
    criteria.maxAge = data.maxAge;
    criteria.sex = data.sex;
    criteria.status = data.status;
    criteria.groupId = data.groupId;

    return criteria;
  }
}

export default GroupCriteriaFactory;
