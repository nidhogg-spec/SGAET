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
  let OrdenServicio = req.body.OrdenServicio;
  let coleccion = "OrdenServicio";
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
      if (result) {
        if (result[keyId] != null && result[keyId] != undefined) {
          IdNumero = parseInt(
            result[keyId].slice(Prefijo.length),
            Prefijo.length + 8
          );
          IdNumero++;
        }
      }
      OrdenServicio[keyId] =
        Prefijo +
        ("00000" + IdNumero.toString()).slice(IdNumero.toString().length);
    } catch (error) {
      console.log("error al Devolver ID - " + error);
      res.status(500);
      return;
    }
    try {
      let result = await collection.insertOne(OrdenServicio);
      console.log("Insercion realizada");
      res.status(200).send("Insercion realizada");
    } catch (error) {
      res.status(500);
      console.log(error);
    }
  });
};

const func_Eliminar = async (req, res) => {
  // ---------------- Informacion importante inicial -----------
  let IdOrdenServicio = req.body.IdOrdenServicio;
  let dataEliminar = req.body.DataEliminar;
  let coleccion = "OrdenServicio";
  let keyId = "Id" + coleccion;
  //-------------------- Proceso ------------------------------
  await connectToDatabase().then(async connectedObject => {
    try {
      let dbo = connectedObject.db;
      let collection = dbo.collection(coleccion);
      await collection.deleteOne({ [keyId]: IdOrdenServicio });
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
  let OrdenServicio = req.body.OrdenServicio;
  let IdOrdenServicio = req.body.IdOrdenServicio;
  let coleccion = "OrdenServicio";
  let keyId = "Id" + coleccion;
  //-------------------- Proceso ------------------------------
  await connectToDatabase().then(async connectedObject => {
    let dbo = connectedObject.db;
    let collection = dbo.collection(coleccion);
    try {
      let query = { $set: OrdenServicio };
      await collection.updateOne({ [keyId]: IdOrdenServicio }, query);
      console.log("Actualizacion realizada");
      res.status(200).send("Actualizacion realizada");
    } catch (error) {
      res.status(500);
      console.log(error);
    }
  });
};
