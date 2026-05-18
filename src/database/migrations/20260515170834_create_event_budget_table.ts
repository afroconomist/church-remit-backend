import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.EVENT_BUDGETS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table
        .string("category")
        .notNullable()
        .checkIn([
          "venue",
          "equipment",
          "catering",
          "marketing",
          "staff",
          "transportation",
          "decorations",
          "others",
        ]);
      table.string("itemDescription").notNullable();
      table.integer("budgetedAmount").notNullable();
      table.integer("actualAmount").defaultTo(0);
      table.integer("variance").defaultTo(0);
      table
        .string("status")
        .notNullable()
        .checkIn(["pending", "paid", "partially-paid"])
        .defaultTo("pending");
      table.uuid("eventId").notNullable();
      table
        .foreign("eventId")
        .references("id")
        .inTable(DB_TABLES.EVENTS)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("eventId");

      table.timestamps(true, true, true);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.EVENT_BUDGETS);
}
