import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { GroupChat, IGroupChat } from "../model/group_chat.model";

@injectable()
class GroupChatRepository extends BaseRepository<IGroupChat, GroupChat> {
  constructor() {
    super(GroupChat);
  }
}

export default GroupChatRepository;
