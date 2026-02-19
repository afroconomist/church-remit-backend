import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { BoardMember, IBoardMember } from "../model/board_member.model";

@injectable()
class BoardMemberRepository extends BaseRepository<IBoardMember, BoardMember> {
  constructor() {
    super(BoardMember);
  }
}

export default BoardMemberRepository;
