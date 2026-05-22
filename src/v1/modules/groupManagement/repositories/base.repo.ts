import { ObjectLiteral } from "@shared/types/object-literal.type";
import { Model, Transaction } from "objection";

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
    const query = this.model.query();
    return await query.where(filter);
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

  async saveBulk(data?: Partial<T>[], trx?: Transaction): Promise<M[]> {
    return this.model.query(trx).insert(data).returning("*");
  }

  async deleteById(id: string) {
    return await this.model.query().deleteById(id);
  }

  async findAllForDropdown(
    filter: ObjectLiteral,
    idColumn: string,
    nameColumn: string,
    anyColumn?: string,
    anyColumnName?: string,
  ): Promise<{ id: string; name: string; anyField?: string }[]> {
    const query = this.model
      .query()
      .select(`id as ${idColumn}`, `${nameColumn} as name`)
      .where(filter)
      .orderBy(nameColumn);

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
}
