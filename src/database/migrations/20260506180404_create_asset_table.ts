import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.ASSETS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("assetName").notNullable();
      table
        .string("category")
        .notNullable()
        .checkIn([
          "audio-equipment",
          "visual-equipment",
          "vehicles",
          "furniture",
          "power-equipment",
          "musical-instruments",
        ]);
      table.integer("purchaseValue").notNullable();
      table.date("purchaseDate").notNullable();
      table.string("location").notNullable();
      table
        .string("condition")
        .notNullable()
        .checkIn(["excellent", "good", "fair", "needs-repair", "retired"]);
      table.uuid("groupId").nullable();
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
  return knex.schema.dropTable(DB_TABLES.ASSETS);
}
