import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.VOLUNTEER_ROLES,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("name").notNullable();
      table.string("section").notNullable();
      table.date("scheduledDate").notNullable();
      table.integer("noOfVolunteersNeeded").notNullable;
      table.time("startTime").notNullable();
      table.time("endTime").notNullable();
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
  return knex.schema.dropTable(DB_TABLES.VOLUNTEER_ROLES);
}
