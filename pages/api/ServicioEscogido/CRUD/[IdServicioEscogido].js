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
      func_Obtener(req,res)
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
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  try {
    let dbo = client.db(dbName);
    let collection = dbo.collection(coleccion);
    let data = await collection.find({}).project({"_id":0}).toArray()
    res.status(200).send(data);
  } catch (error) {
    res.status(500);
    console.log(error);
  } finally {
    client.close();
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
  let collection = client.db(dbName).collection(coleccion);
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
    client.close();
    return;
  }
  try {
    let result = await collection.insertOne(ServicioEscogido);
    res.status(200).send(result);
    console.log('Insercion realizada');
  } catch (error) {
    res.status(500);
    console.log(error);
  } finally {
    client.close();
  }
};

const func_Eliminar = async (req, res) => {
  // ---------------- Informacion importante inicial -----------
  let {IdServicioEscogido} = req.query
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
    console.log(IdServicioEscogido);
    let result = await collection.deleteOne({ [keyId]: IdServicioEscogido });
    console.log("Eliminacion realizada");
    res.status(200).send(result);
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
  let {IdServicioEscogido} = req.query
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
    console.log(ServicioEscogido)
    let result = await collection.updateOne({[keyId]:IdServicioEscogido},query);
    console.log("Actualizacion realizada");
    res.status(200).send(result);
  } catch (error) {
    res.status(500);
    console.log(error);
  } finally {
    client.close();
  }
};
