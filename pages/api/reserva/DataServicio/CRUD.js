import { MongoClient } from "mongodb";
import { connectToDatabase } from "@/utils/API/connectMongo-v2";

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  const {
    query: { accion, IdServicioEscogido },
  } = req;
  switch (req.method) {
    case "GET":
      res.status(500);
      break;
    case "POST":
      func_Crear(req, res);
      break;
    case "PUT":
      if (req.body['Accion'] == 'UpdateMany') {
        func_ActualizarMuchos(req, res)
      } else {
        func_Actualizar(req, res);
      }
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
  let Prefijo = "OS";
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
    }
    try {
      let result = await collection.insertOne(ServicioEscogido);
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
  let IdServicioEscogido = req.body.IdServicioEscogido;
  let dataEliminar = req.body.DataEliminar;
  let coleccion = "ServicioEscogido";
  let keyId = "Id" + coleccion;
  //-------------------- Proceso ------------------------------
  await connectToDatabase().then(async connectedObject => {
    try {
      let collection = connectedObject.db.collection(coleccion);
      await collection.deleteOne({ [keyId]: IdServicioEscogido });
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
  let ServicioEscogido = req.body.ServicioEscogido;
  let IdServicioEscogido = req.body.IdServicioEscogido;
  let coleccion = "ServicioEscogido";
  let keyId = "Id" + coleccion;
  //-------------------- Proceso ------------------------------
  await connectToDatabase().then(async connectedObject => {
    let collection = connectedObject.db.collection(coleccion);
    try {
      let query = { $set: ServicioEscogido };
      await collection.updateOne({ [keyId]: IdServicioEscogido }, query);
      console.log("Actualizacion realizada");
      res.status(200).send("Actualizacion realizada");
    } catch (error) {
      res.status(500);
      console.log(error);
    }
  });
};

const func_ActualizarMuchos = async (req, res) => {
  // ---------------- Informacion importante inicial -----------
  let ServicioEscogido = [...req.body.ServicioEscogido];
  let coleccion = "ServicioEscogido";
  let keyId = "Id" + coleccion;
  let Prefijo = "OS";
  //-------------------- Proceso ------------------------------
  await connectToDatabase().then(async connectedObject => {
    let collection = connectedObject.db.collection(coleccion);
    let query;
    try {
      await Promise.all(ServicioEscogido.map(async (Servi) => {
        query = { $set: Servi };
        if (Servi[keyId]) {
          try {
            await collection.updateOne({ [keyId]: Servi[keyId] }, query);
            console.log("UpadateMany - Actualizacion realizada - " + Servi[keyId]);
          } catch (error) {
            console.log('Error 1 al ingresar - ' + Servi[keyId])
            console.log(error);
          }
        } else {
          let IdNumero = 1;
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
            Servi[keyId] = Prefijo + ("00000" + IdNumero.toString()).slice(IdNumero.toString().length);
          } catch (error) {
            console.log('Error 2 al ingresar - ' + Servi[keyId])
            console.log("error al Devolver ID - " + error);
          }
          try {
            await collection.insertOne(Servi);
            console.log("UpadateMany - Insercion realizada");
          } catch (error) {
            console.log('Error 3 al ingresar - ' + Servi[keyId])
            console.log(error);
          }
        }
      }))
      res.status(200).send('Todo salio bien')
    } catch (err) {
      res.status(500).send('Hubo algun error - ' + err)
    }
  });
};
