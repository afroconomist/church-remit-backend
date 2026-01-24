import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.STUDENT_LESSON_PROGRESSES,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.uuid("studentId").notNullable();
      table.uuid("lessonId").notNullable();
      table
        .enu("status", ["Started", "Completed"])
        .notNullable()
        .defaultTo("Started");
      table.timestamp("startedAt", { useTz: true }).nullable();
      table.timestamp("completedAt", { useTz: true }).nullable();

      table.timestamps(true, true, true);

      table.unique(["studentId", "lessonId"]);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.STUDENT_LESSON_PROGRESSES);
}
