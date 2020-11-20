import { MongoClient } from "mongodb";
require("dotenv").config();

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const coleccion = "Proveedor";
let client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function getData2(dbo, callback) {
  const collection = dbo.collection("Proveedor");
  collection.find({}).toArray(callback);
}

export default async (req, res) => {
  if (req.method == "POST") {
    switch (req.body.accion) {
      case "findOne":
        client.connect(function (err) {
          console.log("Connected to MognoDB server =>");
          const dbo = client.db(dbName);
          const collection = dbo.collection(coleccion);
          collection.findOne(
            { idProveedor: req.body.idProveedor },
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
      case "prueba":
        try {
          client = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          await client.connect();
          const dbo = client.db(dbName);
          const collection = dbo.collection(coleccion);
          const options = {
            sort: { idProveedor: -1 },
          };

          const result = await collection.findOne({ tipo: "Hotela" }, options);
          res.status(200).json({ result });
          console.log(result);
        } catch (error) {
          res.status(500).json({ error });
          console.log("error - " + error);
        } finally {
          client.close();
        }
        break;
      case "create":
        //Para CREATE el body debe de tener:
        //  data
        //  accion
        //  tipoProveedor
        let IdLetras = "";
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
          const result = await collection.findOne(
            { tipo: req.body.tipoProveedor },
            options
          );
          if (result) {
            IdLetras = result.idProveedor.substring(0,2);
            IdNumero = parseInt(result.idProveedor.slice(2),10)
            IdNumero++;
            req.body.data["idProveedor"]=IdLetras+(("00000"+IdNumero.toString()).slice(IdNumero.toString().length))
          } else {
            switch (req.body.tipoProveedor) {
              case "Hotel":
                IdLetras = "HT";
                break;
              case "Agencia":
                IdLetras = "AG";
                break;
              case "Guia":
                IdLetras = "GU";
                break;
              case "Transporteterrestre":
                IdLetras = "TT";
                break;
              case "Restaurante":
                IdLetras = "RS";
                break;
              case "Transporteferroviario":
                IdLetras = "TF";
                break;
              default:
                IdLetras = "NF";
                break;
            }
            req.body.data["idProveedor"]=IdLetras+"00001"
          }
          console.log(req.body.data.idProveedor);
        } catch (error) {
          res.status(500).json({ error });
          console.log("error - " + error);
        } finally {
          client.close();
        }
        client = new MongoClient(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        await client.connect();
        let collection = client.db(dbName).collection(coleccion);
        collection.insertOne(req.body.data, (err, result) => {
          if (err) {
            res.status(500).json({ error: true, message: "un error .v" });
            client.close();
            return;
          }
          console.log("Insercion satifactoria");
          res
            .status(200)
            .json({
              message: "Todo bien, todo correcto, Insercion satifactoria",
            });
          client.close();
        });

        break;
      case "update":
        client.connect(function (err) {
          console.log("Connected to MognoDB server =>");
          const dbo = client.db(dbName);
          const collection = dbo.collection(coleccion);
          let dataActu = {
            $set: req.body.data,
          };
          collection.updateOne(
            { idProveedor: req.body.idProveedor },
            dataActu,
            (err, result) => {
              if (err) {
                res.status(500).json({ error: true, message: "un error .v" });
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
        client.connect(function (err) {
          console.log("Connected to MognoDB server =>");
          const dbo = client.db(dbName);
          const collection = dbo.collection(coleccion);
          collection.deleteOne(
            { idProveedor: req.body.idProveedor },
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
  if (req.method == "GET") {
    client.connect(function (err) {
      console.log("Connected to MognoDB server =>");
      const dbo = client.db(dbName);

      getData2(dbo, function (err, data) {
        if (err) {
          res.status(500).json({ error: true, message: "un error .v" });
          return;
        }
        res.status(200).json({ data });
        client.close;
      });
    });
  }
};
