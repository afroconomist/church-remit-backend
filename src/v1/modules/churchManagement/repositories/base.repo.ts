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

  async getAll() {
    return await this.model.query();
  }

  async findOne(filter: ObjectLiteral): Promise<T | undefined> {
    return await this.model.query().where(filter).first();
  }

  async save(data: Partial<T>, transaction?: Transaction): Promise<M> {
    return await this.model.query(transaction).insert(data).returning("*");
  }
}
