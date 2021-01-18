import { MongoClient } from "mongodb";
require("dotenv").config();

const jwtsecret = process.env.SECRET_KEY;

const saltRounds = 10;
const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const coleccion = "ServicioEscogido";
const keyId = "IdServicioEscogido";

export default async (req, res) => {
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  switch (req.method) {
    case "POST":
      /* 
        - ServicioEscogido -------- Data
        - IdServicioEscogido ------ Id
    */
      await client.connect();
      try {
        console.log("Connected to MognoDB server =>");
        const dbo = client.db(dbName);
        const collection = dbo.collection(coleccion);
        let dataActu = {
          $set: req.body.ServicioEscogido,
        };
        let query = {};
        query[keyId] = req.body.IdServicioEscogido;
        collection.updateOne(query, dataActu, (err, result) => {
          if (err) {
            res.status(500).json({ error: true, message: "un error .v" });
            client.close();
            return;
          }
          console.log("Actualizacion satifactoria");
          res.status(200).json({
            message: "Todo bien, todo correcto, Actualizacion satifactoria",
          });
        });
      } catch (error) {
        // res.redirect("/500");
        res.status(500).json({ error: "Algun error" });
      } finally {
        client.close();
      }

      break;
    default:
      res.status(500).json({
        message: "Error - Creo q no enviaste o enviaste mal el method",
      });
      break;
  }
};
