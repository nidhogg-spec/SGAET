import { CRUD_log } from "@/src/FuncionalidadInterna/Log/CRUD";
import { connectToDatabase } from "@/utils/API/connectMongo-v2";


const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  const {
    query: { accion, IdProgramaTuristico },
  } = req;
  switch (req.method) {
    case "GET":
      res.status(500);
      break;
    case "POST":
      func_Crear(req, res);
      break;
    case "PUT":
      func_Actualizar(req, res);
      break;
    case "DELETE":
      func_Eliminar(req, res);
      break;
    default:
      res.status(404);
      break;
  }
};

const func_Crear = async (req, res) => {
  // ---------------- Informacion importante inicial -----------
  let ProgramaTuristico = req.body.ProgramaTuristico;
  let coleccion = "ProgramaTuristico";
  let Prefijo = "OS";
  let keyId = "Id" + coleccion;
  //-------------------- Proceso ------------------------------
  let IdNumero = 1;
  await connectToDatabase().then(async connectedObject => {
    let dbo = connectedObject.db;
    let collection = dbo.collection(coleccion);
    try {
      const options = { sort: {} };
      options.sort[keyId] = -1;
      const result = await collection.findOne({}, options);
      if (result != null) {
        if (result[keyId] != null && result[keyId] != undefined) {
          IdNumero = parseInt(
            result[keyId].slice(Prefijo.length),
            Prefijo.length + 8
          );
          IdNumero++;
        }
      }
      ProgramaTuristico[keyId] =
        Prefijo +
        ("00000" + IdNumero.toString()).slice(IdNumero.toString().length);
    } catch (error) {
      console.log("error al Devolver ID - " + error);
      res.status(500);
      return;
    }
    try {
      let result = await collection.insertOne(ProgramaTuristico);
      console.log("Insercion realizada");
      CRUD_log(req, { Action: 'Create', Message: `Programa ${ProgramaTuristico[keyId]} creado` })
      res.status(200).send("Insercion realizada");
    } catch (error) {
      res.status(500);
      console.log(error);
    }
  });
};

const func_Eliminar = async (req, res) => {
  // ---------------- Informacion importante inicial -----------
  let IdProgramaTuristico = req.body.IdProgramaTuristico;
  let dataEliminar = req.body.DataEliminar;
  let coleccion = "ProgramaTuristico";
  let keyId = "Id" + coleccion;
  //-------------------- Proceso ------------------------------
  await connectToDatabase().then(async connectedObject => {
    try {
      let dbo = connectedObject.db;
      let collection = dbo.collection(coleccion);
      await collection.deleteOne({ [keyId]: IdProgramaTuristico });
      console.log("Eliminacion realizada");
      res.status(200).send("Eliminacion realizada");
    } catch (error) {
      res.status(500);
      console.log(error);
    }
  });
};

const func_Actualizar = async (req, res) => {
  // ---------------- Informacion importante inicial -----------
  let ProgramaTuristico = req.body.ProgramaTuristico;
  let IdProgramaTuristico = req.body.IdProgramaTuristico;
  let coleccion = "ProgramaTuristico";
  let keyId = "Id" + coleccion;
  //-------------------- Proceso ------------------------------
  await connectToDatabase().then(async connectedObject => {
    let dbo = connectedObject.db;
    let collection = dbo.collection(coleccion);

    try {
      let query = { $set: ProgramaTuristico };
      await collection.updateOne({ [keyId]: IdProgramaTuristico }, query);
      console.log("Actualizacion realizada");
      res.status(200).send("Actualizacion realizada");
    } catch (error) {
      res.status(500);
      console.log(error);
    }
  });
};
