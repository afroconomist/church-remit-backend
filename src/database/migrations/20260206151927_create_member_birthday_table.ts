import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.MEMBER_BIRTHDAYS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("celebrantName").notNullable();
      table.date("dateOfBirth").notNullable();
      table.string("celebrantEmail").notNullable();
      table.string("celebrantPhone").notNullable();
      table.string("campus").notNullable();
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

      table.unique(["memberId", "churchId"]);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.MEMBER_BIRTHDAYS);
}
