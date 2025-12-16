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

  async findByEmails(emails: string[]): Promise<any[]> {
    return this.model.query().whereIn("email", emails);
  }

  async findByIdsAndRole(ids: string[]): Promise<any[]> {
    return this.model.query().whereIn("id", ids);
  }

  async updateById(
    id: string,
    data: Partial<M>,
    trx?: Transaction
  ): Promise<M> {
    return await this.model
      .query(trx)
      .patchAndFetchById(id, data)
      .returning("*");
  }

  async getAndCountAll(
    page: number = 1,
    limit: number = 10
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
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: T[]; totalRecords: number }> {
    const query = this.model.query();

    const totalRecords = await this.model.query().where(filter).resultSize();

    const data = await query
      .where(filter)
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
}
