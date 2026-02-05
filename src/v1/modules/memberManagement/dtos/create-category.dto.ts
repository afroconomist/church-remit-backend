export type CreateCategory = {
  categoryName: string;
  description: Text;
  categoryType: string;
  slug?: string;
  churchId: string;
};
