import { SubmitLeaveRequest } from "../dtos/submit-leave-request.dto";
import { ILeave } from "../model/leave.model";

class LeaveFactory {
  static submitLeaveRequest(data: SubmitLeaveRequest) {
    const leave = {} as ILeave;

    leave.staffName = data.staffName;
    leave.leaveType = data.leaveType;
    leave.totalDays = data.totalDays;
    leave.startDate = data.startDate;
    leave.endDate = data.endDate;
    leave.reason = data.reason;
    leave.memberId = data.memberId;

    return leave;
  }
}

export default LeaveFactory;
