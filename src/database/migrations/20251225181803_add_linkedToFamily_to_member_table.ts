import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn("members", "linkedToFamily");
  if (!hasColumn) {
    return knex.schema.alterTable("members", (table) => {
      table.boolean("linkedToFamily").notNullable().defaultTo(false);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("members", (table) => {
    table.dropColumn("linkedToFamily");
  });
}
