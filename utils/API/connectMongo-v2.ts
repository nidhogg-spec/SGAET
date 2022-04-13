import { Db, MongoClient } from 'mongodb';
import {  } from "next";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

// check the MongoDB URI
if (!MONGODB_URI) {
    throw new Error('Define the MONGODB_URI environmental variable');
}

// check the MongoDB DB
if (!MONGODB_DB) {
    throw new Error('Define the MONGODB_DB environmental variable');
}

declare global {
    var mongo_cachedClient: null | MongoClient;
    var mongo_cachedDb: null | Db;
}

// let cachedClient: MongoClient | null = global.mongo_cachedClient;
// let cachedDb: Db | null = global.mongo_cachedDb;

export async function connectToDatabase() {
    // check the cached.
    if (global.mongo_cachedClient && global.mongo_cachedDb) {
        // load from cache
        console.log("Estado de coneccion: "+global.mongo_cachedClient.isConnected());
        return {
            client: global.mongo_cachedClient,
            db: global.mongo_cachedDb,
        };
    }
    console.log('Connecting to the Database v2');
    // set the connection options
    const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    // Connect to cluster
    let client = new MongoClient(MONGODB_URI as string, opts);
    await client.connect();
    let db = client.db(MONGODB_DB);

    // set cache
    global.mongo_cachedClient = client;
    global.mongo_cachedDb = db;

    return {
        client: global.mongo_cachedClient,
        db: global.mongo_cachedDb,
    };
}