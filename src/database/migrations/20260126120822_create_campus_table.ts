import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.CAMPUSES,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("campusName").notNullable();
      table.string("campusCode").notNullable();
      table.string("campusAddress").notNullable();
      table.string("campusEmail").notNullable().unique();
      table.string("campusPhoneNumber").notNullable();
      table.string("campusPastor").notNullable();
      table.string("financeManager").nullable();
      table.string("legalName").nullable();
      table.string("taxId").nullable();
      table.string("registrationNumber").nullable();
      table.string("localCurrency").notNullable().checkIn(["NGN"]);
      table.string("timezone").notNullable();
      table.string("established").notNullable();
      table
        .string("status")
        .notNullable()
        .checkIn(["Active", "Inactive", "Deactivated"]);
      table.uuid("churchId").notNullable();
      table
        .foreign("churchId")
        .references("id")
        .inTable(DB_TABLES.CHURCHES)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("churchId");

      table.timestamps(true, true, true);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.CAMPUSES);
}
