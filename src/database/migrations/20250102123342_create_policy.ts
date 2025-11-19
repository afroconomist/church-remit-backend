import { Knex } from "knex"; 
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.POLICIES, (table: Knex.TableBuilder) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("agentId").notNullable();
    table.string("supervisorId").notNullable();
    table.string("policyId").nullable();
    table.string("customerId").notNullable();
    table.string("productId").notNullable();
    table.string("customerType").notNullable();
    table.string("businessType").notNullable().defaultTo('Direct');
    table.string("startDate").notNullable();
    table.string("endDate").notNullable();
    table.string("brokerId").nullable();
    table.string("relationshipManagerId").nullable();
    table.string("sbu").nullable();
    table.string("sbuId").notNullable();
    table.string("branch").nullable();
    table.string("source").notNullable().defaultTo('Direct');
    table.string("sumInsured").notNullable();
    table.string("premium").notNullable();
    table.string("ourSharePercentage").notNullable();
    table.string("classOfBusinessId").notNullable();
    table.string("currency").notNullable();
    table.string("status").notNullable().defaultTo('pending').comment("pending, rejected, approved, processing, activated");
    table.string("cbaStatus").nullable();
    table.string("savingsGoal").nullable();
    table.string("payementFrquency").nullable();
    table.string("annualRiskCover").nullable();
    table.string("annualRiskPremuim").nullable();


    table.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.POLICIES);
}