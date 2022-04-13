import { connectToDatabase } from "@/utils/API/connectMongo-v2";

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  const {
    query: { accion, IdProgramaTuristico },
  } = req;
  switch (req.method) {
    case "GET":
      func_Obtener(req, res)
      // res.status(500);
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
const func_Obtener = async (req, res) => {
  // ---------------- Informacion importante inicial -----------
  let coleccion = "ServicioEscogido";
  //-------------------- Proceso ------------------------------
  await connectToDatabase().then(async connectedObject => {
    try {
      let collection = connectedObject.db.collection(coleccion);
      let data = await collection.find({}).project({ "_id": 0 }).toArray()
      res.status(200).send(data);
    } catch (error) {
      res.status(500);
      console.log(error);
    }
  });
};

const func_Crear = async (req, res) => {
  // ---------------- Informacion importante inicial -----------
  let ServicioEscogido = req.body.ServicioEscogido;
  let coleccion = "ServicioEscogido";
  let Prefijo = "SE";
  let keyId = "Id" + coleccion;
  //-------------------- Proceso ------------------------------
  let IdNumero = 1;
  await connectToDatabase().then(async connectedObject => {
    let collection = connectedObject.db.collection(coleccion);
    try {
      const options = { sort: {} };
      options.sort[keyId] = -1;
      const result = await collection.findOne({}, options);
      if (result[keyId] != null && result[keyId] != undefined) {
        IdNumero = parseInt(
          result[keyId].slice(Prefijo.length),
          Prefijo.length + 8
        );
        IdNumero++;
      }
      ServicioEscogido[keyId] =
        Prefijo +
        ("00000" + IdNumero.toString()).slice(IdNumero.toString().length);
    } catch (error) {
      console.log("error al Devolver ID - " + error);
      res.status(500);
      return;
    }
    try {
      let result = await collection.insertOne(ServicioEscogido);
      res.status(200).send(result);
      console.log('Insercion realizada');
    } catch (error) {
      res.status(500);
      console.log(error);
    }
  });

};

const func_Eliminar = async (req, res) => {
  // ---------------- Informacion importante inicial -----------
  let { IdServicioEscogido } = req.query
  let coleccion = "ServicioEscogido";
  let keyId = "Id" + coleccion;
  //-------------------- Proceso ------------------------------
  await connectToDatabase().then(async connectedObject => {
    try {
      let collection = connectedObject.db.collection(coleccion);
      console.log(IdServicioEscogido);
      let result = await collection.deleteOne({ [keyId]: IdServicioEscogido });
      console.log("Eliminacion realizada");
      res.status(200).send(result);
    } catch (error) {
      res.status(500);
      console.log(error);
    }
  });
};

const func_Actualizar = async (req, res) => {
  // ---------------- Informacion importante inicial -----------
  let ServicioEscogido = req.body.ServicioEscogido;
  let { IdServicioEscogido } = req.query
  let coleccion = "ServicioEscogido";
  let keyId = "Id" + coleccion;
  //-------------------- Proceso ------------------------------
  await connectToDatabase().then(async connectedObject => {
    try {
      let collection = connectedObject.db.collection(coleccion);
      let query = { $set: ServicioEscogido };
      console.log(ServicioEscogido)
      let result = await collection.updateOne({ [keyId]: IdServicioEscogido }, query);
      console.log("Actualizacion realizada");
      res.status(200).send(result);
    } catch (error) {
      res.status(500);
      console.log(error);
    }
  });
};
