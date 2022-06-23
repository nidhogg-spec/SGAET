import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { dbColeccionesFormato } from "@/utils/interfaces/db";
import { Collection, Db, MongoCallback, MongoError } from "mongodb";

export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    await principal(req, res);
}

const principal = async ( req : NextApiRequest, res : NextApiResponse<any>) => {
    const { query : { IdReservaCotizacion }} = req;
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ServicioEscogido;
    try {
        await connectToDatabase().then(async connectedObject => {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion.coleccion);
            const result = await collection.find(
                {
                    IdReservaCotizacion,
                }, 
                {
                    projection: { _id: 0 }
                }
            ).toArray((err : MongoError, result : any[]) => {
            
                if (err) {
                    console.log("Error - 101");
                    console.log(err);
                    res.status(500).json({
                        error: "Ocurrio un error"
                    });
                }
                res.status(200).json({
                    AllServicioEscogido: result
                });
            });
        });
    } catch (err) {
        console.log("Error - 102");
        console.log(`Error - Obtener cambios dolar => ${err}`);
        res.status(500).json({
            error: "Ocurrio un error"
        });
    }
}