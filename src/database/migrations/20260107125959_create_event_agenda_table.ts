import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.EVENT_AGENDAS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.time("time").notNullable();
      table.string("duration").nullable();
      table.string("title").notNullable();
      table.text("description").nullable();
      table.string("assignedTo").nullable();
      table.string("role").nullable();
      table.uuid("churchEvent").notNullable();
      table
        .foreign("churchEvent")
        .references("id")
        .inTable(DB_TABLES.EVENTS)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("churchEvent");

      table.timestamps(true, true, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.EVENT_AGENDAS);
}
