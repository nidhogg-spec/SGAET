import { MongoClient, Db, MongoCallback, ObjectId } from "mongodb";
import { connectToDatabase } from "./connectMongo-v2";

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const mongo_uri = `${url}/${dbName}`;

let myMongoCli = new MongoClient(mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let connection: Db | null = null;

async function connectToMongoAtlas() {
  if (!connection) {
    console.log("connecting, wait a minute");

    connection = await new Promise((res, rej) => {
      myMongoCli.connect((err, result) => {
        if (err) {
          console.log("Error in conection to mongo atlas");
          console.error(err);
        }
        res(result.db());
      });
    });
  }
  return connection;
}

async function getAllData(collectionName: string) {
  return await connectToDatabase().then(async (anyDb) => {
    // console.log(anyDb);
    return await anyDb.db.collection(collectionName).find().toArray();
  });
}

async function getOneData(collectionName: string, filter: Object) {
  return await connectToDatabase().then(async (anyDb) => {
    return anyDb.db.collection(collectionName).findOne(filter);
  });
}

async function getLastAdded(collectionName: string, filter?: object) {
  // filtro={ tipo: tipoProveedor }
  return await connectToDatabase().then(async (anyDb) => {
    if (filter) {
      return await anyDb.db.collection(collectionName).findOne(filter, {
        sort: { IdProveedor: -1 }
      });
    } else {
      return await anyDb.db.collection(collectionName).findOne({
        sort: { IdProveedor: -1 }
      });
    }
  });
}

async function createDocument(collectionName: string, document: Object) {
  // filtro={ tipo: tipoProveedor }
  return await connectToDatabase().then(async (anyDb) => {
    return await anyDb.db.collection(collectionName).insertOne(document);
  });
}

async function updateDocument(
  collectionName: string,
  document: Object,
  filtro: Object,
  callback?: Function
) {
  // filtro={ tipo: tipoProveedor }
  return await connectToDatabase().then(async (anyDb) => {
    return await anyDb.db.collection(collectionName).updateOne(
      filtro,
      {
        $set: document
      },
      (err, result) => {
        if (err) {
          console.error("Error al actualizar un documento");
          return;
        }
        callback ? callback(result) : null;
      }
    );
  });
}
async function deleteDocument(
  collectionName: string,
  filtro: Object,
  callback?: Function
) {
  return await connectToDatabase().then(async (anyDb) => {
    return await anyDb.db
      .collection(collectionName)
      .deleteOne(filtro, (err, result) => {
        if (err) {
          console.error("Error al actualizar un documento");
          return;
        }
        callback ? callback(result) : null;
      });
  });
}

export {
  getLastAdded,
  getAllData,
  createDocument,
  updateDocument,
  deleteDocument,
  getOneData,
  connectToMongoAtlas
};
