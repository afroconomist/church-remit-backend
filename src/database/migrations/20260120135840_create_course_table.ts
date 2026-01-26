import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.COURSES,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("courseTitle").notNullable();
      table.text("description").notNullable();
      table
        .string("category")
        .notNullable()
        .checkIn(["Ministry", "Leadership", "Technical", "Compliance"]);
      table.string("totalDuration").notNullable();
      table.integer("passingScore").notNullable();
      table
        .string("enrollmentType")
        .notNullable()
        .checkIn(["Open Enrollment", "Requires Approval", "Invitation Only"]);
      table.boolean("mandatoryCourse").notNullable().defaultTo(false);
      table.integer("modules").notNullable().defaultTo(0);
      table.integer("enrolled").notNullable().defaultTo(0);
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
  return knex.schema.dropTable(DB_TABLES.COURSES);
}
