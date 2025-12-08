import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function seed(knex: Knex): Promise<void> {
  await knex(DB_TABLES.ROLES).del();
  await knex(DB_TABLES.ROLES).insert([
    {
      name: "Super Admin",
      slug: "super-admin",
      description: "Full system access and complete control over all modules",
    },
    {
      name: "Finance Manager",
      slug: "finance-manager",
      description: "Access to financial and treasury-related modules only",
    },
    {
      name: "HR Manager",
      slug: "hr-manager",
      description: "Manages staff payroll and volunteer records",
    },
    {
      name: "Campus Admin",
      slug: "campus-admin",
      description: "Manages campus operations across multiple modules",
    },
    {
      name: "Treasurer",
      slug: "treasurer",
      description: "Oversees finances, accounting, and treasury operations",
    },
    {
      name: "Volunteer Coordinator",
      slug: "volunteer-coordinator",
      description: "Handles volunteers and ministry activities",
    },
    {
      name: "Media Manager",
      slug: "media-manager",
      description: "Manages streaming, media uploads, archives, and church content",
    },
    {
      name: "Staff",
      slug: "staff",
      description: "Internal staff role with limited access",
    },
    {
      name: "Member",
      slug: "member",
      description: "General church member with basic account access",
    },
  ]);
}