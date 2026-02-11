import { AddFamilyMember } from "../dtos/add-family-member.dto";
import { IFamilyMember } from "../model/family_member.model";

class FamilyMemberFactory {
  static addFamilyMember(data: AddFamilyMember) {
    const familyMember = {} as IFamilyMember;

    familyMember.memberName = data.memberName;
    familyMember.memberEmail = data.memberEmail;
    familyMember.memberPhoneNumber = data.memberPhoneNumber;
    familyMember.memberDOB = data.memberDOB;
    familyMember.memberAddress = data.memberAddress;
    familyMember.memberRelationship = data.memberRelationship;
    familyMember.primary = data.primary;
    familyMember.family = data.family;
    familyMember.churchMemberId = data.churchMemberId;

    return familyMember;
  }
}

export default FamilyMemberFactory;
