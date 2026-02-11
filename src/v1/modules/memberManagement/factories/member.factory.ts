import { AddMember } from "../dtos/add-member.dto";
import { IMember } from "../model/member.model";

class MemberFactory {
  static addMember(data: AddMember) {
    const member = {} as IMember;

    member.firstName = data.firstName;
    member.lastName = data.lastName;
    member.middleName = data.middleName;
    member.email = data.email;
    member.password = data.password;
    member.phoneNumber = data.phoneNumber;
    member.dateOfBirth = data.dateOfBirth;
    member.gender = data.gender;
    member.maritalStatus = data.maritalStatus;
    member.occupation = data.occupation;
    member.streetAddress = data.streetAddress;
    member.city = data.city;
    member.state = data.state;
    member.country = data.country;
    member.contactName = data.contactName;
    member.contactNumber = data.contactNumber;
    member.relationship = data.relationship;
    member.membershipStatus = data.membershipStatus;
    member.joinDate = data.joinDate;
    member.baptismDate = data.baptismDate;
    member.notes = data.notes;
    member.avatar = data.avatar;
    member.roleId = data.roleId;
    member.addedBy = data.addedBy;
    member.churchId = data.churchId;
    member.memberCategoryId = data.memberCategoryId;

    return member;
  }
}

export default MemberFactory;
