import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(DB_TABLES.VOLUNTEER_ROLES, (table) => {
    table.dropColumns("startTime", "endTime", "scheduledDate");
    table.uuid("eventId").nullable();
    table.integer("noOfAssignedVolunteers").defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(DB_TABLES.VOLUNTEER_ROLES, (table) => {
    table.time("startTime").nullable();
    table.time("endTime").nullable();
    table.date("scheduledDate").nullable();
    table.dropColumns("eventId", "noOfAssignedVolunteers");
  });
}
