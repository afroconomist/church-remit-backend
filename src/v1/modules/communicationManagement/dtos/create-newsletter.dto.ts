export type CreateNewsletter = {
  newsletterTitle: string;
  emailSubjectLine: string;
  emailContent: Text;
  audience: string;
  includeAttachements?: boolean;
  sendImmediately?: boolean;
  sendDate?: Date;
  sendTime?: string;
  postedAt: Date;
  recipients?: number;
  churchId: string;
};
