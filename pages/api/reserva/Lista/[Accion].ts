import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { dbColeccionesFormato } from "@/utils/interfaces/db";
import { Collection, Db, MongoError } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const {
    query: { Accion }
  } = req;
  switch (req.method) {
    case "GET":
      switch (Accion) {
        case "ListaCotizacion":
          await listaCotizacion(req, res);
          break;
        case "ListaReserva":
          await listaReserva(req, res);
          break;
        default:
          console.log("Accion incorrecta - 101");
          res.status(500).json({
            error: "Ocurrio un error"
          });
          break;
      }
      break;
    case "POST":
      switch (Accion) {
        default:
          res.status(500).json({
            error: "Ocurrio un error"
          });
      }
      break;
    default:
      console.log("Accion incorrecta - 102");
      res.status(500).json({
        error: "Ocurrio un error"
      });
      break;
  }
};

const listaCotizacion = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  const coleccion: {
    prefijo: string;
    coleccion: string;
    keyId: string;
  } = dbColeccionesFormato.ReservaCotizacion;
  try {
    await connectToDatabase().then(async (connectedObject) => {
      const db: Db = connectedObject.db;
      const collection: Collection<any> = db.collection(coleccion.coleccion);
      const result = await collection
        .find(
          {
            $or: [
              {
                Estado: 0
              },
              {
                Estado: null
              },
              {
                Estado: undefined
              }
            ]
          },
          {
            projection: {
              _id: 0,
              IdReservaCotizacion: 1,
              NombreGrupo: 1,
              CodGrupo: 1,
              FechaIN: 1
            }
          }
        )
        .toArray();
      res.status(200).json({
        AllCotizacion: result
      });
    });
  } catch (error) {
    console.log("Error - 103");
    console.log(error);
    res.status(500).json({
      error: "Ocurrio un error"
    });
  }
};

const listaReserva = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const coleccion: {
    prefijo: string;
    coleccion: string;
    keyId: string;
  } = dbColeccionesFormato.ReservaCotizacion;
  try {
    await connectToDatabase().then(async (connectedObject) => {
      const inactivos: string | Array<string> = req.query.inactivos as
        | string
        | Array<string>;
      const db: Db = connectedObject.db;
      const collection: Collection<any> = db.collection(coleccion.coleccion);
      const filtro = {
        $or: [
          {
            Estado: 1
          },
          {
            Estado: 2
          },
          {
            Estado: 3
          },
          {
            Estado: 4
          }
        ]
      };
      if (inactivos == "true") {
        console.log("Inactivos");
        filtro.$or.push({
          Estado: 5
        });
        filtro.$or.push({
          Estado: 12
        });
      }
      collection
        .find(filtro, {
          projection: {
            _id: 0,
            IdReservaCotizacion: 1,
            NombreGrupo: 1,
            CodGrupo: 1,
            FechaIN: 1
          }
        })
        .toArray((err: MongoError, result: any[]) => {
          if (err) {
            throw err;
          }
          res.status(200).json({
            AllCotizacion: result
          });
        });
    });
  } catch (err) {
    console.log("Error - 104");
    console.log(err);
    res.status(500).json({
      error: "Ocurrio un error"
    });
  }
};
