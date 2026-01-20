import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.GROUPS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("groupName").notNullable();
      table
        .enu("category", [
          "Bible Study",
          "Fellowship",
          "Prayer Group",
          "Youth Group",
          "Men Ministry",
          "Women Ministry",
          "Couples",
          "Seniors",
        ])
        .notNullable();
      table.text("description").nullable();
      table.string("groupLeader").notNullable();
      table.integer("capacity").notNullable().defaultTo(0);
      table.integer("capacityTracker").notNullable().defaultTo(0);
      table
        .enu("meetingDay", [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ])
        .nullable();
      table.time("meetingTime").nullable();
      table.enu("frequency", ["Weekly", "Bi-weekly", "Monthly"]).nullable();
      table.string("location").nullable();
      table
        .enu("criteriaType", [
          "Age Range",
          "Gender",
          "Marital Status",
          "Location",
          "Membership Date",
        ])
        .nullable();
      table.integer("minAge").nullable();
      table.integer("maxAge").nullable();
      table.boolean("publicGroup").notNullable().defaultTo(false);
      table.boolean("allowGuestInvites").notNullable().defaultTo(false);
      table.boolean("requireLeaderApproval").notNullable().defaultTo(false);
      table.boolean("enableGroupChat").notNullable().defaultTo(false);
      table.string("groupCreator").notNullable();
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
  return knex.schema.dropTable(DB_TABLES.GROUPS);
}
