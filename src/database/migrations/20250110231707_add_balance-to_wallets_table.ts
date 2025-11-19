import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";


export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn(DB_TABLES.WALLETS, 'balance');
  if (!hasColumn) {
    return knex.schema.alterTable(DB_TABLES.WALLETS, (table) => {
      table.integer('balance').notNullable().defaultTo(0);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(DB_TABLES.WALLETS, (table) => {
    table.dropColumn('balance');
  });
}
