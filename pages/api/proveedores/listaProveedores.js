import { MongoClient } from "mongodb";
require("dotenv").config();

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
      case "Create":
        //Para CREATE el body debe de tener:
        //  data
        //  accion
        //  tipoProveedor
        let IdLetras = "";
        let IdNumero = 1;
        let tipoProveedor=req.body.data["tipo"]
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
            { tipo: tipoProveedor },
            options
          );
          if (result) {
            IdLetras = result.idProveedor.substring(0,2);
            IdNumero = parseInt(result.idProveedor.slice(2),10)
            IdNumero++;
            req.body.data["idProveedor"]=IdLetras+(("00000"+IdNumero.toString()).slice(IdNumero.toString().length))
          } else {
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
              // client.close();
            }
          );
        });
        break;
        case "updateMany":
          client.connect(function (err) {
            console.log("Connected to MognoDB server =>");
            const dbo = client.db(dbName);
            const collection = dbo.collection(coleccion);
            let dataActu = {
              $set: req.body.data,
            };
            // let idActu = {
            //   idProveedor: req.body.idProveedor
            // }
            // collection.bulkWrite([
            //   {updateMany:{
            //     "filter": idActu,
            //     "update": dataActu
            //   }}
            // ])
            // for (let index = 0; index < array.length; index++) {
            //   const element = array[index];
              
            // }
            // let result = collection.find({}).project({
            //   "_id":0,
            //   "tipo":0,
            //   "TipoDocumento":0,
            //   "NroDocumento":0,
            //   "TipoMoneda":0,
            //   "EnlaceDocumento":0,
            //   "GerenteGeneral":0,
            //   "NEstrellas":0,
            //   "Web":0,
            //   "Estado":0,
            //   "RazonSocial":0,
            //   "celular":0,
            //   "celular2":0,
            //   "email":0,
            //   "email2":0,
            //   "DireccionFiscal":0,
            //   "DatosBancarios":0,
            //   "Destino":0,
            //   "Email":0,
            //   "NumContac":0,
            //   "Encuesta":0
            // }).toArray()
            for (let index = 0; index < req.body.data.length; index++) {
              // if(result[index].idProveedor == req.body.data[index].idProveedor){
                collection.updateOne(
                  {idProveedor: req.body.data[index].idProveedor},
                  {
                    $set: 
                    {
                      porcentajeTotal : req.body.data[index].porcentajeTotal,
                      periodo: req.body.data[index].periodoActual
                    }
                  },
                  (err, result) => {
                    if (err) {
                      res.status(500).json({ error: true, message: console.error(err)});
                      client.close();
                      return;
                    }
                    console.log("Actualizacion satifactoria");
                    res
                      .status(200)
                      .json({
                        message:
                          console.log(result)
                      });
                    res
                      .status(200)
                      .json({
                        message:
                          "Todo bien, todo correcto, Actualizacion satifactoria",
                      });
                  }
                );
              // }              
            }
            // client.close();
            // collection.updateMany(
            //   { idProveedor: { $in:req.body.idProveedor }},
            //   dataActu,
            //   // dataActu,
            //   (err, result) => {
            //     if (err) {
            //       res.status(500).json({ error: true, message: console.error(err)});
            //       client.close();
            //       return;
            //     }
            //     console.log("Actualizacion satifactoria");
            //     res
            //       .status(200)
            //       .json({
            //         message:
            //           console.log(result)
            //       });
            //     res
            //       .status(200)
            //       .json({
            //         message:
            //           "Todo bien, todo correcto, Actualizacion satifactoria",
            //       });
            //     client.close();
            //   }
            // );
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
};

