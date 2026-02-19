import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Newsletter, INewsletter } from "../model/newsletter.model";

@injectable()
class NewsletterRepository extends BaseRepository<INewsletter, Newsletter> {
  constructor() {
    super(Newsletter);
  }
}

export default NewsletterRepository;
