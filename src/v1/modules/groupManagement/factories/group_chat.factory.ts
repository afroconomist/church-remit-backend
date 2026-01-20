import { MessageGroup } from "../dtos/message-group.dto";
import { IGroupChat } from "../model/group_chat.model";

class GroupChatFactory {
  static messageGroup(data: MessageGroup) {
    const groupMessage = {} as IGroupChat;

    groupMessage.groupMemberName = data.groupMemberName;
    groupMessage.message = data.message;
    groupMessage.group = data.group;

    return groupMessage;
  }
}

export default GroupChatFactory;
