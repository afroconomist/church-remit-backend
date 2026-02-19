export type CreateDiscussionBoard = {
  boardName: string;
  description: string;
  welcomeMessage: string;
  visibility: string;
  whoCanPost: string;
  notifyMembers: boolean;
  members: number;
  churchId: string;
};
