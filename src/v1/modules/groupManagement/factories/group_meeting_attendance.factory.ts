import { RecordAttendance } from "../dtos/record-attendance.dto";
import { IGroupMeetingAttendance } from "../model/group_meeting_attendance.model";

class GroupMeetingAttendanceFactory {
  static recordAttendance(data: RecordAttendance) {
    const groupMeetingAttendance = {} as IGroupMeetingAttendance;

    groupMeetingAttendance.meetingDate = data.meetingDate;
    groupMeetingAttendance.guestCount = data.guestCount;
    groupMeetingAttendance.attended = data.attended;
    groupMeetingAttendance.absent = data.absent;
    groupMeetingAttendance.excused = data.excused;
    groupMeetingAttendance.guestNames = data.guestNames;
    groupMeetingAttendance.presentMembers = data.presentMembers;
    groupMeetingAttendance.absentMembers = data.absentMembers;
    groupMeetingAttendance.excusedMembers = data.excusedMembers;
    groupMeetingAttendance.meetingTopic = data.meetingTopic;
    groupMeetingAttendance.meetingNotes = data.meetingNotes;
    groupMeetingAttendance.testimonies = data.testimonies;
    groupMeetingAttendance.prayerRequests = data.prayerRequests;
    groupMeetingAttendance.group = data.group;

    return groupMeetingAttendance;
  }
}

export default GroupMeetingAttendanceFactory;
