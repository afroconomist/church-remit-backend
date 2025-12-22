import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.LEAVES,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("staffName").notNullable();
      table
        .enu("leaveType", [
          "Annual Leave",
          "Sick Leave",
          "Study Leave",
          "Compassionate Leave",
        ])
        .notNullable();
      table.string("totalDays").notNullable();
      table.date("startDate").notNullable();
      table.date("endDate").notNullable();
      table.string("reason").notNullable();
      table
        .enu("status", ["Pending", "Approved", "Rejected"])
        .notNullable()
        .defaultTo("Pending");
      table.uuid("memberId").notNullable();
      table
        .foreign("memberId")
        .references("id")
        .inTable(DB_TABLES.MEMBERS)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("memberId");

      table.timestamps(true, true, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.LEAVES);
}
