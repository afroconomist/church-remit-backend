import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { ActionReason, IActionReason } from "../model/action_reason.model";

@injectable()
class ReasonRepository extends BaseRepository<IActionReason, ActionReason> {
  constructor() {
    super(ActionReason);
  }
}

export default ReasonRepository;
