import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.VOLUNTEER_ROLE_ASSIGNMENTS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.uuid("volunteerId").notNullable();
      table.uuid("volunteerRoleId").notNullable();
      table.timestamp("assignedAt").notNullable().defaultTo(knex.fn.now());
      table
        .enum("status", ["ACTIVE", "INACTIVE", "COMPLETED"])
        .notNullable()
        .defaultTo("ACTIVE");
      table
        .foreign("volunteerId")
        .references("id")
        .inTable(DB_TABLES.VOLUNTEERS)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("volunteerId");
      table
        .foreign("volunteerRoleId")
        .references("id")
        .inTable(DB_TABLES.VOLUNTEER_ROLES)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("volunteerRoleId");

      table.timestamps(true, true, true);

      table.unique(["volunteerId", "volunteerRoleId"]);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.VOLUNTEER_ROLE_ASSIGNMENTS);
}
