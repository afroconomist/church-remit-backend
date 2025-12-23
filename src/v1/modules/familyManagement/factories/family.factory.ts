import { CreateFamily } from "../dtos/create-family.dto";
import { IFamily } from "../model/family.model";

class FamilyFactory {
  static createFamily(data: CreateFamily) {
    const family = {} as IFamily;

    family.primaryMember = data.primaryMember;
    family.familyAddress = data.familyAddress;

    return family;
  }
}

export default FamilyFactory;
