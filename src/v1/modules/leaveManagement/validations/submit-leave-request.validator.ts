export const submitLeaveRequestRules = {
  leaveType: "required|string",
  totalDays: "required",
  startDate: "required|date",
  endDate: "required|date",
  reason: "required|string",
};
