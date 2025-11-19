import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.IDVERIFICATION, (table: Knex.TableBuilder) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.uuid("userId").notNullable();
    table.string("idType").notNullable();
    table.string("idNumber").notNullable();
    table.string("issuingDate").nullable();
    table.string("expiringDate").nullable();

    table.timestamps(true, true, true);

    // Add foreign key constraint
    table
      .foreign("userId")
      .references("id")
      .inTable(DB_TABLES.USERS)
      .onDelete("CASCADE") 
      .onUpdate("CASCADE");

    table.index("userId");
  });
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable(DB_TABLES.IDVERIFICATION);
}
