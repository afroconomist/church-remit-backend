import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function seed(knex: Knex): Promise<void> {
  await knex(DB_TABLES.MODULES).del();
  await knex(DB_TABLES.MODULES).insert([
    // Core Modules
    { name: "Dashboard" },
    { name: "Communications" },
    { name: "Reports" },
    { name: "People" },
    { name: "Ministry" },
    { name: "Finance" },
    { name: "Payroll" },
    { name: "Accounting" },
    { name: "Banking" },
    { name: "Remittance" },
    { name: "Resources" },
    { name: "Campuses" },
    { name: "Settings" },
  ]);
}