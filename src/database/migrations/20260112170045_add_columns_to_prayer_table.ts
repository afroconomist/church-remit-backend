import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("prayers", (table) => {
    table.uuid("prayerWarrior").nullable();
    table.boolean("answered").notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("prayers", (table) => {
    table.dropColumns("prayerWarrior", "answered");
  });
}
