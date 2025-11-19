import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(DB_TABLES.USERS, (table: Knex.TableBuilder) => {
    table.text("addedBy").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(DB_TABLES.USERS, (table: Knex.TableBuilder) => {
    table.dropColumn("addedBy");
  });
}
