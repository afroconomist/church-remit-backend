import { AddMemberBirthday } from "../dtos/add-member-birthday.dto";
import { IMemberBirthday } from "../model/member_birthday.model";

class MemberBirthdayFactory {
  static addMemberBirthday(data: AddMemberBirthday) {
    const memberBirthday = {} as IMemberBirthday;

    memberBirthday.celebrantName = data.celebrantName;
    memberBirthday.dateOfBirth = data.dateOfBirth;
    memberBirthday.celebrantEmail = data.celebrantEmail;
    memberBirthday.celebrantPhone = data.celebrantPhone;
    memberBirthday.campus = data.campus;
    memberBirthday.memberId = data.memberId;
    memberBirthday.churchId = data.churchId;

    return memberBirthday;
  }
}

export default MemberBirthdayFactory;
