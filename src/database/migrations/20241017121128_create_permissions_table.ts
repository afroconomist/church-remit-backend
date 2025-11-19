import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(
		DB_TABLES.PERMISSIONS,
		(table: Knex.TableBuilder) => {
			table.uuid("id").primary().defaultTo(knex.fn.uuid());
			table.uuid("moduleId").notNullable();
			table.string("name").notNullable().unique();
      table.string("description").nullable();
      table.string("action").nullable();
			table.string("slug").notNullable().unique();
			table.timestamps(true, true, true);

			table
				.foreign("moduleId")
				.references("id")
				.inTable(DB_TABLES.MODULES)
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
		}
	);
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable(DB_TABLES.PERMISSIONS);
}
