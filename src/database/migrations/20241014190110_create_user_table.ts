import { Knex } from "knex"; 
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.USERS, (table: Knex.TableBuilder) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("firstName").notNullable();
    table.string("lastName").notNullable();
    table.string("middleName").nullable();
    table.string("email").notNullable().unique();
    table.string("phoneNumber").nullable();
    table.string("password").notNullable();
    table.string("avatar").nullable();
    table.string("address").nullable();
    table.string("roleId").notNullable();
    table.boolean("isDefaultPassword").notNullable().defaultTo(true);
    table.string("status").notNullable().defaultTo('active').comment("active = Active Users, inactive = Inactive users/newly created users that has not changed their default password, deactivated = Deactivated users");
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
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.USERS);
}
