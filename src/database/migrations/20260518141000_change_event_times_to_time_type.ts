import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.EVENTS, (table) => {
    table.time("eventStartTime").alter();
    table.time("eventEndTime").alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  // Cast time to timestamp with explicit conversion
  await knex.raw(
    `ALTER TABLE ${DB_TABLES.EVENTS} ALTER COLUMN "eventStartTime" TYPE timestamp using "eventStartTime"::time::text::timestamp`,
  );
  await knex.raw(
    `ALTER TABLE ${DB_TABLES.EVENTS} ALTER COLUMN "eventEndTime" TYPE timestamp using "eventEndTime"::time::text::timestamp`,
  );
}
