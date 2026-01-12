import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.EVENTS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("eventTitle").notNullable();
      table.text("description").nullable();
      table
        .enu("category", [
          "Worship Service",
          "Prayer Meeting",
          "Bible Study",
          "Children Program",
          "Outreach",
          "Conference",
          "Social Event",
        ])
        .notNullable();
      table.string("location").notNullable();
      table.date("eventDate").notNullable();
      table.time("startTime").notNullable();
      table.time("endTime").notNullable();
      table.integer("maximumCapacity").nullable().defaultTo(0);
      table.integer("maximumCapacityTracker").nullable();
      table.boolean("registration").notNullable().defaultTo(false);
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
  return knex.schema.dropTable(DB_TABLES.EVENTS);
}
