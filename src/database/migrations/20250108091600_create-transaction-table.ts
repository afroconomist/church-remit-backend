import { Knex } from "knex"; 
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.TRANSACTIONS, (table: Knex.TableBuilder) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("userId").notNullable();
    table.string("accountNumber").notNullable();
    table.integer("amount").notNullable();
    table.string("narration").nullable();
    table.string("recipientAccountNumber").notNullable();
    table.string("recipientBankCode").notNullable();
    table.string("recipientBankName").notNullable();
    table.string("recipientAccountName").notNullable();
    table.string("transactionType").notNullable();
    table.string("transactionChannel").notNullable();
    table.string("reference").notNullable();
    table.string("nameEnquiryReference").notNullable();
    table.string("callBackURL").notNullable();
    table.string("status").notNullable().defaultTo("pending").comment("pending = Pending Transfer, failed = Failed Transfer, successful = Successful Transfer");;
    
    table.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.TRANSACTIONS);
}