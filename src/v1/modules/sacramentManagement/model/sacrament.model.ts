import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Sacrament extends Model {
  static tableName = DB_TABLES.SACRAMENTS;
  id: string;
  sacramentType: string;
  memberName: string;
  dateOfSacrament: Date;
  officiatingMinister: string;
  parentsGuardians: Text;
  sponsorsGodparentsWitnesses: Text;
  additionalNotes: Text;
  church: string;
}

export type ISacrament = ModelObject<Sacrament>;
