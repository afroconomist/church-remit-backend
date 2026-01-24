import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.COURSE_MODULES,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("moduleTitle").notNullable();
      table.string("duration").notNullable();
      table.integer("order").notNullable();
      table.integer("lessons").notNullable().defaultTo(0);
      table.uuid("courseId").notNullable();
      table
        .foreign("courseId")
        .references("id")
        .inTable(DB_TABLES.COURSES)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("courseId");

      table.timestamps(true, true, true);

      table.unique(["courseId", "order"]);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.COURSE_MODULES);
}
