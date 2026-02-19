export type CreateNews = {
  headline: string;
  shortSummary: Text;
  fullArticle: Text;
  media?: Text;
  province: string;
  publishDate: Date;
  publishTime: string;
  postedAt: Date;
  featureThisNews?: boolean;
  showOnHomepage?: boolean;
  churchId: string;
};
