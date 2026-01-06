import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.VOLUNTEERS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("name").notNullable();
      table.string("email").notNullable().unique();
      table.string("phoneNumber").notNullable();
      table.jsonb("skills").notNullable().defaultTo(knex.raw("'[]'::jsonb"));
      table
        .jsonb("availability")
        .notNullable()
        .defaultTo(knex.raw("'[]'::jsonb"));
      table.integer("totalHours").nullable();
      table.date("memberSince").notNullable();
      table.date("lastServed").nullable();
      table.boolean("backgroundCheck").notNullable().defaultTo(false);
      table.integer("awards").nullable();
      table.string("volunteerRoleName").nullable();
      table.string("section").nullable();
      table
        .enu("status", ["Pending", "Active", "Inactive"])
        .notNullable()
        .defaultTo("Pending");
      table
        .jsonb("upcomingAssignments")
        .nullable()
        .defaultTo(knex.raw("'[]'::jsonb"));
      table
        .jsonb("serviceHistory")
        .nullable()
        .defaultTo(knex.raw("'[]'::jsonb"));
      table.uuid("volunteerRole").nullable();
      table.uuid("church").notNullable();
      table
        .foreign("church")
        .references("id")
        .inTable(DB_TABLES.CHURCHES)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("church");

      table.timestamps(true, true, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.VOLUNTEERS);
}
