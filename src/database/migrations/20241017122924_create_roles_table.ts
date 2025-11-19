import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(
		DB_TABLES.ROLES,
		(table: Knex.TableBuilder) => {
			table.uuid("id").primary().defaultTo(knex.fn.uuid());
			table.string("name").notNullable().unique();
			table.string("description").nullable();
			table.string("slug").notNullable().unique();
			table.timestamps(true, true, true);
		}
	);
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable(DB_TABLES.ROLES);
}
