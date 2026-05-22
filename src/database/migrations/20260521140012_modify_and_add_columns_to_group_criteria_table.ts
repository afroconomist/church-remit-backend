import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.GROUP_CRITERIAS, (table) => {
    table.integer("minAge").nullable().alter();
    table.integer("maxAge").nullable().alter();
    table.string("status").nullable();
    table.string("sex").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.GROUP_CRITERIAS, (table) => {
    table.dropColumns("status", "sex");
  });
}
