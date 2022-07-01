import { connectToDatabase } from "@/utils/API/connectMongo-v2";

const coleccion = "EvaluacionActividad";
const keyId = "IdEvaluacionActividad";
const IdLetras = "EA";



async function getData(dbo, callback) {
  const collection = dbo.collection("EvaluacionActividad");
  collection.find({}).toArray(callback);
}

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
        // //Enviando Datos
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
          });
        } catch (error) {
          console.log("error - " + error);
        }

        break;
      case "createmany":
        // // Intentando generar id
        let IdNumero2 = 1;
        try {
          await connectToDatabase().then(async connectedObject => {
            let collection = connectedObject.db.collection(coleccion);
            const options = { sort: {} };
            options.sort[keyId] = -1;
            const result = await collection.findOne({}, options);
            console.log(result)
            if (result && result[keyId]) {
              IdNumero2 = parseInt(result[keyId].slice(IdLetras.length), 10);
              IdNumero2++
              // console.log(IdNumero2);
            }
            let dt_sinID = [...req.body.data]
            dt_sinID.map(dt => {
              dt[keyId] = IdLetras + ("00000" + IdNumero2.toString()).slice(IdNumero2.toString().length);
              IdNumero2++
            })
            req.body.data = dt_sinID
          });
          //   req.body.data[keyId] =
          //     IdLetras +
          //     ("00000" + IdNumero2.toString()).slice(IdNumero2.toString().length);
          //   // console.log(req.body.data[keyId]);
        } catch (error) {
          console.log("error - " + error);
        }

        //Enviando Datos
        try {
          await connectToDatabase().then(async connectedObject => {
            let collection = connectedObject.db.collection(coleccion);
            await collection.insertMany(req.body.data, function (err, res) {
              if (err) {
                console.log(err)
                throw err;
              }
              console.log("Insercion completada");
            });
          });
        } catch (error) {
          console.log("error - " + error);
        }

        break;
      case "update":
        await connectToDatabase().then(async connectedObject => {
          let dbo = connectedObject.db;
          const collection = dbo.collection(coleccion);
          let dataActu = {
            $set: req.body.data,
          };

          collection.updateMany(
            { IdEvaluacionActividad: req.body.idProducto },
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
          let dbo = connectedObject.db;
          const collection = dbo.collection(coleccion);
          collection.deleteOne(
            { IdActividad: req.body.idProducto },
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
  if (req.method == "GET") {
    await connectToDatabase().then(async connectedObject => {
      let dbo = connectedObject.db;
      getData(dbo, function (err, data) {
        if (err) {
          res.status(500).json({ error: true, message: "un error .v" });
          return;
        }
        res.status(200).json({ data })
      });
    });
  }
};
