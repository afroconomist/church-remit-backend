import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.CIRCULARS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("title").notNullable();
      table.string("description").notNullable();
      table.string("province").notNullable();
      table
        .string("category")
        .notNullable()
        .checkIn([
          "General",
          "Announcement",
          "Finance",
          "Leadership",
          "Policy",
        ]);
      table.text("file").notNullable();
      table.date("uploadedAt").notNullable();
      table.integer("downloads").notNullable().defaultTo(0);
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
  return knex.schema.dropTable(DB_TABLES.CIRCULARS);
}
