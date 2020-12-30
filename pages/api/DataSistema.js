import { MongoClient } from "mongodb";
require("dotenv").config();

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      switch (req.body.accion) {
        // --------------------Cambio dolar---------------------
        case "ObtenerCambioDolar":
          func_ObtenerCambioDolar(req, res);
          break;
        case "CambiarCambioDolar":
          func_CambiarCambioDolar(req, res);
          break;
        //------------------------------------------------------
        default:
          res.status(500).json({ message: "Faltan accion" });
          break;
      }
      break;

    default:
      res.status(404);
      break;
  }
};



// Funciones
const func_ObtenerCambioDolar = async (req, res) => {
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect(async (error) => {
      // assert.equal(err, null); // Preguntar
      let dbo = client.db(dbName);
      let collection = dbo.collection("DataSistema");
      // collection.findOne(idServicio)
      let result = await collection.findOne({ TipoDato: "CambioDolar" });
      if (result) {
        res.status(200).json({ value: result.value });
      } else {
        collection.insertOne({
          TipoDato: "CambioDolar",
          value: 3.5,
        });
        res.status(200).json({ value: 3.5 });
      }
    });
  } catch (error) {
    console.log("error - Obtener cambios dolar => " + error);
  } finally {
    client.close();
  }
};

const func_CambiarCambioDolar = async (req, res) => {
    let client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect(async (error) => {
        // assert.equal(err, null); // Preguntar
        let dbo = client.db(dbName);
        let collection = dbo.collection("DataSistema");
        // collection.findOne(idServicio)
        let result = await collection.updateOne({TipoDato: "CambioDolar" },{$set:{value:req.body.value}});
        
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(500).send('error con la seteaccion de datos')
        }
      });
    } catch (error) {
      console.log("error - Cambiar cambiodolar => " + error);
    } finally {
      client.close();
    }
  };
