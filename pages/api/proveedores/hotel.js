import { MongoClient } from 'mongodb';
require('dotenv').config()

const url= process.env.MONGODB_URI
const dbName= process.env.MONGODB_DB
const coleccion = "ProductoHoteles";
const client = new MongoClient(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
function getData2(dbo,callback){
    const collection = dbo.collection("ProductoHoteles");
    collection.find({}).toArray(callback);
}

export default async (req, res) =>{
    if (req.method == "POST") {
        switch (req.body.accion) {
          case "create":
            client.connect(function (err) {
                console.log("Connected to MognoDB server =>");
                const dbo = client.db(dbName);
                const collection = dbo.collection(coleccion);
                collection.insertOne(req.body.data, (err, result) => {
                    if (err) {
                      res.status(500).json({ error: true, message: "un error .v" });
                      client.close();
                      return;
                    }
                    console.log("Insercion satifactoria");
                    res
                      .status(200)
                      .json({
                        message: "Todo bien, todo correcto, Insercion satifactoria",
                      });
                    client.close();
                  });    
              });
            break;
          case "update":
            client.connect(function (err) {
              console.log("Connected to MognoDB server =>");
              const dbo = client.db(dbName);
              const collection = dbo.collection(coleccion);
              let dataActu = {
                $set: req.body.data,
              };
              collection.updateOne(
                { idProveedor: req.body.idProveedor },
                dataActu,
                (err, result) => {
                  if (err) {
                    res.status(500).json({ error: true, message: "un error .v" });
                    client.close();
                    return;
                  }
                  console.log("Actualizacion satifactoria");
                  res
                    .status(200)
                    .json({
                      message:
                        "Todo bien, todo correcto, Actualizacion satifactoria",
                    });
                  client.close();
                }
              );
            });
            break;
          case "delete":
            client.connect(function (err) {
              console.log("Connected to MognoDB server =>");
              const dbo = client.db(dbName);
              const collection = dbo.collection(coleccion);
              collection.deleteOne(
                { idProveedor: req.body.idProveedor },
                (err, result) => {
                  if (err) {
                    res.status(500).json({ error: true, message: "un error .v" });
                    client.close();
                    return;
                  }
                  console.log("Deleteacion satifactoria");
                  res
                    .status(200)
                    .json({
                      message:
                        "Todo bien, todo correcto, Deleteacion satifactoria ",
                    });
                  client.close();
                }
              );
            });
            break;
    
          default:
            res
              .status(500)
              .json({
                message: "Error - Creo q no enviaste o enviaste mal la accion",
              });
            break;
        }
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
