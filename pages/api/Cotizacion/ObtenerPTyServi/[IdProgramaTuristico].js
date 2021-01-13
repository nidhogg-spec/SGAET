import { MongoClient } from "mongodb";
require("dotenv").config();

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  const {
    query: {IdProgramaTuristico},
  } = req;
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect(async (error) => {
      // assert.equal(err, null); // Preguntar
      let dbo = client.db(dbName);
      let collection = dbo.collection("ProgramaTuristico");
      // collection.findOne(idServicio)
      let result = await collection.findOne({ IdProgramaTuristico: IdProgramaTuristico });
      let Servicios =  result.value['ServicioProducto'];
      delete result.value['ServicioProducto'];
      if (result){
        res.status(200).json({ DataProgramaTuristico: result.value, Servicios:Servicios});
      }else{
        console.log('No hubo ningun resultado')
        res.status(500).send('No hubo ningun resultado')
      }
    });
  } catch (error) {
    console.log("error - Obtener cambios dolar => " + error);
  } finally {
    client.close();
  }
};