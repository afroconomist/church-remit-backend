export const profileUpdateRules = {
  firstName: "required|string",
  lastName: "required|string",
  middleName: "optional|string",
  phoneNumber: "required|min:11|max:13|phone",
  address: "required|string",
  role: "required|string",
  supervisorId: "required|uuid",
  region: "required|string",
  avatar: "required|string"
};
