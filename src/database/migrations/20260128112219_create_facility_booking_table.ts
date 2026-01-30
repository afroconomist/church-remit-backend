import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.FACILITY_BOOKINGS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("eventName").notNullable();
      table.timestamp("startTime", { useTz: true }).notNullable();
      table.timestamp("endTime", { useTz: true }).notNullable();
      table.text("purpose").nullable();
      table.uuid("facilityId").notNullable();
      table
        .foreign("facilityId")
        .references("id")
        .inTable(DB_TABLES.FACILITIES)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("facilityId");

      table.timestamps(true, true, true);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.FACILITY_BOOKINGS);
}
