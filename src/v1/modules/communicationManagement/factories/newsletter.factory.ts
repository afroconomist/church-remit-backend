import { CreateNewsletter } from "../dtos/create-newsletter.dto";
import { INewsletter } from "../model/newsletter.model";

class NewsletterFactory {
  static createNewsletter(data: CreateNewsletter) {
    const newsletter = {} as INewsletter;

    newsletter.newsletterTitle = data.newsletterTitle;
    newsletter.emailSubjectLine = data.emailSubjectLine;
    newsletter.emailContent = data.emailContent;
    newsletter.audience = data.audience;
    newsletter.includeAttachements = data.includeAttachements;
    newsletter.sendImmediately = data.sendImmediately;
    newsletter.sendDate = data.sendDate;
    newsletter.sendTime = data.sendTime;
    newsletter.postedAt = data.postedAt;
    newsletter.recipients = data.recipients;
    newsletter.churchId = data.churchId;

    return newsletter;
  }
}

export default NewsletterFactory;
