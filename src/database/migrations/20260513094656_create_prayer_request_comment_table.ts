import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.PRAYER_REQUEST_COMMENTS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("commentedBy").notNullable();
      table.text("message").notNullable();
      table.uuid("prayerRequestId").notNullable();
      table
        .foreign("prayerRequestId")
        .references("id")
        .inTable(DB_TABLES.PRAYERS)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("prayerRequestId");

      table.timestamps(true, true, true);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.PRAYER_REQUEST_COMMENTS);
}
