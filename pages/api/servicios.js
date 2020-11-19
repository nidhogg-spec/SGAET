import { MongoClient } from "mongodb";
import assert from "assert";
import bcrypt from "bcrypt";
const v4 = require("uuid").v4;
require("dotenv").config();
import jwt from "jsonwebtoken";

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

        let idServicio = req.body.idServicio;
        // console.log(req.body)
        let collection = dbo.collection(coleccion);
        // collection.findOne(idServicio)
        collection
          .find(
            {},
            {
              projection: {
                idServicio: 1,
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
            let idServicio = req.body.idServicio;
            console.log(req.body);
            let collection = dbo.collection(coleccion);
            collection.findOne({ idServicio }, (err, result) => {
              if (err) {
                res.status(500).json({ error: true, message: "un error .v" });
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
          try {
            client = new MongoClient(url, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
            });
            await client.connect();
            let collection = client.db(dbName).collection(coleccion);
            const options = {
              sort: { idProveedor: -1 },
            };
            const result = await collection.findOne({}, options);
            if (result) {
              IdNumero = parseInt(result[keyId].slice(2), 10);
            }
            req.body.data[keyId] =
              IdLetras +
              ("00000" + IdNumero.toString()).slice(IdNumero.toString().length);
            // console.log(req.body.data[keyId]);
          } catch (error) {
            console.log("error - " + error);
          } finally {
            client.close();
          }
          //Enviando Datos
          try {
            client = new MongoClient(url, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
            });
            await client.connect();
            let collection = client.db(dbName).collection(coleccion);
            await collection.insertOne(req.body.data, function (err, res) {
              if (err) throw err;
              console.log("Insercion completada");
            });
          } catch (error) {
            console.log("error - " + error);
          } finally {
            client.close();
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
        query[keyId] = req.body.idProveedor;
        collection.updateOne(
            query,
          dataActu,
          (err, result) => {
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
          }
        );
      });
      break;
    case "DELETE":
      client.connect(function (err) {
        console.log("Connected to MognoDB server =>");
        const dbo = client.db(dbName);
        const collection = dbo.collection(coleccion);
        let query = {};
        query[keyId] = req.body.idProveedor;
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
