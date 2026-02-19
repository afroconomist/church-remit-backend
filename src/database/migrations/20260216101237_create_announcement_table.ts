import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.ANNOUNCEMENTS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("title").notNullable();
      table.text("content").notNullable();
      table
        .string("category")
        .notNullable()
        .checkIn(["General", "Event", "Ministry", "Urgent"]);
      table.string("priority").notNullable().checkIn(["Low", "Normal", "High"]);
      table.date("startDate").notNullable();
      table.date("endDate").nullable();
      table.boolean("displayOnWebsite").notNullable().defaultTo(false);
      table.boolean("sendEmailNotification").notNullable().defaultTo(false);
      table.boolean("sendSMSNotification").notNullable().defaultTo(false);
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
  return knex.schema.dropTable(DB_TABLES.ANNOUNCEMENTS);
}
