import { ObjectLiteral } from "@shared/types/object-literal.type";
import { Model, Transaction, raw } from "objection";

export class BaseRepository<T, M extends Model> {
  private model: typeof Model | any;
  constructor(model: M | any) {
    this.model = model;
  }

  setModel(model: M | any) {
    this.model = model;
  }

  async findById(id: string): Promise<M> {
    const query = this.model.query();

    return await query.findById(id);
  }

  async findByEmails(emails: string[]): Promise<any[]> {
    return this.model.query().whereIn("email", emails);
  }

  async findByIdsAndRole(ids: string[]): Promise<any[]> {
    return this.model.query().whereIn("id", ids);
  }

  async updateById(
    id: string,
    data: Partial<M>,
    trx?: Transaction,
  ): Promise<M> {
    return await this.model
      .query(trx)
      .patchAndFetchById(id, data)
      .returning("*");
  }

  async getAndCountAll(
    page: number,
    limit: number,
  ): Promise<{ data: T[]; totalRecords: number }> {
    const query = this.model.query();

    const totalRecords = await this.model.query().resultSize();

    const data = await query.limit(limit).offset((page - 1) * limit);

    return { data, totalRecords };
  }

  async findOne(filter: ObjectLiteral): Promise<T | undefined> {
    return await this.model.query().where(filter).first();
  }

  async findAll(filter: ObjectLiteral): Promise<T[]> {
    const baseQuery = this.model.query();

    Object.entries(filter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        baseQuery.whereIn(key, value);
      } else {
        baseQuery.where(key, value);
      }
    });

    const data = await baseQuery;
    return data;
  }

  async findAndCountAll(
    filter: ObjectLiteral,
    page: number,
    limit: number,
  ): Promise<{ data: T[]; totalRecords: number }> {
    const query = this.model.query();

    const totalRecords = await this.model.query().where(filter).resultSize();

    const data = await query
      .where(filter)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .offset((page - 1) * limit);

    return { data, totalRecords };
  }

  async save(data: Partial<T>, transaction?: Transaction): Promise<M> {
    return await this.model.query(transaction).insert(data).returning("*");
  }

  async saveMany(users: any[]): Promise<any[]> {
    return await this.model.query().insert(users).returning("*");
  }

  async deleteById(id: string) {
    return await this.model.query().deleteById(id);
  }

  async findAllForDropdown(
    filter: ObjectLiteral,
    idColumn: string,
    firstNameColumn: string,
    lastNameColumn: string,
    anyColumn?: string,
    anyColumnName?: string,
  ): Promise<{ id: string; name: string; anyField?: string }[]> {
    const query = this.model
      .query()
      .select(
        `id as ${idColumn}`,
        raw(`CONCAT(??, ' ', ??) as memberName`, [
          firstNameColumn,
          lastNameColumn,
        ]),
      )
      .where(filter);

    if (anyColumn) {
      query.select(`${anyColumn} as ${anyColumnName}`);
    }

    return await query;
  }

  async getAllForDropdown(
    idColumn: string,
    nameColumn: string,
  ): Promise<{ id: string; name: string }[]> {
    return await this.model
      .query()
      .select(`id as ${idColumn}`, `${nameColumn} as name`)
      .orderBy(nameColumn);
  }

  async findNonGroupMembersForDropdown(
    filter: ObjectLiteral,
    groupMembersTable: string,
    groupId: string,
    idColumn: string,
    firstNameColumn: string,
    lastNameColumn: string,
  ): Promise<{ id: string; name: string }[]> {
    return await this.model
      .query()
      .select(
        `id as ${idColumn}`,
        raw(`CONCAT(??, ' ', ??) as name`, [firstNameColumn, lastNameColumn]),
      )
      .where(filter)
      .whereNotIn(
        "id",
        this.model
          .query()
          .select("churchMemberId")
          .from(groupMembersTable)
          .where("group", groupId)
          .whereNotNull("churchMemberId"),
      )
      .orderBy("name");
  }

  async findUpcomingBirthdays(
    filter: ObjectLiteral,
    range: number,
    page: number,
    limit: number,
  ): Promise<{ data: T[]; totalRecords: number }> {
    const offset = (page - 1) * limit;

    const birthdaySql = `
      CASE
        WHEN make_date(
          extract(year from current_date)::int,
          extract(month from "dateOfBirth")::int,
          extract(day from "dateOfBirth")::int
        ) < current_date
        THEN make_date(
          extract(year from current_date)::int + 1,
          extract(month from "dateOfBirth")::int,
          extract(day from "dateOfBirth")::int
        )
        ELSE make_date(
          extract(year from current_date)::int,
          extract(month from "dateOfBirth")::int,
          extract(day from "dateOfBirth")::int
        )
      END
    `;

    const daysToGoSql = `
      (${birthdaySql} - current_date)::int
    `;

    const baseQuery = this.model
      .query()
      .where(filter)
      .select(
        "*",
        raw(`${birthdaySql} as "birthday"`),
        raw(`${daysToGoSql} as "daysToGo"`),
        raw(`
          extract(year from ${birthdaySql})::int
          - extract(year from "dateOfBirth")::int
          as "turningAge"
        `),
      );

    if (range > 0) {
      baseQuery.whereRaw(`${daysToGoSql} BETWEEN 0 AND ?`, [range]);
    }

    const totalRecordsResult = await baseQuery
      .clone()
      .clearSelect()
      .count("* as count")
      .first();

    const totalRecords = Number(totalRecordsResult?.count ?? 0);

    const data = await baseQuery
      .orderBy("daysToGo", "asc")
      .limit(limit)
      .offset(offset);

    return { data, totalRecords };
  }
}
