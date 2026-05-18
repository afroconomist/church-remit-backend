import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.EVENTS, (table) => {
    table.dropColumns("startTime", "endTime");
    table.date("nextEventDate").nullable();
    table.timestamp("eventStartTime").nullable();
    table.timestamp("eventEndTime").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.EVENTS, (table) => {
    table.dropColumns("nextEventDate", "eventStartTime", "eventEndTime");
    table.time("startTime").nullable();
    table.time("endTime").nullable();
  });
}
