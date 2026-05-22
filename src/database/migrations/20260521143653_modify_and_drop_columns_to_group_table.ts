import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.GROUPS, (table) => {
    table.dropColumns("minAge", "maxAge", "criteriaType");
    table.string("groupLeader").nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.GROUPS, (table) => {
    table.integer("minAge").defaultTo(0);
    table.integer("maxAge").defaultTo(0);
    table
      .enu("criteriaType", [
        "Age Range",
        "Gender",
        "Marital Status",
        "Location",
        "Membership Date",
      ])
      .nullable();
  });
}
