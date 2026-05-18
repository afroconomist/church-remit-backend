import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { GroupCriteria, IGroupCriteria } from "../model/group_criteria.model";

@injectable()
class GroupCriteriaRepository extends BaseRepository<
  IGroupCriteria,
  GroupCriteria
> {
  constructor() {
    super(GroupCriteria);
  }
}

export default GroupCriteriaRepository;
