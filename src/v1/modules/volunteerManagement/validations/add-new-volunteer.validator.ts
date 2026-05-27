export const addNewVolunteerRules = {
  firstName: "required|string",
  lastName: "required|string",
  email: "required|string",
  phoneNumber: "required|string",
  skills: "array|required",
  availability: "array|required",
};
