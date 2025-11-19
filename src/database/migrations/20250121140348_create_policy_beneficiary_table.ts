import { Knex } from "knex"; 
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.POLICY_BENEFICIARY, (table: Knex.TableBuilder) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("userId").notNullable();
    table.string("policyId").notNullable();
    table.string("firstName").notNullable();
    table.string("lastName").notNullable();
    table.string("gender").notNullable();
    table.date("dateOfBirth").notNullable();
    table.string("relationshipToCustomer").notNullable();
    table.decimal("percentageRate", 5, 2).notNullable();
    table.string("phoneNumber").notNullable();
    table.string("alternatePhoneNumber").nullable();
    table.string("emailAddress").notNullable();
    table.string("meansOfId").nullable();
    table.string("idNumber").nullable();
    table.date("idExpiryDate").notNullable();
    table.string("idURL").nullable();
    table.string("status").notNullable().defaultTo("active");
    table.boolean("isDeleted").notNullable().defaultTo(false);

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.POLICY_BENEFICIARY);
}