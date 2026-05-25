import { CreateNews } from "../dtos/create-news.dto";
import { INews } from "../model/news.model";

class NewsFactory {
  static createNews(data: CreateNews) {
    const news = {} as INews;

    news.headline = data.headline;
    news.shortSummary = data.shortSummary;
    news.fullArticle = data.fullArticle;
    news.media = data.media;
    news.province = data.province;
    news.publishDate = data.publishDate;
    news.publishTime = data.publishTime;
    news.postedAt = data.postedAt;
    news.featureThisNews = data.featureThisNews;
    news.showOnHomepage = data.showOnHomepage;
    news.campusId = data.campusId;
    news.churchId = data.churchId;

    return news;
  }
}

export default NewsFactory;
