import { connectToDatabase } from "@/utils/API/connectMongo-v2";


const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  const {
    query: {IdProgramaTuristico},
  } = req;
  try {
    await connectToDatabase().then(async connectedObject=>{
      let dbo = connectedObject.db;
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
  }
};