import { MongoClient, Db, MongoCallback } from "mongodb";

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const mongo_uri = `${url}/${dbName}`;

let myMongoCli = new MongoClient(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let connection: Db | null = null;

async function connectToMongoAtlas() {
    if (!connection) {
        console.log('connecting, wait a minute');

        connection = await new Promise((res, rej) => {
            myMongoCli.connect((err, result) => {
                if (err) {
                    console.log('Error in conection to mongo atlas');
                    console.error(err);
                }
                res(result.db());
            })
        })

    }
    return connection;
}

async function getAllData(collectionName: string) {
    return await connectToMongoAtlas().then(async (anyDb) => {
        // console.log(anyDb);        
        return await anyDb?.collection(collectionName).find().toArray()
    })
}

// async function getOneData(collectionName, id) {
//     return await connectToMongoAtlas().then((anyDb) => {
//         let ObjectIdWantFind;
//         try {
//             ObjectIdWantFind = new ObjectId(id);
//         } catch (error) {
//             console.error("Id given can't be transformed in an objectId");
//             return ({
//                 error: 'Error ID'
//             });
//         }
//         return anyDb?.collection(collectionName).findOne({ _id: ObjectIdWantFind })
//     })
// }

async function getLastAdded(collectionName: string, filter?: object) {
    // filtro={ tipo: tipoProveedor }
    return await connectToMongoAtlas().then(async (anyDb) => {
        if (filter) {
            return await anyDb?.collection(collectionName).findOne(
                filter,
                {
                    sort: { IdProveedor: -1 },
                }
            );
        } else {
            return await anyDb?.collection(collectionName).findOne(
                {
                    sort: { IdProveedor: -1 },
                }
            );
        }
    })
}

async function createDocument(collectionName: string, document: Object) {
    // filtro={ tipo: tipoProveedor }
    return await connectToMongoAtlas().then(async (anyDb) => {
        return await anyDb?.collection(collectionName).insertOne(
            document
        );
    })
}

async function updateDocument(collectionName: string, document: Object, filtro: Object,callback?:Function) {
    // filtro={ tipo: tipoProveedor }
    return await connectToMongoAtlas().then(async (anyDb) => {
        return await anyDb?.collection(collectionName).updateOne(
            filtro,
            {
                $set: document,
            },
            (err,result) => {
                if (err) {
                    console.error("Error al actualizar un documento");
                    return;
                }
                callback?callback(result):null;
            }
        );
    })
}
async function deleteDocument(collectionName: string, filtro: Object,callback?:Function) {
    return await connectToMongoAtlas().then(async (anyDb) => {
        return await anyDb?.collection(collectionName).deleteOne(
            filtro,
            (err,result) => {
                if (err) {
                    console.error("Error al actualizar un documento");
                    return;
                }
                callback?callback(result):null;
            }
        );
    })
}



export {
    getLastAdded,
    getAllData,
    createDocument,
    updateDocument,
    deleteDocument
}