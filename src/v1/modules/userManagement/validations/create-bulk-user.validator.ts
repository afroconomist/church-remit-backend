export const uploadBulkUserRules = [{
    firstName: "required|string",
    lastName: "required|string",
    middleName: "optional|string",
    email: "required|string|email",
    phoneNumber: "required|min:11|max:13|phone",
    address: "required|string",
    idType: "required|string",
    idNumber: "required|string",
    role: "required|string",
    supervisorId: "required|uuid",
    region: "required|string",
  }]
  ;