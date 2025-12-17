import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.FAMILY_MEMBERS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("memberName").notNullable();
      table.string("memberEmail").notNullable().unique();
      table.string("memberPhoneNumber").notNullable();
      table.date("memberDOB").notNullable();
      table.string("memberAddress").notNullable();
      table
        .enu("memberRelationship", [
          "Parent",
          "Child",
          "Spouse",
          "Sibling",
          "Guardian",
        ])
        .notNullable();
      table.boolean("primary").notNullable().defaultTo(false);
      table.uuid("familyId").notNullable();
      table
        .foreign("familyId")
        .references("id")
        .inTable(DB_TABLES.FAMILIES)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("familyId");

      table.timestamps(true, true, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.FAMILY_MEMBERS);
}
