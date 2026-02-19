import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { News, INews } from "../model/news.model";

@injectable()
class NewsRepository extends BaseRepository<INews, News> {
  constructor() {
    super(News);
  }
}

export default NewsRepository;
