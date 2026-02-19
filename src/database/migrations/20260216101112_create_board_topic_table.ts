import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.BOARD_TOPICS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("topicTitle").notNullable();
      table.text("message").notNullable();
      table.string("startedBy").notNullable();
      table.integer("replies").notNullable().defaultTo(0);
      table.string("lastInteracted").nullable();
      table.uuid("discussionBoardId").notNullable();
      table
        .foreign("discussionBoardId")
        .references("id")
        .inTable(DB_TABLES.DISCUSSION_BOARDS)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("discussionBoardId");

      table.timestamps(true, true, true);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.BOARD_TOPICS);
}
