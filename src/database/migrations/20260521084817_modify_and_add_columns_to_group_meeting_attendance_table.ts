import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.GROUP_MEETING_ATTENDANCES, (table) => {
    table.text("testimonies").nullable().alter();
    table.jsonb("presentMembers").defaultTo(knex.raw("'[]'::jsonb"));
    table.jsonb("absentMembers").defaultTo(knex.raw("'[]'::jsonb"));
    table.jsonb("excusedMembers").defaultTo(knex.raw("'[]'::jsonb"));
    table.jsonb("guestNames").defaultTo(knex.raw("'[]'::jsonb"));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.GROUP_MEETING_ATTENDANCES, (table) => {
    table.dropColumns(
      "presentMembers",
      "absentMembers",
      "excusedMembers",
      "guestNames",
    );
  });
}
