import { connectToDatabase } from "@/utils/API/connectMongo-v2";
const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  const {
    query: { accion, IdProgramaTuristico },
  } = req;
  switch (req.method) {
    case "GET":
      switch (accion) {
        // --------------------Cambio dolar---------------------
        case "ObtenerTodosPT":
          func_ObtenerTodosPT(req, res);
          break;
        case "ObtenerUnPT":
          func_ObtenerUnPT(req, res);
          break;
        //------------------------------------------------------
        default:
          res.status(500).json({ message: "Faltan accion" });
          break;
      }
      break;
    case "POST":
      switch (accion) {
        // --------------------Cambio dolar---------------------
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


const func_ObtenerTodosPT = async (req, res) => {
  try {
    await connectToDatabase().then(async connectedObject => {
      let dbo = connectedObject.db;
      let collection = dbo.collection("ProgramaTuristico");
      // collection.findOne(idServicio)
      collection
        .find(
          {},
          {
            projection: {
              _id: 0,
              IdProgramaTuristico: 1,
              NombrePrograma: 1,
              CodigoPrograma: 1,
              Localizacion: 1,
              Descripcion: 1,
              DuracionDias: 1,
              DuracionNoche: 1,
              PrecioEstandar: 1
            },
          }
        )
        .toArray((err, result) => {
          if (err) {
            throw err;
          }
          res.status(200).json({ AllProgramasTuristicos: result });
        });
    });
  } catch (error) {
    console.log(error);
  }
};
const func_ObtenerUnPT = async (req, res) => {
  const {
    query: { accion, IdProgramaTuristico },
  } = req;
  try {
    await connectToDatabase().then(async connectedObject => {
      let dbo = connectedObject.db;
      let collection = dbo.collection("ProgramaTuristico");
      // collection.findOne(idServicio)
      let query = {};
      query["IdProgramaTuristico"] = IdProgramaTuristico;
      let result = await collection.findOne(query);
      res.status(200).json({ result });
    });
  } catch (error) {
    res.status(500);
    console.log(error);
  }
};