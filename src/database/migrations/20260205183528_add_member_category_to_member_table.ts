import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.MEMBERS, (table) => {
    table.uuid("memberCategoryId").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.MEMBERS, (table) => {
    table.dropColumn("memberCategoryId");
  });
}
