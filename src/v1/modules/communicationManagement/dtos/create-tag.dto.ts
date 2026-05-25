export type CreateTag = {
  tagName: string;
  description: string;
  color: string;
  defaultAssignment: string;
  slug?: string;
  campusId?: string;
  churchId: string;
};
