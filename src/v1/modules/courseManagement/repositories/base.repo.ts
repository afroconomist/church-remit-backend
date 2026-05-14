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

  async findAndUpdate(
    filter: ObjectLiteral,
    data: Partial<M>,
    trx?: Transaction,
  ): Promise<M> {
    return await this.model
      .query(trx)
      .where(filter)
      .update(data)
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

  async saveBulk(data: Partial<T>[], trx?: Transaction): Promise<M[]> {
    return this.model.query(trx).insert(data).returning("*");
  }

  async deleteById(id: string) {
    return await this.model.query().deleteById(id);
  }

  async updateByFilter(
    filter: ObjectLiteral,
    data: Partial<M>,
    trx?: Transaction,
  ): Promise<number> {
    return await this.model.query(trx).where(filter).update(data);
  }

  async findByIdAndDelete(id: string, trx?: Transaction): Promise<number> {
    return await this.model.query(trx).deleteById(id);
  }

  async findAllWithWhere(
    filter: ObjectLiteral,
    orderBy?: { column: string; order: "asc" | "desc" },
  ): Promise<T[]> {
    let query = this.model.query().where(filter);

    if (orderBy) {
      query = query.orderBy(orderBy.column, orderBy.order);
    }

    return await query;
  }

  async incrementField(
    id: string,
    field: string,
    increment: number = 1,
    trx?: Transaction,
  ): Promise<M> {
    return await this.model.query(trx).patchAndFetchById(id, {
      [field]: this.model.raw(`?? + ?`, [field, increment]),
    });
  }

  async decrementField(
    id: string,
    field: string,
    decrement: number = 1,
    trx?: Transaction,
  ): Promise<M> {
    return await this.model.query(trx).patchAndFetchById(id, {
      [field]: this.model.raw(`?? - ?`, [field, decrement]),
    });
  }
}
