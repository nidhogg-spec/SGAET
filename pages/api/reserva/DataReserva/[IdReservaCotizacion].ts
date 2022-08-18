import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { dbColeccionesFormato } from "@/utils/interfaces/db";
import { Collection, Db } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";


export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const {
        query : { IdReservaCotizacion }
    } = req;
    await principal(req, res);
}

const principal = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const { query: { IdReservaCotizacion } } = req;
    let clienteProspecto = {};
    let reservaCotizacion : any = {};
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ReservaCotizacion;
    await connectToDatabase().then(async connectedObject => {
        try {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion.coleccion);
            const result = await collection.findOne(
                {
                    [coleccion.keyId]: IdReservaCotizacion
                },
                {
                    projection: { _id: 0 }
                }
            );
            if (result) {
                reservaCotizacion = result;
            } else {
                console.log("Error - 101");
                res.status(500).json({
                    error: "Ocurrio un error"
                });
                return;
            } 
        } catch (err) {
            console.log("Error - 102");
            console.log(`Error - Obtener cambios dolar => ${err}` );
            res.status(500).json({
                error: "Ocurrio un error"
            });
            return;
        }

        try {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion.coleccion);
            const result = await collection.findOne(
                {
                    IdClienteProspecto: reservaCotizacion["IdClienteProspecto"]
                }, 
                {
                    projection: { _id: 0 }
                }
            );
            if (result) {
                clienteProspecto = result;

            } else {
                console.log("Error - 103 - No hay cotizane");
                res.status(200).json({
                    reservaCotizacion,
                    clienteProspecto: {}
                });
                return;
            }
        }  catch (err) {
            console.log("Error - 104");
            console.log(`Error - Obtener cambios dolar => ${err}`);
            res.status(500).json({
                error: "Algun error"
            });
            return;
        }
        console.log("Realizado");
        res.status(200).json({
            reservaCotizacion,
            clienteProspecto
        });
    });
}