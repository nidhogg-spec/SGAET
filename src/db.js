import { MongoClient } from "mongodb";
require("dotenv").config();

export async function db_connect(Coleccion) {
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  console.log(Coleccion)
  let collection = client.db(dbName).collection(Coleccion);
//   return new Promise(resolve=>{
//     resolve([client, collection]);
//   });
  return([client, collection]); 
}
