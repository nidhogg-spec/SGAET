import { connectToDatabase } from "@/utils/API/connectMongo-v2";


const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const coleccion = "DatoOrdenTipoD";
const keyId = "IdOrdenServTipD";
const IdLetras = "OD";

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
            let result = await collection.find({}).project({
              "_id": 0,
            }).toArray()

            // console.log(req.body.data.IdServ) 

            let idreq = req.body.data.IdServicioEscogido

            // console.log(result.length) 
            // console.log(idreq) 

            for (let index = 0; index <= result.length; index++) {
              if (result.length == 0) {
                console.log("1");
                collection.insertOne(req.body.data, function (err, res) {
                  if (err) {
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
              else if (result[index].IdServicioEscogido == idreq) {
                console.log("2");
                console.log("Ya existe una orden de servicio")
                break;
              } else if (result[index].IdServicioEscogido != idreq && index == result.length - 1) {
                console.log("3");
                collection.insertOne(req.body.data, function (err, res) {
                  if (err) {
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
          });

        } catch (error) {
          console.log("error - " + error);
        }
        break;
      case "update":
        await connectToDatabase().then(async connectedObject => {
          let collection = connectedObject.db.collection(coleccion);
          let dataActu = {
            $set: req.body.data,
          };

          collection.updateOne(
            { IdOrdenServTipD: req.body.idProducto },
            dataActu,
            (err, result) => {
              if (err) {
                res.status(500).json({ error: true, message: "un error .v" + err });
                return;
              }
              console.log("Actualizacion satifactoria");
              res
                .status(200)
                .json({
                  message:
                    "Todo bien, todo correcto, Actualizacion satifactoria",
                });
            }
          );
        });
        break;
      case "delete":
        await connectToDatabase().then(async connectedObject => {
          let collection = connectedObject.db.collection(coleccion);
          collection.deleteOne(
            { IdCliente: req.body.idProducto },
            (err, result) => {
              if (err) {
                res.status(500).json({ error: true, message: "un error .v" });
                return;
              }
              console.log("Deleteacion satifactoria");
              res
                .status(200)
                .json({
                  message:
                    "Todo bien, todo correcto, Deleteacion satifactoria ",
                });
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
