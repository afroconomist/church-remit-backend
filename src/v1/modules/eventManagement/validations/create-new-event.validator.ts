export const createNewEventRules = {
  eventTitle: "required|string",
  description: "string",
  category: "required|string",
  location: "required|string",
  eventDate: "required|date",
  eventStartTime: "required|string",
  eventEndTime: "required|string",
  maximumCapacity: "required|numeric",
  recurring: "boolean",
  eventFrequency: "string|in:weekly,monthly,quarterly,yearly",
};
