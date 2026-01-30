import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.DOCUMENTS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("documentName").notNullable();
      table
        .string("category")
        .notNullable()
        .checkIn(["Governance", "Finance", "HR", "Legal", "Policy"]);
      table
        .string("confidentiality")
        .notNullable()
        .checkIn(["Public", "Internal", "Confidential"]);
      table.string("documentFile").notNullable();
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
  return knex.schema.dropTable(DB_TABLES.DOCUMENTS);
}
