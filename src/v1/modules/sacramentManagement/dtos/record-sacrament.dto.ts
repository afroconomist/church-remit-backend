export type RecordSacrament = {
  sacramentType: string;
  memberName: string;
  dateOfSacrament: Date;
  officiatingMinister: string;
  parentsGuardians: Text;
  sponsorsGodparentsWitnesses: Text;
  additionalNotes: Text;
  campusId?: string;
  church: string;
};
