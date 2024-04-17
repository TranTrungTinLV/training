import {
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult,
} from 'mongoose';
export class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}
  //** Create */
  async create(doc?: object): Promise<T> {
    return this.model.create(doc);
  }
  //** Find */
  async findById(id: string): Promise<T> {
    return this.model.findById(id);
  }
  async find(filter?: FilterQuery<T>): Promise<T[]> {
    return filter ? this.model.find(filter) : this.model.find({});
  }
  async findByIdAndUpdate(
    id: any,
    updated?: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<T[]> {
    return this.model.findByIdAndUpdate(id, updated, options);
  }

  async findOne(filter?: FilterQuery<T>, options?: QueryOptions): Promise<T> {
    return this.model.findOne(filter, options);
  }
  //** Count  */
  async countDocuments(queryOptions: QueryOptions): Promise<number> {
    return this.model.countDocuments(queryOptions);
  }
  //** Update */
  async updateOne(
    filter: FilterQuery<T>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.model.updateOne(filter, updated, options);
  }
  //** Delete */
  async deleteOne(
    filter: FilterQuery<T>,
    options?: QueryOptions,
  ): Promise<object> {
    return this.model.deleteOne(filter, options);
  }
}
