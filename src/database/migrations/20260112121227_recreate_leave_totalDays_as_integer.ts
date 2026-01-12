import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("leaves", (table) => {
    table.dropColumn("totalDays");
  });

  await knex.schema.alterTable("leaves", (table) => {
    table.integer("totalDays").defaultTo(0);
  });

  await knex.schema.alterTable("leaves", (table) => {
    table.integer("totalDays").notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("leaves", (table) => {
    table.dropColumn("totalDays");
  });

  await knex.schema.alterTable("leaves", (table) => {
    table.string("totalDays").defaultTo("0");
  });

  await knex.schema.alterTable("leaves", (table) => {
    table.string("totalDays").notNullable().alter();
  });
}
