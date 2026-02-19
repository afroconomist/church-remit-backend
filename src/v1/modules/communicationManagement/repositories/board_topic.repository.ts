import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { BoardTopic, IBoardTopic } from "../model/board_topic.model";

@injectable()
class BoardTopicRepository extends BaseRepository<IBoardTopic, BoardTopic> {
  constructor() {
    super(BoardTopic);
  }
}

export default BoardTopicRepository;
