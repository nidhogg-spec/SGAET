import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { dbColeccionesFormato } from "@/utils/interfaces/db";
import { Collection, Db } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const { query: { Accion }, method} = req;
    switch (method) {
        case "GET":
            await listarReserva(req, res);
            break;
    }
}

const listarReserva = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ReservaCotizacion;
    await connectToDatabase().then(async (connectedObject) => {
        try {

            const inactivos : string | Array<string> = req.query.inactivos as | string | Array<string>; 
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion.coleccion);
            const filtro = {
                $or: [
                    { Estado: 1 },
                    { Estado: 2 },
                    { Estado: 3 },
                    { Estado: 4 },
                ]
            };
            if (inactivos === "true") {
                console.log("inactivos");
                filtro.$or.push({
                    Estado: 5
                });
                filtro.$or.push({
                    Estado: 12
                });
            }
            const result = await collection.find(filtro, {
                projection: {
                    _id: 0,
                    IdReservaCotizacion: 1,
                    NombreGrupo: 1,
                    CodGrupo: 1,
                    FechaIN: 1,
                    NpasajerosAdult: 1,
                    NombrePrograma: 1,
                    Tipo: 1,
                    Localizacion: 1,
                    Estado: 1,
                    ServicioProducto: 1,
                    IdClienteProspecto: 1,
                    listaPasajeros: 1
                }
            }).toArray();
            res.status(200).json({
                Cotizaciones: result 
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "Ocurrio un error"
            });
        }
    });
}