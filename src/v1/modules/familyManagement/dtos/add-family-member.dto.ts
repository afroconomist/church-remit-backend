export type AddFamilyMember = {
  memberName: string;
  memberEmail: string;
  memberPhoneNumber?: string;
  memberDOB: Date;
  memberAddress: string;
  memberRelationship: string;
  primary?: boolean;
  familyId: string;
};
