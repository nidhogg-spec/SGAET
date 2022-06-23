import { connectToDatabase } from "@/utils/API/connectMongo-v2";

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const coleccion = "ClienteProspecto";
const keyId = "IdClienteProspecto";
const IdLetras = "CP";

export default async (req, res) => {
  if (req.method == "GET") {
    await connectToDatabase().then(async (connectedObject) => {
      let collection = connectedObject.db.collection(coleccion);
      const result = await collection.find({}).toArray();
      res.status(200).json({ ListaClientes: result });
      res.end();
    });
  }
  if (req.method == "POST") {
    switch (req.body.accion) {
      case "create":
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
              // console.log(IdNumero);
            }
            req.body.data[keyId] =
              IdLetras +
              ("00000" + IdNumero.toString()).slice(IdNumero.toString().length);
          });
          // console.log(req.body.data[keyId]);
        } catch (error) {
          console.log("error - " + error);
        }
        //Enviando Datos
        try {
          await connectToDatabase().then(async (connectedObject) => {
            let collection = connectedObject.db.collection(coleccion);
            collection.insertOne(req.body.data, function (err, result) {
              if (err) {
                console.log(err);
                throw err;
              }
              console.log("Insercion completada");
              res.status(200).json({ data: result.ops[0] });
              res.end();
            });
          });
        } catch (error) {
          console.log("error - " + error);
        }
        break;
      case "update":
        await connectToDatabase().then(async (connectedObject) => {
          let dbo = connectedObject.db;
          const collection = dbo.collection(coleccion);
          let dataActu = {
            $set: req.body.data
          };

          collection.updateOne(
            { IdClienteProspecto: req.body.IdClienteProspecto },
            dataActu,
            (err, result) => {
              if (err) {
                res
                  .status(500)
                  .json({ error: true, message: "Error" + err });
                return;
              }
              collection.findOne(
                { IdClienteProspecto: req.body.IdClienteProspecto },
                (err, result) => {
                  if (err) {
                    res
                      .status(500)
                      .json({ error: true, message: "Error" + err });
                    return;
                  }
                  res.status(200).json({ data: result });
                  res.end();
                }
              );
            }
          );
        });
        break;
      case "delete":
        await connectToDatabase().then(async (connectedObject) => {
          let dbo = connectedObject.db;
          const collection = dbo.collection(coleccion);
          collection.deleteOne(
            { IdCliente: req.body.idProducto },
            (err, result) => {
              if (err) {
                res.status(500).json({ error: true, message: "Error" });
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
  // if (req.method == "GET") {
  //   client.connect(function (err) {
  //     console.log("Connected to MognoDB server => de Matriz de Evaluacion");
  //     const dbo = client.db(dbName);
  //     getData(dbo, function (err, data) {
  //       if (err) {
  //         res.status(500).json({ error: true, message: "Error" });
  //         return;
  //       }
  //       res.status(200).json({data})
  //       client.close;
  //     });
  //   });
  // }
};
