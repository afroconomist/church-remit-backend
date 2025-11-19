import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(DB_TABLES.USERS, (table: Knex.TableBuilder) => {
    table.dropColumn("name");
    table.string("firstName").notNullable();
    table.string("lastName").notNullable();
    table.string("middleName").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(DB_TABLES.USERS, (table: Knex.TableBuilder) => {
    table.string("name").nullable();
    table.dropColumn("firstName");
    table.dropColumn("lastName");
    table.dropColumn("middleName");
  });
}
