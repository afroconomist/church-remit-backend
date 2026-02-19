import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.EVENTS, (table) => {
    table.boolean("recurring").notNullable().defaultTo(false);
    table.boolean("upcoming").notNullable().defaultTo(false);
    table.boolean("past").notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.EVENTS, (table) => {
    table.dropColumns("recurring", "upcoming", "past");
  });
}
