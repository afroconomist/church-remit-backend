import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.STUDENTS, (table) => {
    table.dropUnique(
      ["churchId", "memberId"],
      "students_churchid_memberid_unique",
    );
    table.boolean("isEnrolled").defaultTo(true);
    table.uuid("courseId").nullable();
    table.unique(["courseId", "memberId"], {
      indexName: "students_courseid_memberid_unique",
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DB_TABLES.STUDENTS, (table) => {
    table.unique(["churchId", "memberId"], {
      indexName: "students_churchid_memberid_unique",
    });
    table.dropUnique(
      ["courseId", "memberId"],
      "students_courseid_memberid_unique",
    );
    table.dropColumn("isEnrolled");
    table.dropColumn("courseId");
  });
}
