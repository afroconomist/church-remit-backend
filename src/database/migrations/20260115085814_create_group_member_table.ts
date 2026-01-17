import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.GROUP_MEMBERS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("groupMemberName").notNullable();
      table
        .enu("groupMemberRole", ["Member", "Leader", "Co-Leader"])
        .notNullable()
        .defaultTo("Member");
      table.timestamp("joined", { useTz: true }).nullable();
      table
        .enu("status", ["Approved", "Rejected", "Pending"])
        .notNullable()
        .defaultTo("Approved");
      table.boolean("present").notNullable().defaultTo(false);
      table.boolean("absent").notNullable().defaultTo(false);
      table.boolean("excused").notNullable().defaultTo(false);
      table.uuid("group").notNullable();
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
  return knex.schema.dropTable(DB_TABLES.GROUP_MEMBERS);
}
