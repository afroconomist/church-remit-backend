import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("leaves", (table) => {
    table.date("submittedAt").nullable();
    table.date("approvedAt").nullable();
    table.string("approvedBy").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("leaves", (table) => {
    table.dropColumns("submittedAt", "approvedAt", "approvedBy");
  });
}
