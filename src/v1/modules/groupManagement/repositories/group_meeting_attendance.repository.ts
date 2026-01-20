import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import {
  GroupMeetingAttendance,
  IGroupMeetingAttendance,
} from "../model/group_meeting_attendance.model";

@injectable()
class GroupMeetingAttendanceRepository extends BaseRepository<
  IGroupMeetingAttendance,
  GroupMeetingAttendance
> {
  constructor() {
    super(GroupMeetingAttendance);
  }
}

export default GroupMeetingAttendanceRepository;
