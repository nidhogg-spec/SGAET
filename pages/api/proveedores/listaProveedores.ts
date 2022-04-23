import { createDocument, updateDocument } from "@/utils/API/conexionMongo";
import { generarIdElementoNuevo } from "@/utils/API/generarId";
import { CRUD_log } from "../../../src/FuncionalidadInterna/Log/CRUD";
import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";

interface proveedorList {
  id: string;
  proveedor: string;
  ubicacion: string;
  tipo: string;
}
const coleccion = "Proveedor";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  await new Promise<void>(async (resolve, reject) => {
    if (req.method == "POST") {
      switch (req.body.accion) {
        case "find":
          let filtro = { $or: [{ Estado: "1" }] };
          if (req.query.inactivos == "true") {
            filtro.$or.push({ Estado: "0" });
          }
          let Datos: proveedorList[] = [];
          await connectToDatabase().then(async (connectedObject) => {
            let collection = connectedObject.db.collection(coleccion);
            let data = await collection.find(filtro).toArray();
            data.map((datosResult) => {
              Datos.push({
                id: datosResult.IdProveedor,
                proveedor: datosResult.nombre,
                ubicacion: datosResult.DireccionFiscal,
                tipo: datosResult.tipo
              });
            });
            res.status(200).json({ ListaProveedores: Datos });
          });
          break;
        case "findOne":
          await connectToDatabase().then(async (connectedObject) => {
            let dbo = connectedObject.db;
            const collection = dbo.collection(coleccion);
            collection.findOne(
              { IdProveedor: req.body.IdProveedor },
              (err, result) => {
                if (err) {
                  res.status(500).json({ error: true, message: "un error .v" });
                  return;
                }
                res.status(200).json({ result });
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
          req.body.data["IdProveedor"] = await generarIdElementoNuevo(
            coleccion,
            IdLetras,
            { tipo: tipoProveedor }
          );
          console.log(req.body.data["IdProveedor"]);
          let result = await createDocument(coleccion, req.body.data);
          if (result.result.ok != 1) {
            res.status(500).json({ error: true, message: "Error" });
            return;
          }
          res.status(200).json({ data: result.ops[0] });
          break;
        case "update":
          updateDocument(
            coleccion,
            req.body.data,
            { IdProveedor: req.body.IdProveedor },
            () => {
              res.status(200).json({
                message: "Actualizacion satifactoria"
              });
            }
          );
          break;
        case "updateMany":
          await connectToDatabase().then(async (connectedObject) => {
            let dbo = connectedObject.db;
            const collection = dbo.collection(coleccion);
            let dataActu = {
              $set: req.body.data
            };
            for (let index = 0; index < req.body.data.length; index++) {
              // if(result[index].IdProveedor == req.body.data[index].IdProveedor){
              collection.updateOne(
                { IdProveedor: req.body.data[index].IdProveedor },
                {
                  $set: {
                    porcentajeTotal: req.body.data[index].porcentajeTotal,
                    periodo: req.body.data[index].periodoActual
                  }
                },
                (err, result) => {
                  if (err) {
                    res
                      .status(500)
                      .json({ error: true, message: console.error(err) });
                    return;
                  }
                  console.log("Actualizacion satifactoria");
                  res.status(200).json({
                    message: console.log(result)
                  });
                  res.status(200).json({
                    message:
                      "Todo bien, todo correcto, Actualizacion satifactoria"
                  });
                }
              );
            }
          });
          break;
        case "delete":
          await connectToDatabase().then(async (connectedObject) => {
            let dbo = connectedObject.db;
            const collection = dbo.collection(coleccion);
            collection.deleteOne(
              { IdProveedor: req.body.IdProveedor },
              (err, result) => {
                if (err) {
                  res.status(500).json({ error: true, message: "un error .v" });
                  return;
                }
                console.log("Deleteacion satifactoria");
                res.status(200).json({
                  message: "Todo bien, todo correcto, Deleteacion satifactoria "
                });
              }
            );
          });
          break;

        default:
          res.status(500).json({
            message: "Error - Creo q no enviaste o enviaste mal la accion"
          });
          break;
      }
    }
    res.end();
    resolve();
  });
};
