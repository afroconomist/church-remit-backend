export interface GroupCriteriaInput {
  criteriaType: "age" | "gender" | "marital-status";
  minAge?: number;
  maxAge?: number;
  sex?: string;
  status?: string;
}

export type CreateGroup = {
  groupName: string;
  category: string;
  description?: Text;
  capacity?: number;
  capacityTracker?: number;
  meetingDay: string;
  meetingTime: string;
  frequency: string;
  location: string;
  criterias?: GroupCriteriaInput[];
  publicGroup?: boolean;
  allowGuestInvites?: boolean;
  requireLeaderApproval?: boolean;
  enableGroupChat?: boolean;
  groupCreator: string;
  campusId?: string;
  church: string;
};
