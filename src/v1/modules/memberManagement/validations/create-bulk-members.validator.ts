export const uploadBulkMembersRules = [
  {
    firstName: "required|string",
    lastName: "required|string",
    email: "required|string|email",
    password: "required|string",
    phoneNumber: "required|min:11|max:13|phone",
    roleId: "required|uuid",
    addedBy: "required|uuid",
    churchId: "required|uuid",
  },
];
