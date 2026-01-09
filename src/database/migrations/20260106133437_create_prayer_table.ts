import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.PRAYERS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("requestTitle").notNullable();
      table.text("description").notNullable();
      table
        .enu("category", [
          "Health",
          "Finance",
          "Spiritual",
          "Family",
          "Career",
          "Other",
        ])
        .notNullable();
      table.enu("urgency", ["Normal", "Urgent"]).notNullable();
      table
        .enu("privacySetting", ["Public", "Private", "Anonymous"])
        .notNullable();
      table.string("assignedTo").nullable();
      table.integer("pray").nullable().defaultTo(0);
      table.string("submittedBy").nullable();
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
  return knex.schema.dropTable(DB_TABLES.PRAYERS);
}
