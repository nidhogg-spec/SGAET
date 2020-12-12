import { MongoClient } from "mongodb";
require("dotenv").config();

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const coleccion = "DatoOrdenTipoA";
const keyId = "IdOrdenServTipA";
const IdLetras = "OA";

let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

 export default async (req, res) => {
    if (req.method == "POST") {
        switch (req.body.accion) {
          case "create":
            // Intentando generar id
          let IdNumero = 1;
          try {
            client = new MongoClient(url, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
            });
            await client.connect();
            let collection = client.db(dbName).collection(coleccion);
  
  
            const options = {sort: {}};
            options.sort[keyId]=-1;
  
            const result = await collection.findOne({}, options);
            if (result) {
              IdNumero = parseInt(result[keyId].slice(2), 10);
              IdNumero++
              // console.log(IdNumero);
            }
            req.body.data[keyId] =
              IdLetras +
              ("00000" + IdNumero.toString()).slice(IdNumero.toString().length);
            // console.log(req.body.data[keyId]);
  
          } catch (error) {
            console.log("error - " + error);
          }
          // } finally {
          //   client.close();
          // }
          //Enviando Datos
          try {
            client = new MongoClient(url, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
            });
            
            await client.connect();
            let collection = client.db(dbName).collection(coleccion);
            let result = await collection.find({}).project({
              "_id":0, 
            }).toArray()

            // console.log(req.body.data.IdServ) 

            let idreq =  req.body.data.IdServicioEscogido

            // console.log(result.length) 
            // console.log(idreq) 

            for (let index = 0; index <= result.length; index++) {
              if(result.length==0){
                console.log("1");
                collection.insertOne(req.body.data, function (err, res) {
                  if (err){
                    console.log(err)
                    throw err;
                  }
                  console.log("Insercion completada");
                  // res
                  // .status(200)
                  // .json({
                  //   message: "Todo bien, todo correcto, Añadicion satifactoria",
                  // });
                });
              }
              else if(result[index].IdServicioEscogido == idreq){
                console.log("2");
                console.log("Ya existe una orden de servicio")
                // client.close()
                break;
              }else if(result[index].IdServicioEscogido != idreq && index == result.length-1){
                console.log("3");
                collection.insertOne(req.body.data, function (err, res) {
                  if (err){
                    console.log(err)
                    throw err;
                  }
                  console.log("Insercion completada");
                  // res
                  // .status(200)
                  // .json({
                  //   message:
                      
                  //   "Todo bien, todo correcto, Añadicion satifactoria",
                  // });
                });  
              }
            }
          } catch (error) {
            console.log("error - " + error);
          } 
          // finally {
          //   await client.close();
          // }
            break;
          case "update":
            client = new MongoClient(url,{
              useNewUrlParser: true,
              useUnifiedTopology: true,
            });
            
            client.connect(function (err) {
              
              console.log("Connected to MognoDB server =>");
              const dbo = client.db(dbName);
              const collection = dbo.collection(coleccion);
              let dataActu = {
                $set: req.body.data,
              };
              
              collection.updateOne(
                { IdOrdenServTipA: req.body.idProducto },
                dataActu,
                (err, result) => {
                  if (err) {
                    res.status(500).json({ error: true, message: "un error .v"+ err });
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
                { IdCliente: req.body.idProducto },
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
  };
  