import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.NEWSLETTERS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("newsletterTitle").notNullable();
      table.string("emailSubjectLine").notNullable();
      table.text("emailContent").notNullable();
      table.string("audience").notNullable();
      table.boolean("includeAttachements").notNullable().defaultTo(false);
      table.boolean("sendImmediately").notNullable().defaultTo(false);
      table.date("sendDate").nullable();
      table.time("sendTime").nullable();
      table.date("postedAt").notNullable();
      table.integer("recipients").notNullable().defaultTo(0);
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
  return knex.schema.dropTable(DB_TABLES.NEWSLETTERS);
}
