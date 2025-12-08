import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    DB_TABLES.MEMBERS,
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("firstName").notNullable();
      table.string("lastName").notNullable();
      table.string("middleName").nullable();
      table.string("email").notNullable().unique();
      table.string("phoneNumber").notNullable();
      table.date("dateOfBirth").nullable();
      table.enu("gender", ["Male", "Female"]).nullable();
      table
        .enu("maritalStatus", ["Single", "Married", "Divorced", "Widowed"])
        .nullable();
      table.string("occupation").nullable();
      table.string("streetAddress").nullable();
      table.string("city").nullable();
      table.string("state").nullable();
      table.string("country").nullable();
      table.string("contactName").nullable();
      table.string("contactNumber").nullable();
      table
        .enu("relationship", [
          "Spouse",
          "Parent",
          "Sibling",
          "Child",
          "Friend",
          "Other",
        ])
        .nullable();
      table
        .enu("membershipStatus", [
          "Visitor",
          "Regular Attender",
          "Member",
          "Inactive",
        ])
        .notNullable();
      table.date("joinDate").nullable();
      table.date("baptismDate").nullable();
      table.string("notes").nullable();
      table.string("password").notNullable();
      table.string("roleId").notNullable();
      table.boolean("isDefaultPassword").notNullable().defaultTo(true);
      table
        .string("status")
        .notNullable()
        .defaultTo("active")
        .comment(
          "active = Active members, inactive = Inactive members/newly created members that has not changed their default password, deactivated = Deactivated members"
        );
      table.text("refreshToken").nullable();
      table.text("addedBy").nullable();
      table.uuid("churchId").notNullable();
      table
        .foreign("churchId")
        .references("id")
        .inTable(DB_TABLES.CHURCHES)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.index("churchId");

      table.timestamps(true, true, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.MEMBERS);
}
