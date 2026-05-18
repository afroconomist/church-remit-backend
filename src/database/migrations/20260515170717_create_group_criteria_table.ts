import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.GROUP_CRITERIAS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table
        .string("criteriaType")
        .notNullable()
        .checkIn(["age", "gender", "marital-status"]);
      table.integer("minAge").notNullable();
      table.integer("maxAge").notNullable();
      table.uuid("groupId").notNullable();
      table
        .foreign("groupId")
        .references("id")
        .inTable(DB_TABLES.GROUPS)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("groupId");

      table.timestamps(true, true, true);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.GROUP_CRITERIAS);
}
