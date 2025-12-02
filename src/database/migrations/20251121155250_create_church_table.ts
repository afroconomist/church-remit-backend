import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.CHURCHES,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("churchName").notNullable();
      table.string("churchType").notNullable();
      table.string("email").notNullable().unique();
      table.string("phoneNumber").notNullable();
      table.string("website").nullable();
      table.string("streetAddress").notNullable();
      table.string("city").notNullable();
      table.string("stateRegion").notNullable();
      table.string("country").notNullable();
      table.string("timeZone").notNullable();
      table.string("baseCurrency").notNullable();
      table.date("fiscalYearStart").notNullable();
      table
        .jsonb("initialFundsToCreate")
        .notNullable()
        .defaultTo(knex.raw("'[]'::jsonb"));

      table.timestamps(true, true, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.CHURCHES);
}
