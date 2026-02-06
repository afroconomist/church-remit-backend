import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.FAMILY_MEMBERS, (table) => {
    table.uuid("churchMemberId").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.FAMILY_MEMBERS, (table) => {
    table.dropColumn("churchMemberId");
  });
}
