import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
const jwtsecret = process.env.SECRET_KEY;
const saltRounds = 10;
const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const coleccion = "ProgramaTuristico";
const keyId = "IdProgramaTuristico";
const IdLetras = "PT";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      try {
        await connectToDatabase().then(async (connectedObject) => {
          let dbo = connectedObject.db;
          let collection = dbo.collection(coleccion);
          collection.find({}, {}).toArray((err, result) => {
            if (err) {
              throw err;
            }
            res.status(200).json({ result });
          });
        });
      } catch (error) {
        console.log(error);
      }

      break;
    case "POST":
      switch (req.body.accion) {
        case "FindOne":
          await connectToDatabase().then(async (connectedObject) => {
            let dbo = connectedObject.db;
            let collection = dbo.collection(coleccion);
            let query = {};
            //@ts-ignore
            query[keyId] = req.body.idDato;
            collection.findOne(query, (err, result) => {
              if (err) {
                res.status(500).json({ error: true, message: "un error 1 .v" });
                return;
              }
              res.status(200).json({ result });
            });
          });
          break;
        case "Create":
          // Intentando generar id
          let IdNumero = 1;
          try {
            await connectToDatabase().then(async (connectedObject) => {
              let collection = connectedObject.db.collection(coleccion);
              const options = { sort: {} };
              //@ts-ignore
              options.sort[keyId] = -1;
              const result = await collection.findOne({}, options);
              if (result) {
                IdNumero = parseInt(result[keyId].slice(2), 10);
                IdNumero++;
              }
              req.body.data[keyId] =
                IdLetras +
                ("00000" + IdNumero.toString()).slice(
                  IdNumero.toString().length
                );
            });

            // console.log(req.body.data[keyId]);
          } catch (error) {
            console.log("error 1 - " + error);
          }
          //Enviando Datos
          try {
            await connectToDatabase().then(async (connectedObject) => {
              let collection = connectedObject.db.collection(coleccion);
              await collection.insertOne(req.body.data, function (err, result) {
                if (err) {
                  res
                    .status(500)
                    .json({ error: true, message: "un error 2 .v " + err });
                  return;
                }
                console.log("Insercion completada");
                res.status(200).json({
                  message: "Todo bien, todo correcto, Insercion satifactoria"
                });
              });
            });
          } catch (error) {
            console.log("error 2 - " + error);
          }
          break;
        default:
          res.status(500).json({
            message: "Error - Creo q no enviaste o enviaste mal la accion"
          });
          break;
      }
      break;
    case "PUT":
      await connectToDatabase().then(async (connectedObject) => {
        let dbo = connectedObject.db;
        const collection = dbo.collection(coleccion);
        let dataActu = {
          $set: req.body.data
        };
        let query = {};
        //@ts-ignore
        query[keyId] = req.body.idDato;
        collection.updateOne(query, dataActu, (err, result) => {
          if (err) {
            res.status(500).json({ error: true, message: "un error .v" });
            return;
          }
          console.log("Actualizacion satifactoria");
          res.status(200).json({
            message: "Todo bien, todo correcto, Actualizacion satifactoria"
          });
        });
      });
      break;
    case "DELETE":
      await connectToDatabase().then(async (connectedObject) => {
        let dbo = connectedObject.db;
        const collection = dbo.collection(coleccion);
        let query = {};
        //@ts-ignore
        query[keyId] = req.body.idDato;
        collection.deleteOne(query, (err, result) => {
          if (err) {
            res.status(500).json({ error: true, message: "un error .v" });
            return;
          }
          console.log("Deleteacion satifactoria");
          res.status(200).json({
            message: "Todo bien, todo correcto, Deleteacion satifactoria "
          });
        });
      });
      break;
    default:
      res.status(500).json({
        message: "Error - Creo q no enviaste o enviaste mal el method"
      });
      break;
  }
};
