import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable("event-attendees", "event_attendees");
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable("event_attendees", "event-attendees");
}
