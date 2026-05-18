import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.EVENT_AGENDAS, (table) => {
    table.dropColumn("time");
    table.timestamp("startTime").nullable();
    table.timestamp("endTime").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.EVENT_AGENDAS, (table) => {
    table.time("time").nullable();
    table.dropColumns("startTime", "endTime");
  });
}
