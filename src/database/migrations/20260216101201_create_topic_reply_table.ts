import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.TOPIC_REPLIES,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("message").notNullable();
      table.string("repliedBy").notNullable();
      table.uuid("boardTopicId").notNullable();
      table
        .foreign("boardTopicId")
        .references("id")
        .inTable(DB_TABLES.BOARD_TOPICS)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("boardTopicId");

      table.timestamps(true, true, true);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.TOPIC_REPLIES);
}
