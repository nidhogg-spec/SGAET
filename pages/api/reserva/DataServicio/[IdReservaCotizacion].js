import { MongoClient } from "mongodb";
require("dotenv").config();

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  const {
    query: { IdReservaCotizacion },
  } = req;
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect((error) => {
      let dbo = client.db(dbName);
      let collection = dbo.collection("ServicioEscogido");
      let query = { $or: [] };
      collection
        .find(
          { IdReservaCotizacion: IdReservaCotizacion },
          { projection: { _id: 0 } }
        )
        .toArray((err, result) => {
          if (err) {
            console.log("Error - 101");
            console.log(err);
            // res.redirect("/500");
            res.status(500).json({ error: "Algun error" });
          }
          res.status(200).json({ AllServicioEscogido: result });
        });
    });
  } catch (error) {
    console.log("Error - 102");
    console.log("error - Obtener cambios dolar => " + error);
    // res.redirect("/500");
    res.status(500).json({ error: "Algun error" });
  } finally {
    client.close();
  }
};
