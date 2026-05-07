export type CreateNewEvent = {
  eventTitle: string;
  description: Text;
  category: string;
  location: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  maximumCapacity: number;
  maximumCapacityTracker: number;
  registration: boolean;
  recurring?: boolean;
  eventFrequency?: "weekly" | "monthly" | "quarterly" | "yearly";
  church: string;
};
