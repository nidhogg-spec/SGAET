import { MongoClient } from "mongodb";
require("dotenv").config();

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let DatosClientesCoporativos = []
  try {
    await client.connect();
    const dbo = client.db(dbName);
    let collection = dbo.collection("ClienteProspecto");
    let resultClienteCorporativo = await collection
      .find({})
      .project({
        _id: 0,
      })
      .toArray();
    resultClienteCorporativo.map((x)=>{
        if (x.TipoCliente == "Corporativo") {
            DatosClientesCoporativos.push(x)
        }
    })
    res.status(200).json({ data: DatosClientesCoporativos });
    // res.end().json({data: DatosClientesCoporativos})
  } catch (error) {
    console.log("error - Obtener cambios dolar => " + error);
    res.status(500).send("No hubo ningun resultado");
  }
}
