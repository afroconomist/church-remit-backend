import { CreateTopic } from "../dtos/create-topic.dto";
import { IBoardTopic } from "../model/board_topic.model";

class BoardTopicFactory {
  static createTopic(data: CreateTopic) {
    const boardTopic = {} as IBoardTopic;

    boardTopic.topicTitle = data.topicTitle;
    boardTopic.message = data.message;
    boardTopic.startedBy = data.startedBy;
    boardTopic.discussionBoardId = data.discussionBoardId;

    return boardTopic;
  }
}

export default BoardTopicFactory;
