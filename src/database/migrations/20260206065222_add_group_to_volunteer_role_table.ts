import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.VOLUNTEER_ROLES, (table) => {
    table.uuid("groupId").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.VOLUNTEER_ROLES, (table) => {
    table.dropColumn("groupId");
  });
}
