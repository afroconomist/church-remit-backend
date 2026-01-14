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
    leave.submittedAt = data.submittedAt;
    leave.approvedAt = data.approvedAt;
    leave.approvedBy = data.approvedBy;
    leave.memberId = data.memberId;
    leave.church = data.church;

    return leave;
  }
}

export default LeaveFactory;
