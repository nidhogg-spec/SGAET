import { MongoClient } from "mongodb";
require("dotenv").config();


const jwtsecret = process.env.SECRET_KEY;

const saltRounds = 10;
const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const coleccion = "Servicio";
const keyId = "IdServicio";
const IdLetras = "SR";

export default async (req, res) => {
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  switch (req.method) {
    case "GET":
      client.connect((error) => {
        // assert.equal(err, null); // Preguntar
        let dbo = client.db(dbName);

        let idServicio = req.body.idDato;
        // console.log(req.body)
        let collection = dbo.collection(coleccion);
        // collection.findOne(idServicio)
        collection
          .find(
            {},
            {
              projection: {
                _id:0,
                IdServicio: 1,
                NombreServicio: 1,
                TipoServicio: 1,
              },
            }
          )
          .toArray((err, result) => {
            if (err) {
              throw err;
            }
            res.status(200).json({ result });
            client.close();
          });
      });
      break;
    case "POST":
      switch (req.body.accion) {
        case "FindOne":
          client.connect((error) => {
            // assert.equal(err, null); // Preguntar
            let dbo = client.db(dbName);
            console.log(req.body);
            let collection = dbo.collection(coleccion);
            let query={}
            query[keyId]=req.body.idDato
            collection.findOne(query, (err, result) => {
              if (err) {
                res.status(500).json({ error: true, message: "un error 1 .v" });
                return;
              }
              res.status(200).json({ result });
              client.close();
            });
          });
          break;
        case "Create":
          // Intentando generar id
          let IdNumero = 1;
          client = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          try {
            await client.connect();
            let collection = client.db(dbName).collection(coleccion);

            const options = {sort: {}};
            options.sort[keyId]=-1;
            const result = await collection.findOne({}, options);
            console.log(result)
            if (result) {
              IdNumero = parseInt(result[keyId].slice(2), 10);
              IdNumero++
            }
            req.body.data[keyId] =
              IdLetras +
              ("00000" + IdNumero.toString()).slice(IdNumero.toString().length);
            // console.log(req.body.data[keyId]);
          } catch (error) {
            console.log("error 1 - " + error);
          }
          //Enviando Datos
          // client = new MongoClient(url, {
          //   useNewUrlParser: true,
          //   useUnifiedTopology: true,
          // });
          try {
            await client.connect();
            let collection = client.db(dbName).collection(coleccion);
            await collection.insertOne(req.body.data, function (err, result) {
              if (err) {
                res.status(500).json({ error: true, message: "un error 2 .v "+err });
                // client.close();
                return;
              }
              console.log("Insercion completada");
              res.status(200).json({
                message: "Todo bien, todo correcto, Insercion satifactoria"
              });
            });
          } catch (error) {
            console.log("error 2 - " + error);
          }finally{
            await client.close()
          }
          break;
        default:
          res.status(500).json({
            message: "Error - Creo q no enviaste o enviaste mal la accion",
          });
          break;
      }
      break;
    case "PUT":
      client.connect(function (err) {
        console.log("Connected to MognoDB server =>");
        const dbo = client.db(dbName);
        const collection = dbo.collection(coleccion);
        let dataActu = {
          $set: req.body.data,
        };
        let query = {};
        query[keyId] = req.body.idDato;
        collection.updateOne(query, dataActu, (err, result) => {
          if (err) {
            res.status(500).json({ error: true, message: "un error .v" });
            client.close();
            return;
          }
          console.log("Actualizacion satifactoria");
          res.status(200).json({
            message: "Todo bien, todo correcto, Actualizacion satifactoria",
          });
          client.close();
        });
      });
      break;
    case "DELETE":
      client.connect(function (err) {
        console.log("Connected to MognoDB server =>");
        const dbo = client.db(dbName);
        const collection = dbo.collection(coleccion);
        let query = {};
        query[keyId] = req.body.idDato;
        collection.deleteOne(query, (err, result) => {
          if (err) {
            res.status(500).json({ error: true, message: "un error .v" });
            client.close();
            return;
          }
          console.log("Deleteacion satifactoria");
          res.status(200).json({
            message: "Todo bien, todo correcto, Deleteacion satifactoria ",
          });
          client.close();
        });
      });
      break;
    default:
      res.status(500).json({
        message: "Error - Creo q no enviaste o enviaste mal el method",
      });
      break;
  }
};
