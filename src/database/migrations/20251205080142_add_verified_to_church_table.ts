import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn("churches", "verified");
  if (!hasColumn) {
    return knex.schema.alterTable("churches", (table) => {
      table.boolean("verified").notNullable().defaultTo(false);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("churches", (table) => {
    table.dropColumn("verified");
  });
}
