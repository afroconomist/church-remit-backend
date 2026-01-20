import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.SACRAMENTS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table
        .enu("sacramentType", [
          "Baptism",
          "Confirmation",
          "Wedding-Marriage",
          "First Communion",
          "Holy Orders",
        ])
        .notNullable();
      table.string("memberName").notNullable();
      table.date("dateOfSacrament").notNullable();
      table.string("officiatingMinister").notNullable();
      table.text("parentsGuardians").notNullable();
      table.text("sponsorsGodparentsWitnesses").notNullable();
      table.text("additionalNotes").notNullable();
      table.uuid("church").notNullable();
      table
        .foreign("church")
        .references("id")
        .inTable(DB_TABLES.CHURCHES)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("church");

      table.timestamps(true, true, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.SACRAMENTS);
}
