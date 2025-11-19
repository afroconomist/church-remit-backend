import { Knex } from "knex"; 
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.USERS, (table: Knex.TableBuilder) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("phoneNumber").notNullable();
    table.string("password").notNullable();
    table.string("avatar").nullable();
    table.string("address").notNullable();
    table.string("role").notNullable();
    table.string("supervisorId").notNullable();
    table.string("region").notNullable();
    table.boolean("isDefaultPassword").notNullable().defaultTo(true);
    table.string("status").notNullable().defaultTo('active').comment("active = Active Users, inactive = Inactive users/newly created users that has not changed their default password, deactivated = Deactivated users");
    table.string("signature").nullable();

    table.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.USERS);
}
