import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.STUDENTS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("studentName").notNullable();
      table.string("role").notNullable();
      table.string("department").notNullable();
      table.uuid("memberId").notNullable();
      table.uuid("churchId").notNullable();
      table
        .foreign("churchId")
        .references("id")
        .inTable(DB_TABLES.CHURCHES)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("churchId");

      table.timestamps(true, true, true);

      table.unique(["churchId", "memberId"]);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.STUDENTS);
}
