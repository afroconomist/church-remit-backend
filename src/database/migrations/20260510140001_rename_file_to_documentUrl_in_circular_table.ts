import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(DB_TABLES.CIRCULARS, (table) => {
    table.renameColumn("file", "documentUrl");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(DB_TABLES.CIRCULARS, (table) => {
    table.renameColumn("documentUrl", "file");
  });
}
