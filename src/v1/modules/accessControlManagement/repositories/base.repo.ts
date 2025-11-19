import "reflect-metadata";
import { ObjectLiteral } from "@shared/types/object-literal.type";
import { Model, Transaction } from "objection";
import logger from "@shared/utils/logger";
import ServiceUnavailableError from "@shared/error/service-unavailable.error";

export class BaseRepository<T, M extends Model> {
	private model: typeof Model | any;
	constructor(model: M | any) {
		this.model = model;
	}

	setModel(model: M | any) {
		this.model = model;
	}

	async findById(id: string, relations: string[] = []): Promise<M> {
		const query = this.model.query();

		for (const relation of relations) {
			query.withGraphFetched(relation);
		}

		return await query.findById(id);
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

	async save(data: Partial<T>, transaction?: Transaction): Promise<M> {
		return await this.model.query(transaction).insert(data).returning("*");
	}

	async saveBulk(data: Partial<T[]>, transaction?: Transaction): Promise<M> {
		return await this.model.query(transaction).insert(data).returning("*");
	}

	async getAll() {
		return await this.model.query();
	}

	async getAllWithRelations(relations: string[] = []) {
		const query = this.model.query();

		for (const relation of relations) {
			query.withGraphFetched(relation);
		}

		return await query;
	}

	async deleteById(id: string) {
		return await this.model.query().deleteById(id);
	}

	async findByName(name: string) {
		return await this.model.query().findOne({ name });
	}

	async findByNameWithRelations(slug: string, relations: string[] = []) {
		const query = this.model.query().findOne({ slug });

		for (const relation of relations) {
			query.withGraphFetched(relation);
		}

		return await query;
	}

	async findOneWhere(filter: ObjectLiteral): Promise<T | undefined> {
		return await this.model.query().where(filter)[0];
	}

	async findWhere(
		filter: ObjectLiteral,
		relations: string[] = []
	): Promise<T[]> {
		const query = this.model.query();

		for (const relation of relations) {
			query.withGraphFetched(relation);
		}

		return await query.where(filter);
	}

	async saveWithRelations(
		data: Partial<T>,
		relationsData: ObjectLiteral,
		relationTable: string,
		foreignKey: string,
		trx?: Transaction
	): Promise<M> {
		return await this.model.transaction(async (transaction: Transaction) => {
			try {
				const savedRecord = await this.model
					.query(trx || transaction)
					.insert(data)
					.returning("*");

				if (relationsData && relationTable && foreignKey) {
					const relatedData = relationsData.map((relation: any) => ({
						...relation,
						[foreignKey]: savedRecord.id,
					}));

						await this.model
							.knexQuery()
							.table(relationTable)
							.insert(relatedData)
							.transacting(trx || transaction);
				}

				return savedRecord;
			} catch (error: any) {
				logger.error("Error saving with relations:", {
					data,
					relationsData,
				});
				throw new ServiceUnavailableError(
					"Failed to save record with relations."
				);
			}
		});
	}

	async updateWithRelations(
		id: string,
		data: Partial<M>,
		relationsData: ObjectLiteral,
		relationTable: string,
		foreignKey: string
	): Promise<M> {
		return await this.model.transaction(async (trx: Transaction) => {
			try {
				const updatedRecord = await this.model
					.query(trx)
					.patchAndFetchById(id, data)
					.returning("*");

				if (foreignKey && relationsData[relationTable]) {
					await this.model
						.knexQuery()
						.table(relationTable)
						.where(foreignKey, id)
						.delete()
						.transacting(trx);

					await this.model
						.knexQuery()
						.table(relationTable)
						.insert(relationsData[relationTable])
						.transacting(trx);
				}

				return updatedRecord;
			} catch (error: any) {
				logger.error(`Error updating with relations:`, {
					id,
					data,
					relationsData,
				});
				throw new ServiceUnavailableError();
			}
		});
	}

	public async deleteWithRelations(
		id: string,
		relationTable?: string,
		foreignKey?: string
	): Promise<void> {
		try {
			await this.model.transaction(async (transaction: Transaction) => {
				if (foreignKey && relationTable) {
					await this.model
						.knexQuery()
						.table(relationTable)
						.where(foreignKey, id)
						.delete()
						.transacting(transaction);
				}

				await this.model.query(transaction).deleteById(id);
			});
		} catch (error: any) {
			logger.error("Error during deletion:", error);
			throw new ServiceUnavailableError(
				"Failed to delete role with its relations."
			);
		}
	}

	async transaction<T>(
		operation: (trx: Transaction) => Promise<T>
	): Promise<T> {
		return await this.model.transaction(async (trx) => {
			try {
				const result = await operation(trx);
				await trx.commit();
				return result;
			} catch (error) {
				await trx.rollback();
				throw new Error("Error performing transaction");
			}
		});
	}
}
