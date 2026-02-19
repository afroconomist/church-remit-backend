export type CreateAnnouncement = {
  title: string;
  content: Text;
  category: string;
  priority: string;
  startDate: Date;
  endDate?: Date;
  displayOnWebsite?: boolean;
  sendEmailNotification?: boolean;
  sendSMSNotification?: boolean;
  churchId: string;
};
