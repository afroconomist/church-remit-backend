import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

const DEFAULT_CATEGORY = "Youth Event";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.EVENTS, (table) => {
    table.string("category").nullable();
  });

  await knex(DB_TABLES.EVENTS).update({
    category: DEFAULT_CATEGORY,
  });

  await knex.schema.alterTable(DB_TABLES.EVENTS, (table) => {
    table
      .string("category")
      .notNullable()
      .checkIn([
        "Worship Service",
        "Prayer Meeting",
        "Bible Study",
        "Youth Event",
        "Children Program",
        "Outreach",
        "Conference",
        "Social Event",
      ])
      .alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.EVENTS, (table) => {
    table.dropColumn("category");
  });
}
