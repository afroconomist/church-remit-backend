import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { TopicReply, ITopicReply } from "../model/topic_reply.model";

@injectable()
class TopicReplyRepository extends BaseRepository<ITopicReply, TopicReply> {
  constructor() {
    super(TopicReply);
  }
}

export default TopicReplyRepository;
