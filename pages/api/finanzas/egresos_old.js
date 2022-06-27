import { db_connect } from "@/src/db";
import { connectToDatabase } from "@/utils/API/connectMongo-v2";

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const coleccion = "Egreso";
const keyId = "IdEgreso";
const IdLetras = "EG";

export default async (req, res) => {
  if (req.method == "POST") {
    switch (req.body.accion) {
      case "create":
        let IdNumero = 1;
        let [client, collection] = await db_connect(coleccion);
        try {
          const options = { sort: {} };
          options.sort[keyId] = -1;

          const result = await collection.findOne({}, options);
          if (result) {
            IdNumero = parseInt(result[keyId].slice(2), 10);
            IdNumero++;
            // console.log(IdNumero);
          }
          req.body.data[keyId] =
            IdLetras +
            ("00000" + IdNumero.toString()).slice(IdNumero.toString().length);
        } catch (error) {
          console.log("error - " + error);
        }
        //Enviando Datos
        try {
          let result = await collection.insertOne(req.body.data);
          res.status(200).send(result);
          console.log("Insercion Realizada");
        } catch (error) {
          console.log("error - " + error);
        } 
        break;
      case "update":
        await connectToDatabase().then(async connectedObject=>{
          let dbo = connectedObject.db;
          const collection = dbo.collection(coleccion);
          let dataActu = {
            $set: req.body.data,
          };

          collection.updateOne(
            { IdEgreso: req.body.idProducto },
            dataActu,
            (err, result) => {
              if (err) {
                res
                  .status(500)
                  .json({ error: true, message: "un error .v" + err });
                return;
              }
              console.log("Actualizacion satifactoria");
              res.status(200).json({
                message: "Todo bien, todo correcto, Actualizacion satifactoria",
              });
            }
          );
        });
        break;
      case "delete":
        await connectToDatabase().then(async connectedObject=>{
          let dbo = connectedObject.db;
          const collection = dbo.collection(coleccion);
          collection.deleteOne(
            { IdEgreso: req.body.idProducto },
            (err, result) => {
              if (err) {
                res.status(500).json({ error: true, message: "un error .v" });
                return;
              }
              console.log("Deleteacion satifactoria");
              res.status(200).json({
                message: "Todo bien, todo correcto, Deleteacion satifactoria ",
              });
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
