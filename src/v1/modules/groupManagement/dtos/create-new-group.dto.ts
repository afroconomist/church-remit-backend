export interface GroupCriteriaInput {
  criteriaType: "age" | "gender" | "marital-status";
  minAge?: number;
  maxAge?: number;
  gender?: string;
  maritalStatus?: string;
}

export type CreateGroup = {
  groupName: string;
  category: string;
  description?: Text;
  groupLeader: string;
  capacity?: number;
  capacityTracker?: number;
  meetingDay: string;
  meetingTime: string;
  frequency: string;
  location: string;
  criteriaType?: string;
  minAge?: number;
  maxAge?: number;
  criterias?: GroupCriteriaInput[];
  publicGroup?: boolean;
  allowGuestInvites?: boolean;
  requireLeaderApproval?: boolean;
  enableGroupChat?: boolean;
  groupCreator: string;
  church: string;
};
