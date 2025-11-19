import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('users', 'transactionPin');
  if (!hasColumn) {
    return knex.schema.alterTable('users', (table) => {
      table.string('transactionPin').nullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('transactionPin');
  });
}
