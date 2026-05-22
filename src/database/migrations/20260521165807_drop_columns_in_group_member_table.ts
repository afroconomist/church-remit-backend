import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.GROUP_MEMBERS, (table) => {
    table.dropColumns("present", "absent", "excused");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.GROUP_MEMBERS, (table) => {
    table.boolean("present").defaultTo(false);
    table.boolean("absent").defaultTo(false);
    table.boolean("excused").defaultTo(false);
  });
}
