import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(DB_TABLES.DOCUMENTS, (table) => {
    table.renameColumn("documentFile", "documentUrl");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(DB_TABLES.DOCUMENTS, (table) => {
    table.renameColumn("documentUrl", "documentFile");
  });
}
