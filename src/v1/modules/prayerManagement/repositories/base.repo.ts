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
    const baseQuery = this.model.query();

    Object.entries(filter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        baseQuery.whereIn(key, value);
      } else {
        baseQuery.where(key, value);
      }
    });

    const totalRecords = await baseQuery.clone().resultSize();

    const data = await baseQuery
      .clone()
      .orderBy("createdAt", "desc")
      .limit(limit)
      .offset((page - 1) * limit);

    return { data, totalRecords };
  }

  async findAllWithOrConditions(
    conditions: { field: string; value: any }[],
  ): Promise<T[]> {
    const query = this.model.query();

    if (conditions.length === 0) {
      return await query;
    }

    return await query.where((builder) => {
      conditions.forEach((condition, index) => {
        if (index === 0) {
          builder.where(condition.field, condition.value);
        } else {
          builder.orWhere(condition.field, condition.value);
        }
      });
    });
  }

  async save(data: Partial<T>, transaction?: Transaction): Promise<M> {
    return await this.model.query(transaction).insert(data).returning("*");
  }

  async deleteById(id: string) {
    return await this.model.query().deleteById(id);
  }
}
