import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.EVENT_AGENDAS, (table) => {
    table.time("startTime").alter();
    table.time("endTime").alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  // Cast time to timestamp with explicit conversion
  await knex.raw(
    `ALTER TABLE ${DB_TABLES.EVENT_AGENDAS} ALTER COLUMN "startTime" TYPE timestamp using "startTime"::time::text::timestamp`,
  );
  await knex.raw(
    `ALTER TABLE ${DB_TABLES.EVENT_AGENDAS} ALTER COLUMN "endTime" TYPE timestamp using "endTime"::time::text::timestamp`,
  );
}
