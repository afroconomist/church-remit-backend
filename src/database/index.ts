import Knex from "knex";
import { Knex as IKnex } from "knex/types";
import { Model } from "objection";
import pg from "pg";
import { config } from "../../knexfile";

// Fix PostgreSQL type parsing to return strings instead of Date objects
// This prevents timezone conversion issues
pg.types.setTypeParser(1082, (value) => value); // 1082 is the OID for date type
pg.types.setTypeParser(1083, (value) => value); // 1083 is the OID for time type
pg.types.setTypeParser(1114, (value) => value); // 1114 is the OID for timestamp without timezone type

let knexPrimary: IKnex;
let knexSecondary: IKnex;

export default function init() {
  knexPrimary = Knex(config.primary);

  knexSecondary = Knex(config.secondary);

  Model.knex(knexPrimary); // bind models to primary connection
}

export function getKnexInstance(type: "primary" | "secondary") {
  return type === "primary" ? knexPrimary : knexSecondary;
}
