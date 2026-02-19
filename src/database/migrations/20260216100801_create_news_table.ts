import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.NEWS, (table: Knex.TableBuilder) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("headline").notNullable();
    table.text("shortSummary").notNullable();
    table.text("fullArticle").notNullable();
    table.text("media").nullable();
    table.string("province").notNullable();
    table.integer("views").notNullable().defaultTo(0);
    table.date("publishDate").notNullable();
    table.time("publishTime").notNullable();
    table.date("postedAt").notNullable();
    table.boolean("featureThisNews").notNullable().defaultTo(false);
    table.boolean("showOnHomepage").notNullable().defaultTo(false);
    table.uuid("churchId").notNullable();
    table
      .foreign("churchId")
      .references("id")
      .inTable(DB_TABLES.CHURCHES)
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.index("churchId");

    table.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.NEWS);
}
