import { RecordSacrament } from "../dtos/record-sacrament.dto";
import { ISacrament } from "../model/sacrament.model";

class SacramentFactory {
  static recordSacrament(data: RecordSacrament) {
    const sacrament = {} as ISacrament;

    sacrament.sacramentType = data.sacramentType;
    sacrament.memberName = data.memberName;
    sacrament.dateOfSacrament = data.dateOfSacrament;
    sacrament.officiatingMinister = data.officiatingMinister;
    sacrament.parentsGuardians = data.parentsGuardians;
    sacrament.sponsorsGodparentsWitnesses = data.sponsorsGodparentsWitnesses;
    sacrament.additionalNotes = data.additionalNotes;
    sacrament.campusId = data.campusId;
    sacrament.church = data.church;

    return sacrament;
  }
}

export default SacramentFactory;
