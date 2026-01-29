import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.FACILITIES,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("facilityName").notNullable();
      table
        .string("facilityType")
        .notNullable()
        .checkIn([
          "Worship Space",
          "Multi-purpose",
          "Meeting Room",
          "Classroom",
          "Office",
        ]);
      table.integer("capacity").notNullable();
      table.string("location").notNullable();
      table.text("features").nullable();
      table
        .string("status")
        .notNullable()
        .checkIn(["Available", "Booked", "Maintenance"]);
      table.string("eventBookedFor").nullable();
      table.time("eventTime").nullable();
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
  return knex.schema.dropTable(DB_TABLES.FACILITIES);
}
