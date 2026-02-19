import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import {
  DiscussionBoard,
  IDiscussionBoard,
} from "../model/discussion_board.model";

@injectable()
class DiscussionBoardRepository extends BaseRepository<
  IDiscussionBoard,
  DiscussionBoard
> {
  constructor() {
    super(DiscussionBoard);
  }
}

export default DiscussionBoardRepository;
