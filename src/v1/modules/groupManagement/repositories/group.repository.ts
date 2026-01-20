import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Group, IGroup } from "../model/group.model";

@injectable()
class GroupRepository extends BaseRepository<IGroup, Group> {
  constructor() {
    super(Group);
  }
}

export default GroupRepository;
