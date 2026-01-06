import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn("leaves", "church");
  if (!hasColumn) {
    return knex.schema.alterTable("leaves", (table) => {
      table.uuid("church").nullable();
      table
        .foreign("church")
        .references("id")
        .inTable(DB_TABLES.CHURCHES)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("church");
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("leaves", (table) => {
    table.dropColumn("church");
  });
}
