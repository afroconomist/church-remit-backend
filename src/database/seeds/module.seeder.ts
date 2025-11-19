import { DB_TABLES } from "../../shared/enums/db-tables.enum";
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Insert into module table
  await knex(DB_TABLES.MODULES).del(); // clear table first
  await knex(DB_TABLES.MODULES).insert([
    {
      id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e2",
      name: "User Management",
    },
    {
      id: "1fd43ccb-512e-409e-8bf6-95fd0ea0d9e3",
      name: "Access Control Management",
    },
    {
      id: "2fd43ccb-512e-409e-8bf6-95fd0ea0d9e3",
      name: "Quotes Management",
    },
    {
      id: "3fd43ccb-512e-409e-8bf6-95fd0ea0d9e3",
      name: "Policy Management",
    },
    {
      id: "6fd43ccb-512e-409e-8bf6-96fd0ea0d9e3",
      name: "Claims Management",
    },
    {
      id: "7fd43ccb-512e-409e-8bf6-96fd0ea0d9e3",
      name: "Payment Management",
    },
    {
      id: "8fd43ccb-512e-409e-8bf6-96fd0ea0d9e3",
      name: "Product Management",
    }
  ]);
}
