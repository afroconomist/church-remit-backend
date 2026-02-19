import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.BOARD_MEMBERS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("memberName").notNullable();
      table.uuid("churchMemberId").notNullable();
      table.uuid("discussionBoardId").notNullable();
      table
        .foreign("discussionBoardId")
        .references("id")
        .inTable(DB_TABLES.DISCUSSION_BOARDS)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("discussionBoardId");

      table.timestamps(true, true, true);

      table.unique(["discussionBoardId", "churchMemberId"]);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.BOARD_MEMBERS);
}
