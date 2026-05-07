import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.EVENTS, (table) => {
    table
      .string("eventFrequency")
      .nullable()
      .checkIn(["weekly", "monthly", "quarterly", "yearly"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.EVENTS, (table) => {
    table.dropColumn("eventFrequency");
  });
}
