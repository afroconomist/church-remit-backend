import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.CAMPUS_PERSONNELS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table
        .string("personnelType")
        .notNullable()
        .checkIn(["Staff Member", "Ministry Leader", "Volunteer"]);
      table.string("personnelName").notNullable();
      table
        .string("department")
        .notNullable()
        .checkIn(["Leadership", "Finance", "Ministries", "Operations"]);
      table.uuid("memberId").notNullable();
      table.uuid("campusId").notNullable();
      table
        .foreign("campusId")
        .references("id")
        .inTable(DB_TABLES.CAMPUSES)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("campusId");

      table.timestamps(true, true, true);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.CAMPUS_PERSONNELS);
}
