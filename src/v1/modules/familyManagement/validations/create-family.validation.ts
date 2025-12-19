export const createFamilyRules = {
  primaryMember: "required|string",
  familyAddress: "required|string",
  primaryMemberEmail: "required|string|email",
  primaryMemberPhoneNumber: "required|min:11|max:13|phone",
  primaryMemberDOB: "required|date",
  primaryMemberRelationship: "required|string",
};
