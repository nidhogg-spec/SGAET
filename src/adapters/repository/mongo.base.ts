import { myMongoDB } from "@/src/infraestructure/mongoDb/mongoDb";
import { reservaCotizacionInterface } from "@/utils/interfaces/db";
import { Collection, Db, FilterQuery, OptionalId } from "mongodb";
import { ReservaCotizacionRepository } from "./reservaCotizacion.repository";

export abstract class mongoBaseRepository<T extends { _id?: any }> {
  mongoDbClient!: Db;

  constructor(public collection: string) {}

  async getMongoClient() {
    const client = await myMongoDB.getMyService();
    this.mongoDbClient = client.db;
    return this.mongoDbClient;
  }
  async getMongoCollectionClient(collection: string) {
    const db = await this.getMongoClient();
    return db.collection<T>(collection);
  }

  // --------------------------------------------------------------
  async find(estado: 0 | 1 | number[] | "all" = 1) {
    const collection = await this.getMongoCollectionClient(this.collection);
    let filter: FilterQuery<T>;
    if (estado == "all")
      filter = {
        /*$or: [{ estado: 0 }, { estado: 1 }]*/
      } as FilterQuery<T>;
    else if (Array.isArray(estado)) {
      // @ts-ignore
      filter = {
        $or: []
      };
      for (const iterator of estado) {
        // @ts-ignore
        filter.$or?.push({ Estado: iterator });
      }
    } else
      filter = {
        Estado: estado as number
      } as FilterQuery<T>;
    const res = collection.find(filter);
    return res.toArray();
  }

  protected async findOne(id?: string, idKey?: string, _id?: string) {
    const collection = await this.getMongoCollectionClient(this.collection);
    let filter: FilterQuery<T>;
    if (_id)
      filter = {
        _id: _id
      } as FilterQuery<T>;
    //@ts-ignore
    else filter[idKey] = id;
    //@ts-ignore
    const res = collection.find(filter);
    return res.toArray();
  }

  async findWithFilters(filter?: FilterQuery<T>) {
    const collection = await this.getMongoCollectionClient(this.collection);
    const res = collection.find(filter);
    return res.toArray();
  }

  async insertOne(data: T) {
    const collection = await this.getMongoCollectionClient(this.collection);
    const res = await collection.insertOne(data as OptionalId<T>);
    return res.ops[0] ? res.ops[0] : null;
  }
  async updateOne(id: string, idKey: string, data: T) {
    const collection = await this.getMongoCollectionClient(this.collection);
    let filter: FilterQuery<T>;
    //@ts-ignore
    filter[idKey] = id;
    //@ts-ignore
    const res = await collection.updateOne(filter, data as OptionalId<T>);
    return res.result.ok;
  }

  async softDeleteOne(id: string, idKey: string) {
    const collection = await this.getMongoCollectionClient(this.collection);
    let filter: FilterQuery<T>;
    //@ts-ignore
    filter[idKey] = id;
    //@ts-ignore
    const res = await collection.updateOne(filter, {
      $set: {
        Estado: 0
      }
    });

    return res ? res : null;
  }

  async reactiveOne(id: string, idKey: string) {
    const collection = await this.getMongoCollectionClient(this.collection);
    let filter: FilterQuery<T>;
    //@ts-ignore
    filter[idKey] = id;
    //@ts-ignore
    const res = await collection.updateOne(filter, {
      $set: {
        Estado: 1
      }
    });
    return res;
  }
}
