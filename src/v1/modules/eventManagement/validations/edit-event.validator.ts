export const editEventRules = {
  eventTitle: "required|string",
  description: "string",
  category: "required|string",
  location: "required|string",
  eventDate: "required|date",
  eventStartTime: "required|string",
  eventEndTime: "required|string",
  maximumCapacity: "numeric",
  registration: "boolean",
  recurring: "boolean",
  eventFrequency: "string",
  campusId: "string",
};
