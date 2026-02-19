import { JoinDiscussionBoard } from "../dtos/join-board.dto";
import { IBoardMember } from "../model/board_member.model";

class BoardMemberFactory {
  static joinDiscussionBoard(data: JoinDiscussionBoard) {
    const boardMember = {} as IBoardMember;

    boardMember.memberName = data.memberName;
    boardMember.churchMemberId = data.churchMemberId;
    boardMember.discussionBoardId = data.discussionBoardId;

    return boardMember;
  }
}

export default BoardMemberFactory;
