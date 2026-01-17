import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.GROUP_CHAT,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("groupMemberName").notNullable();
      table.text("message").notNullable();
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
  return knex.schema.dropTable(DB_TABLES.GROUP_CHAT);
}
