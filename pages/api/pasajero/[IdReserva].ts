import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { pasajeroInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { generarIdNuevo } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";
import IdReservaCotizacion from "../reserva/DataReserva/[IdReservaCotizacion]";

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  switch (req.method) {
    case "GET":
      await obtenerPasajero(req, res);
      break;
    case "POST":
      await crearPasajero(req, res);
      break;
    case "PUT":
      await actualizarPasajero(req, res);
      break;
    case "DELETE":
      await eliminarPasajero(req, res);
      break;
    default:
      res.status(404);
      break;
  }
};

const obtenerPasajero = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  const coleccion: {
    prefijo: string;
    coleccion: string;
    keyId: string;
  } = dbColeccionesFormato.Pasajero;
  await connectToDatabase().then(async (connectedObject) => {
    const db: Db = connectedObject.db;
    const collection: Collection<any> = db.collection(coleccion.coleccion);
    try {
      const result = await collection
        .find({
          IdReservaCotizacion: IdReservaCotizacion
        })
        .toArray();
      res.status(200).json({
        data: result
      });
    } catch (err) {
      res.status(500);
      console.log(err);
    }
  });
};

const crearPasajero = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  const coleccion: {
    prefijo: string;
    coleccion: string;
    keyId: string;
  } = dbColeccionesFormato.Pasajero;
  const { coleccion: coleccionNombre, keyId } = coleccion;
  const pasajero: pasajeroInterface[] = req.body.Pasajero;
  const IdReservaCotizacion: string = (req.query.IdReserva as string) || "";
  let nuevoPasajeros: pasajeroInterface[] = [];
  const LastId = await generarIdNuevo(coleccion);
  const numId = parseInt(LastId.substring(2));

  for (let index = 0; index < pasajero.length; index++) {
    nuevoPasajeros.push({
      ...pasajero[index],
      [keyId]:
        LastId.slice(0, 0 - (numId + index).toString().length) +
        (numId + index),
      IdReservaCotizacion: IdReservaCotizacion
    });
  }

  await connectToDatabase().then(async (connectedObject) => {
    const db: Db = connectedObject.db;
    const collection: Collection<any> = db.collection(coleccionNombre);
    try {
      const result = await collection.insertMany(nuevoPasajeros);
      res.status(200).json({
        data: result.ops
      });
    } catch (err) {
      res.status(500).json({
        error: true,
        message: "Error al insertar"
      });
      res.status(500);
      console.log(err);
    }
  });
};

const actualizarPasajero = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  const coleccion: {
    prefijo: string;
    coleccion: string;
    keyId: string;
  } = dbColeccionesFormato.Pasajero;
  const { coleccion: coleccionNombre, keyId } = coleccion;
  const pasajero: pasajeroInterface[] = req.body.Pasajero;
  const IdReservaCotizacion: string = (req.query.IdReserva as string) || "";
  let nuevoPasajeros: pasajeroInterface[] = [];

  await connectToDatabase().then(async (connectedObject) => {
    const db: Db = connectedObject.db;
    const collection: Collection<any> = db.collection(coleccion.coleccion);
    // Eliminar todos los pasajeros de la reserva
    try {
      await collection.deleteMany({
        IdReservaCotizacion: IdReservaCotizacion
      });
    } catch (err) {
      res.status(500);
      console.log(err);
      return;
    }
    // Generar nuevos pasajeros
    const LastId = await generarIdNuevo(coleccion);
    const numId = parseInt(LastId.substring(2));
    for (let index = 0; index < pasajero.length; index++) {
      nuevoPasajeros.push({
        ...pasajero[index],
        [keyId]:
          LastId.slice(0, 0 - (numId + index).toString().length) +
          (numId + index),
        IdReservaCotizacion: IdReservaCotizacion
      });
    }
    // Insertar los nuevos pasajeros
    try {
      const result = await collection.insertMany(nuevoPasajeros);
      res.status(200).json({
        data: result.ops
      });
    } catch (err) {
      res.status(500).json({
        error: true,
        message: "Error al insertar"
      });
      res.status(500);
      console.log(err);
    }
  });
};

const eliminarPasajero = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  const coleccion: {
    prefijo: string;
    coleccion: string;
    keyId: string;
  } = dbColeccionesFormato.Pasajero;
  const IdReservaCotizacion: string = (req.query.IdReserva as string) || "";
  await connectToDatabase().then(async (connectedObject) => {
    const db: Db = connectedObject.db;
    const collection: Collection<any> = db.collection(coleccion.coleccion);
    try {
      await collection.deleteMany({
        IdReservaCotizacion: IdReservaCotizacion
      });
      console.log("Eliminacion correcta");
      res.status(200).send("Eliminacion realizada");
    } catch (err) {
      res.status(500);
      console.log(err);
    }
  });
};
