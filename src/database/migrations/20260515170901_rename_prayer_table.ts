import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable("prayers", "prayer_requests");
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable("prayer_requests", "prayers");
}
