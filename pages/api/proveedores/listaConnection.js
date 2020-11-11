import { MongoClient } from 'mongodb';
require('dotenv').config()

const url= process.env.MONGODB_URI
const dbName= process.env.MONGODB_DB

const client = new MongoClient(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

function getData(dbo,coleccion,callback){
    const collection = dbo.collection(coleccion);
    collection.find({}).toArray(callback);
}
function getData2(dbo,callback){
    const collection = dbo.collection("Proveedor");
    collection.find({}).toArray(callback);
}
// const findDocuments = function(db, callback) {
//     // Get the documents collection
//     const collection = db.collection('Proveedor');
//     // Find some documents
//     collection.find({}).toArray(function(err, docs) {
//       console.log("Found the following records");
//       console.log(docs)
//       console.log(docs.nombre)
//     });
//   }

export default (req, res) =>{
    if(req.method == 'POST'){
        client.connect(function(err){
            console.log('Connected to MognoDB server =>');
            const dbo = client.db(dbName);
            const coleccion = req.body.coleccion;
            getData(dbo,coleccion, function(err, data){
                res.status(200).json({data})
                client.close;
            })
        })
    }
    if(req.method == 'GET'){
        client.connect(function(err){
            console.log('Connected to MognoDB server =>');
            const dbo = client.db(dbName);

            getData2(dbo, function(err, data){
                if(err){
                    res.status(500).json({error:true, message: 'un error .v'})
                    return;
                }
                res.status(200).json({data})
                client.close;
            })
        })
    }
}

