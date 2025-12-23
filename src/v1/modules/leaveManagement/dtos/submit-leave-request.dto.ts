export type SubmitLeaveRequest = {
  staffName: string;
  leaveType: string;
  totalDays: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  memberId: string;
};
