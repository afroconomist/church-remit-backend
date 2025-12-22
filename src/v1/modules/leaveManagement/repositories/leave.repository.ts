import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Leave, ILeave } from "../model/leave.model";

@injectable()
class LeaveRepository extends BaseRepository<ILeave, Leave> {
  constructor() {
    super(Leave);
  }
}

export default LeaveRepository;
