import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.COURSE_MODULE_LESSONS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("lessonTitle").notNullable();
      table.string("content").notNullable();
      table.string("duration").notNullable();
      table.integer("order").notNullable();
      table.uuid("moduleId").notNullable();
      table
        .foreign("moduleId")
        .references("id")
        .inTable(DB_TABLES.COURSE_MODULES)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("moduleId");

      table.timestamps(true, true, true);

      table.unique(["moduleId", "order"]);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.COURSE_MODULE_LESSONS);
}
