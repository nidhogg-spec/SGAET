import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { generarIdElementoNuevo } from "@/utils/API/generarId";
import { NextApiRequest, NextApiResponse } from "next";

import { ordenServicioInterface,dbColeccionesFormato } from "@/utils/interfaces/db";

export default async (req:NextApiRequest, res:NextApiResponse) => {
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

const func_Crear = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  // ---------------- Informacion importante inicial -----------
  let coleccion = dbColeccionesFormato.OrdenServicio;
  let OrdenServicio:ordenServicioInterface = {
    IdOrdenServicio: await generarIdElementoNuevo(coleccion.coleccion, coleccion.prefijo),
    CodigoOrdenServicio: "",
    Estado:"",
    IdServicioEscogido:"",
    TipoOrden:"",
    Proveedor:{
        Direccion:"",
        IdProveedor:"",
        Email:"",
        NombreProveedor:"",
        NroDocumento:"",
        Telefono:"",
        TipoDocumento:"",
    }
  }
  //-------------------- Validacion ------------------------------
    if (req.body.IdServicioEscogido === undefined) {
        res.status(304).send("No se ha ingresado el IdServicioEscogido");
        console.log("IdServicioEscogido no definido");
        return;
    }
    if (req.body.TipoOrdenServicio === undefined) {
        res.status(304).send("No se ha ingresado el IdServicioEscogido");
        console.log("IdServicioEscogido no definido");
        return;
    }
  //-------------------- Proceso ------------------------------
  await connectToDatabase().then(async connectedObject => {
    
  });
};

const func_Eliminar = async (req: NextApiRequest, res: NextApiResponse<any>) => {
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

const func_Actualizar = async (req: NextApiRequest, res: NextApiResponse<any>) => {
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
