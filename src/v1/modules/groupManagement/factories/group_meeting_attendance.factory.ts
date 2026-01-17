import { RecordAttendance } from "../dtos/record-attendance.dto";
import { IGroupMeetingAttendance } from "../model/group_meeting_attendance.model";

class GroupMeetingAttendanceFactory {
  static recordAttendance(data: RecordAttendance) {
    const groupMeetingAttendance = {} as IGroupMeetingAttendance;

    groupMeetingAttendance.meetingDate = data.meetingDate;
    groupMeetingAttendance.guestCount = data.guestCount;
    groupMeetingAttendance.attended = data.attended;
    groupMeetingAttendance.meetingTopic = data.meetingTopic;
    groupMeetingAttendance.meetingNotes = data.meetingNotes;
    groupMeetingAttendance.testimonies = data.testimonies;
    groupMeetingAttendance.prayerRequests = data.prayerRequests;
    groupMeetingAttendance.group = data.group;

    return groupMeetingAttendance;
  }
}

export default GroupMeetingAttendanceFactory;
