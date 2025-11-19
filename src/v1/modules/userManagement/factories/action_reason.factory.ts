import { CreateReason } from "../dtos/create-reason.dto";
import { IActionReason } from "../model/action_reason.model";

class ActionReasonFactory {
  static createReason(data: CreateReason) {
    const reason = {} as IActionReason;

    reason.userId = data.userId;
    reason.action = data.action;
    reason.reason = data.reason;

    return reason;
  }
}

export default ActionReasonFactory;
