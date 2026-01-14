export type SubmitLeaveRequest = {
  staffName: string;
  leaveType: string;
  totalDays: number;
  startDate: Date;
  endDate: Date;
  reason: string;
  submittedAt?: Date;
  approvedAt?: Date;
  approvedBy?: string;
  memberId: string;
  church: string;
};
