import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(
		DB_TABLES.ROLE_PERMISSIONS,
		(table: Knex.TableBuilder) => {
			table.uuid("id").primary().defaultTo(knex.fn.uuid());
			table.uuid("roleId").references("id").inTable(DB_TABLES.ROLES).notNullable();
			table.uuid("permissionId").references("id").inTable(DB_TABLES.PERMISSIONS).notNullable();
			table.timestamps(true, true, true);
		}
	);
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable(DB_TABLES.ROLE_PERMISSIONS);
}
