import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import {
  pasajeroInterface,
  dbColeccionesFormato,
  reservaCotizacionInterface
} from "@/utils/interfaces/db";
import { generarIdNuevo } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";
import IdReservaCotizacion from "../reserva/DataReserva/[IdReservaCotizacion]";
import * as uuid  from "uuid";

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  switch (req.method) {
    case "GET":
      await obtenerPasajero(req, res);
      break;
    case "PUT":
      await actualizarPasajero(req, res);
      break;
    // case "DELETE":
    //   await eliminarPasajero(req, res);
    //   break;
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
  } = dbColeccionesFormato.ReservaCotizacion;
  const IdReservaCotizacion: string = req.query.IdReserva as string;

  await connectToDatabase().then(async (connectedObject) => {
    const db: Db = connectedObject.db;
    const collection: Collection<reservaCotizacionInterface> = db.collection(
      coleccion.coleccion
    );
    try {
      const result = await collection.findOne({
        IdReservaCotizacion: IdReservaCotizacion
      });
      if (result == null)
        res
          .status(400)
          .send(
            "Error - there is no reserva with the id ->" + IdReservaCotizacion
          );
      res.status(200).json({
        data: result?.ListaPasajeros
      });
    } catch (err) {
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
  } = dbColeccionesFormato.ReservaCotizacion;
  const { coleccion: coleccionNombre, keyId } = coleccion;
  const pasajero: pasajeroInterface[] = req.body.Pasajero;
  const IdReservaCotizacion: string = (req.query.IdReserva as string) || "";
  let nuevoPasajeros: pasajeroInterface[] = [];

  await connectToDatabase().then(async (connectedObject) => {
    const db: Db = connectedObject.db;
    const collection: Collection<reservaCotizacionInterface> = db.collection(
      coleccion.coleccion
    );
    // Generar nuevos pasajeros
    // const LastId = await generarIdNuevo(coleccion);
    // const numId = parseInt(LastId.substring(2));
    for (let index = 0; index < pasajero.length; index++) {
      nuevoPasajeros.push({
        ...pasajero[index],
        [keyId]: uuid.v1.toString(),
        IdReservaCotizacion: IdReservaCotizacion
      });
    }
    // Insertar los nuevos pasajeros
    try {
      const result = await collection.updateOne(
        {
          IdReservaCotizacion: IdReservaCotizacion
        },
        {
          $set: {
            ListaPasajeros: [...nuevoPasajeros]
          }
        }
      );
      res.status(200).json({
        data: result.result
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

// const eliminarPasajero = async (
//   req: NextApiRequest,
//   res: NextApiResponse<any>
// ) => {
//   const coleccion: {
//     prefijo: string;
//     coleccion: string;
//     keyId: string;
//   } = dbColeccionesFormato.Pasajero;
//   const IdReservaCotizacion: string = (req.query.IdReserva as string) || "";
//   await connectToDatabase().then(async (connectedObject) => {
//     const db: Db = connectedObject.db;
//     const collection: Collection<any> = db.collection(coleccion.coleccion);
//     try {
//       await collection.deleteMany({
//         IdReservaCotizacion: IdReservaCotizacion
//       });
//       console.log("Eliminacion correcta");
//       res.status(200).send("Eliminacion realizada");
//     } catch (err) {
//       res.status(500);
//       console.log(err);
//     }
//   });
// };
