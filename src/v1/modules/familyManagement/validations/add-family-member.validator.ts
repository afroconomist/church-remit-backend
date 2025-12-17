export const addFamilyMemberRules = {
  memberName: "required|string",
  memberEmail: "required|string|email",
  memberPhoneNumber: "required|min:11|max:13|phone",
  memberDOB: "required|date",
  memberAddress: "required|string",
  memberRelationship: "required|string",
};
