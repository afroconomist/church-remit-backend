import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE ${DB_TABLES.EVENTS}
    DROP COLUMN IF EXISTS category
    CASCADE
  `);

  await knex.raw(`
    DROP TYPE IF EXISTS events_category_enum CASCADE
  `);
}

export async function down(): Promise<void> {}
