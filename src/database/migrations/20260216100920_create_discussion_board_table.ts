import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.DISCUSSION_BOARDS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("boardName").notNullable();
      table.string("description").notNullable();
      table.string("welcomeMessage").notNullable();
      table.string("visibility").notNullable().checkIn(["public", "private"]);
      table.string("whoCanPost").notNullable();
      table.boolean("notifyMembers").notNullable().defaultTo(false);
      table.integer("topics").notNullable().defaultTo(0);
      table.integer("members").notNullable().defaultTo(0);
      table.string("lastActive").nullable();
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
  return knex.schema.dropTable(DB_TABLES.DISCUSSION_BOARDS);
}
