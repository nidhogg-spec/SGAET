import { MongoClient } from "mongodb";
import { createDocument, updateDocument } from "utils/API/conexionMongo";
import { generarIdElementoNuevo } from "utils/API/generarId";
import { CRUD_log } from "../../../src/FuncionalidadInterna/Log/CRUD";


const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const coleccion = "Proveedor";
let client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async (req, res) => {
  if (req.method == "POST") {
    switch (req.body.accion) {
      case "findOne":
        client.connect(function (err) {
          console.log("Connected to MognoDB server =>");
          const dbo = client.db(dbName);
          const collection = dbo.collection(coleccion);
          collection.findOne(
            { IdProveedor: req.body.IdProveedor },
            (err, result) => {
              if (err) {
                res.status(500).json({ error: true, message: "un error .v" });
                client.close();
                return;
              }
              res.status(200).json({ result });
              client.close();
            }
          );
        });
        break;
      case "Create":
        //Para CREATE el body debe de tener:
        //  data
        //  accion

        let IdLetras = "";
        let tipoProveedor = req.body.data["tipo"];
        switch (tipoProveedor) {
          case "Hotel":
            IdLetras = "HT";
            break;
          case "Agencia":
            IdLetras = "AG";
            break;
          case "Guia":
            IdLetras = "GU";
            break;
          case "TransporteTerrestre":
            IdLetras = "TT";
            break;
          case "Restaurante":
            IdLetras = "RS";
            break;
          case "TransporteFerroviario":
            IdLetras = "TF";
            break;
          case "SitioTuristico":
            IdLetras = "ST";
            break;
          default:
            IdLetras = "NF";
            break;
        }
        req.body.data["IdProveedor"] = await generarIdElementoNuevo(coleccion, IdLetras, { tipo: tipoProveedor });
        console.log(req.body.data["IdProveedor"]);
        let result = await createDocument(coleccion, req.body.data)
        console.log('Proveedor ingresado');
        res.send('Proveedor ingresado');
        break;
      case "update":
        updateDocument(coleccion, req.body.data, { IdProveedor: req.body.IdProveedor }, (result) => {
          res.status(200).json({
            message: "Actualizacion satifactoria",
          });
        })

        // client.connect(function (err) {
        //   console.log("Connected to MognoDB server =>");
        //   const dbo = client.db(dbName);
        //   const collection = dbo.collection(coleccion);
        //   let dataActu = {
        //     $set: req.body.data,
        //   };
        //   collection.updateOne(
        //     { IdProveedor: req.body.IdProveedor },
        //     dataActu,
        //     (err, result) => {
        //       if (err) {
        //         res
        //           .status(500)
        //           .json({ error: true, message: "un error .v" + error });
        //         client.close();
        //         return;
        //       }
        //       console.log("Actualizacion satifactoria");
        //       res.status(200).json({
        //         message: "Todo bien, todo correcto, Actualizacion satifactoria",
        //       });
        //       // client.close();
        //     }
        //   );
        // });
        break;
      case "updateMany":
        client.connect(function (err) {
          console.log("Connected to MognoDB server =>");
          const dbo = client.db(dbName);
          const collection = dbo.collection(coleccion);
          let dataActu = {
            $set: req.body.data,
          };
          for (let index = 0; index < req.body.data.length; index++) {
            // if(result[index].IdProveedor == req.body.data[index].IdProveedor){
            collection.updateOne(
              { IdProveedor: req.body.data[index].IdProveedor },
              {
                $set: {
                  porcentajeTotal: req.body.data[index].porcentajeTotal,
                  periodo: req.body.data[index].periodoActual,
                },
              },
              (err, result) => {
                if (err) {
                  res
                    .status(500)
                    .json({ error: true, message: console.error(err) });
                  client.close();
                  return;
                }
                console.log("Actualizacion satifactoria");
                res.status(200).json({
                  message: console.log(result),
                });
                res.status(200).json({
                  message:
                    "Todo bien, todo correcto, Actualizacion satifactoria",
                });
              }
            );
          }
        });
        break;
      case "delete":
        client.connect(function (err) {
          console.log("Connected to MognoDB server =>");
          const dbo = client.db(dbName);
          const collection = dbo.collection(coleccion);
          collection.deleteOne(
            { IdProveedor: req.body.IdProveedor },
            (err, result) => {
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
            }
          );
        });
        break;

      default:
        res.status(500).json({
          message: "Error - Creo q no enviaste o enviaste mal la accion",
        });
        break;
    }
  }
};
