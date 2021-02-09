import { MongoClient } from "mongodb";
require("dotenv").config();
import { db_connect } from "../../../src/db";

// const url= process.env.MONGODB_URI
// const dbName= process.env.MONGODB_DB

let coleccion = "ProductoTransFerroviario";
let keyId = "IdProductoTransFerroviario";
let IdLetras = "PF";

export default async (req, res) => {
  const {
    query: { TipoProveedor },
  } = req; 
  switch (TipoProveedor) {
    case "hotel":
      coleccion = "ProductoHoteles";
      keyId = "IdProductoHotel";
      IdLetras = "PH";
      break;
    case "restaurante":
      coleccion = "ProductoRestaurantes";
      keyId = "IdProductoRestaurante";
      IdLetras = "PR";
      break;
    case "transporteterrestre":
      coleccion = "ProductoTransportes";
      keyId = "IdProductoTransporte";
      IdLetras = "PT";
      break;
    case "guia":
      coleccion = "ProductoGuias";
      keyId = "IdProductoGuia";
      IdLetras = "PG";
      break;
    case "agencia":
      coleccion = "ProductoAgencias";
      keyId = "IdProductoAgencia";
      IdLetras = "PA";
      break;
    case "transporteferroviario":
      coleccion = "ProductoTransFerroviario";
      keyId = "IdProductoTransFerroviario";
      IdLetras = "PF";
      break;
    case "sitioturistico":
      coleccion = "ProductoSitioTuristico";
      keyId = "IdProductoSitioTuristico";
      IdLetras = "PS";
      break;
    case "otro":
      coleccion = "ProductoOtros";
      keyId = "IdProductoOtro";
      IdLetras = "PO";
      break;
  }

  if (req.method == "POST") {
    switch (req.body.accion) {
      case "create":
        Crear(req, res);
        break;
      case "update":
        Actualizar(req, res);
        break;
      case "delete":
        Eliminar(req, res);
        break;
      default:
        res.status(500).json({
          message: "Error - Creo q no enviaste o enviaste mal la accion",
        });
        break;
    }
  }
  if (req.method == "GET") {
    Mostrar(req, res);
  }
};
async function Crear(req, res) {
  const [client, collection] = await db_connect(coleccion);
  let IdNumero = 1;
  try {
    const options = { sort: {} };
    options.sort[keyId] = -1;

    const result = await collection.findOne({}, options);
    console.log(result);
    if (result) {
      IdNumero = parseInt(result[keyId].slice(2), 10);
      IdNumero++;
      // console.log(IdNumero);
    }
    req.body.data[keyId] =
      IdLetras +
      ("00000" + IdNumero.toString()).slice(IdNumero.toString().length);
    // console.log(req.body.data[keyId]);
  } catch (error) {
    console.log("error - " + error);
    return;
  }
  //Enviando Datos
  try {
    let result = await collection.insertOne(req.body.data);
    if (result.insertedCount == 1) {
      console.log("Creacion realizada");
      res.status(200).send("Creacion realizada");
    } else {
      console.log(result.insertedCount);
      console.log("Hubo un error");
    }
  } catch (error) {
    console.log("error - " + error);
    return;
  }

  client.close();
}

async function Eliminar(req, res) {
  const [client, collection] = await db_connect(coleccion);
  let result = await collection.deleteOne({
    [keyId]: req.body.idProducto,
  });
  console.log(result.deletedCount);
  console.log(keyId);
  if (result.deletedCount == 1) {
    res.status(200).send("Todo bien, todo correcto, Deleteacion satifactoria ");
  } else {
    console.log("No se elimino correctamente");
  }
  client.close();
}

async function Actualizar(req, res) {
  const [client, collection] = await db_connect(coleccion);
  let dataActu = {
    $set: req.body.data,
  };
  console.log(dataActu);
  let result;
  try {
    result = await collection.updateOne(
      { [keyId]: req.body.idProducto },
      dataActu
    );
  } catch (error) {
    console.log(error);
    return;
  }

  console.log("Actualizacion satifactoria");
  console.log(
    `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
  );
  res.status(200).send("Todo bien, todo correcto, Actualizacion satifactoria");
  client.close();
}

async function Mostrar(req, res) {
  const [client, collection] = await db_connect(coleccion);
  console.log(collection);
  let result = await collection.find({}).toArray();
  console.log(result);
  // res.status(500).json({ error: true, message: "un error .v" + err });
  res.status(200).send("Todo bien, todo correcto, Actualizacion satifactoria");
  client.close();
}
