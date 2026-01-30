import { AssignPersonnel } from "../dtos/assign-personnel.dto";
import { ICampusPersonnel } from "../model/campus_personnel.model";

class CampusPersonnelFactory {
  static assignPersonnel(data: AssignPersonnel) {
    const campusPersonnel = {} as ICampusPersonnel;

    campusPersonnel.personnelType = data.personnelType;
    campusPersonnel.personnelName = data.personnelName;
    campusPersonnel.department = data.department;
    campusPersonnel.memberId = data.memberId;
    campusPersonnel.campusId = data.campusId;

    return campusPersonnel;
  }
}

export default CampusPersonnelFactory;
