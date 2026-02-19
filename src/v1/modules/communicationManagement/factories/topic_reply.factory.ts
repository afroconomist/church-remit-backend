import { ReplyTopic } from "../dtos/reply-topic.dto";
import { ITopicReply } from "../model/topic_reply.model";

class TopicReplyFactory {
  static replyTopic(data: ReplyTopic) {
    const topicReply = {} as ITopicReply;

    topicReply.message = data.message;
    topicReply.repliedBy = data.repliedBy;
    topicReply.boardTopicId = data.boardTopicId;

    return topicReply;
  }
}

export default TopicReplyFactory;
