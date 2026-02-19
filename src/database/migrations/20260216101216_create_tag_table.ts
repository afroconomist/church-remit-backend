import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.TAGS, (table: Knex.TableBuilder) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("tagName").notNullable().unique();
    table.text("description").notNullable();
    table.string("color").notNullable();
    table.string("defaultAssignment").notNullable();
    table.string("slug").notNullable().unique();
    table.integer("members").notNullable().defaultTo(0);
    table.uuid("churchId").notNullable();
    table
      .foreign("churchId")
      .references("id")
      .inTable(DB_TABLES.CHURCHES)
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.index("churchId");

    table.timestamps(true, true, true);

    table.unique(["slug", "churchId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.TAGS);
}
