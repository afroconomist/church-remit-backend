export type CreateNewEvent = {
  eventTitle: string;
  description: Text;
  category: string;
  location: string;
  eventDate: string;
  nextEventDate?: string;
  eventStartTime: Date;
  eventEndTime: Date;
  maximumCapacity: number;
  maximumCapacityTracker: number;
  registration: boolean;
  recurring?: boolean;
  eventFrequency?: "weekly" | "monthly" | "quarterly" | "yearly";
  church: string;
};
