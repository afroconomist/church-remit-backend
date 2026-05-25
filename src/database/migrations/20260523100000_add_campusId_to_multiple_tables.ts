import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasColumn(DB_TABLES.USERS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.USERS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.MEMBERS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.MEMBERS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.STUDENTS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.STUDENTS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.COURSES, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.COURSES, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.FACILITIES, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.FACILITIES, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.DOCUMENTS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.DOCUMENTS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.CATEGORIES, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.CATEGORIES, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.MEMBER_BIRTHDAYS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.MEMBER_BIRTHDAYS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.NEWS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.NEWS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.NEWSLETTERS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.NEWSLETTERS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.DISCUSSION_BOARDS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.DISCUSSION_BOARDS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.TAGS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.TAGS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.ANNOUNCEMENTS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.ANNOUNCEMENTS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.CIRCULARS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.CIRCULARS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.ASSETS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.ASSETS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.TESTIMONIES, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.TESTIMONIES, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.FAMILIES, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.FAMILIES, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.LEAVES, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.LEAVES, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.VOLUNTEER_ROLES, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.VOLUNTEER_ROLES, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.VOLUNTEERS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.VOLUNTEERS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.EVENTS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.EVENTS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.PRAYER_REQUESTS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.PRAYER_REQUESTS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.PRAYER_WARRIORS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.PRAYER_WARRIORS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.SACRAMENTS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.SACRAMENTS, (table) => {
      table.uuid("campusId").nullable();
    });
  }

  if (!(await knex.schema.hasColumn(DB_TABLES.GROUPS, "campusId"))) {
    await knex.schema.alterTable(DB_TABLES.GROUPS, (table) => {
      table.uuid("campusId").nullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const tablesToModify = [
    DB_TABLES.USERS,
    DB_TABLES.MEMBERS,
    DB_TABLES.STUDENTS,
    DB_TABLES.COURSES,
    DB_TABLES.FACILITIES,
    DB_TABLES.DOCUMENTS,
    DB_TABLES.CATEGORIES,
    DB_TABLES.MEMBER_BIRTHDAYS,
    DB_TABLES.NEWS,
    DB_TABLES.NEWSLETTERS,
    DB_TABLES.DISCUSSION_BOARDS,
    DB_TABLES.TAGS,
    DB_TABLES.ANNOUNCEMENTS,
    DB_TABLES.CIRCULARS,
    DB_TABLES.ASSETS,
    DB_TABLES.TESTIMONIES,
    DB_TABLES.FAMILIES,
    DB_TABLES.LEAVES,
    DB_TABLES.VOLUNTEER_ROLES,
    DB_TABLES.VOLUNTEERS,
    DB_TABLES.EVENTS,
    DB_TABLES.PRAYER_REQUESTS,
    DB_TABLES.PRAYER_WARRIORS,
    DB_TABLES.SACRAMENTS,
    DB_TABLES.GROUPS,
  ];

  for (const table of tablesToModify) {
    if (await knex.schema.hasColumn(table, "campusId")) {
      await knex.schema.alterTable(table, (t) => {
        t.dropColumn("campusId");
      });
    }
  }
}
