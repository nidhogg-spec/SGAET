import { connectToDatabase } from "@/utils/API/connectMongo-v2";


const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const coleccion = "Ingreso";
const keyId = "IdIngreso";
const IdLetras = "IG";

export default async (req, res) => {
  if (req.method == "POST") {
    switch (req.body.accion) {
      case "create":
        // Intentando generar id
        let IdNumero = 1;
        try {
          await connectToDatabase().then(async connectedObject => {
            let collection = connectedObject.db.collection(coleccion);
            const options = { sort: {} };
            options.sort[keyId] = -1;

            const result = await collection.findOne({}, options);
            if (result) {
              IdNumero = parseInt(result[keyId].slice(2), 10);
              IdNumero++
              // console.log(IdNumero);
            }
            req.body.data[keyId] =
              IdLetras +
              ("00000" + IdNumero.toString()).slice(IdNumero.toString().length);
          });
        } catch (error) {
          console.log("error - " + error);
        }
        //Enviando Datos
        try {
          await connectToDatabase().then(async connectedObject => {
            let collection = connectedObject.db.collection(coleccion);
            await collection.insertOne(req.body.data, function (err, res) {
              if (err) {
                console.log(err)
                throw err;
              }
              console.log("Insercion completada");
            });
            res.status(200).send('Ingresado')
          });

        } catch (error) {
          console.log("error - " + error);
        }
        // finally {
        //   await client.close();
        // }
        break;
      case "update":
        await connectToDatabase().then(async connectedObject => {
          let dbo = connectedObject.db;
          const collection = dbo.collection(coleccion);
          let dataActu = {
            $set: req.body.data,
          };

          collection.updateOne(
            { IdIngreso: req.body.idProducto },
            dataActu,
            (err, result) => {
              if (err) {
                res.status(500).json({ error: true, message: "un error .v" + err });
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
        await connectToDatabase().then(async connectedObject=>{
          let dbo = connectedObject.db;
          const collection = dbo.collection(coleccion);
          collection.deleteOne(
            { IdIngreso: req.body.idProducto },
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
