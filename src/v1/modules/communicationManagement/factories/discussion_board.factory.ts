import { CreateDiscussionBoard } from "../dtos/create-board.dto";
import { IDiscussionBoard } from "../model/discussion_board.model";

class DiscussionBoardFactory {
  static createDiscussionBoard(data: CreateDiscussionBoard) {
    const discussionBoard = {} as IDiscussionBoard;

    discussionBoard.boardName = data.boardName;
    discussionBoard.description = data.description;
    discussionBoard.welcomeMessage = data.welcomeMessage;
    discussionBoard.visibility = data.visibility;
    discussionBoard.whoCanPost = data.whoCanPost;
    discussionBoard.notifyMembers = data.notifyMembers;
    discussionBoard.members = data.members;
    discussionBoard.churchId = data.churchId;

    return discussionBoard;
  }
}

export default DiscussionBoardFactory;
