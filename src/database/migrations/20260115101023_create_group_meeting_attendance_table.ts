import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.GROUP_MEETING_ATTENDANCES,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.date("meetingDate").notNullable();
      table.integer("guestCount").notNullable().defaultTo(0);
      table.integer("attended").notNullable().defaultTo(0);
      table.string("meetingTopic").notNullable();
      table.text("meetingNotes").notNullable();
      table.text("testimonies").notNullable();
      table.text("prayerRequests").nullable();
      table.uuid("group").nullable();
      table
        .foreign("group")
        .references("id")
        .inTable(DB_TABLES.GROUPS)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("group");

      table.timestamps(true, true, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.GROUP_MEETING_ATTENDANCES);
}
