import { MongoClient } from "mongodb";

require("dotenv").config();

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
  let ServicioEscogido = req.body.ServicioEscogido;
  let coleccion = "ServicioEscogido";
  let Prefijo = "SE";
  let keyId = "Id" + coleccion;
  //-------------------- Proceso ------------------------------
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let IdNumero = 1;
  await client.connect();
  try {
    let collection = client.db(dbName).collection(coleccion);
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
    client.close();
    return;
  }
  try {
    let dbo = client.db(dbName);
    let collection = dbo.collection(coleccion);
    await collection.insertOne(ServicioEscogido, function (err, res) {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log("Insercion realizada");
      res.status(200).send("Insercion realizada");
    });
  } catch (error) {
    res.status(500);
    console.log(error);
  } finally {
    client.close();
  }
};

const func_Eliminar = async (req, res) => {
  // ---------------- Informacion importante inicial -----------
  let IdServicioEscogido = req.body.IdServicioEscogido;
  let coleccion = "ServicioEscogido";
  let keyId = "Id" + coleccion;
  //-------------------- Proceso ------------------------------
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  try {
    let dbo = client.db(dbName);
    let collection = dbo.collection(coleccion);
    await collection.deleteOne({ [keyId]: IdServicioEscogido });
    console.log("Eliminacion realizada");
    res.status(200).send("Eliminacion realizada");
  } catch (error) {
    res.status(500);
    console.log(error);
  } finally {
    client.close();
  }
};

const func_Actualizar = async (req, res) => {
  // ---------------- Informacion importante inicial -----------
  let ServicioEscogido = req.body.ServicioEscogido;
  let IdServicioEscogido = req.body.IdServicioEscogido;
  let coleccion = "ServicioEscogido";
  let keyId = "Id" + coleccion;
  //-------------------- Proceso ------------------------------
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  try {
    let dbo = client.db(dbName);
    let collection = dbo.collection(coleccion);
    let query = { $set: ServicioEscogido };
    await collection.updateOne({[keyId]:IdServicioEscogido},query);
    console.log("Actualizacion realizada");
    res.status(200).send("Actualizacion realizada");
  } catch (error) {
    res.status(500);
    console.log(error);
  } finally {
    client.close();
  }
};