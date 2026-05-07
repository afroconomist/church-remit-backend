import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.CATEGORIES, (table) => {
    table.dropUnique(["slug"], "categories_slug_unique");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.CATEGORIES, (table) => {
    table.unique(["slug"], {
      indexName: "categories_slug_unique",
    });
  });
}
