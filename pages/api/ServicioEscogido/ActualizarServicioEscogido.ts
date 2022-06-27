import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { servicioEscogidoInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { Collection, Db } from "mongodb";


export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    switch (req.method) {
        case "POST":
            await actualizarServicioEscogido(req, res);
            break;
        default:
            res.status(500).json({
                message: "Error al enviar el metodo HTTP"
            });
            break;
    }
}

const actualizarServicioEscogido = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string, 
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ServicioEscogido;
    const servicioEscogido : servicioEscogidoInterface = req.body.ServicioEscogido;
    const idServicioEscogido : string = req.body.IdServicioEscogido;
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        try {
            collection.updateOne(
                {
                    [coleccion.keyId]: idServicioEscogido
                },
                {
                    $set: servicioEscogido
                }
            );
            res.status(200).json({
                message: "Actualizacion realizada satisfactoriamente"
            });
            console.log("Actualizacion satisfactoria");
        } catch (err) {
            res.status(500).json({
                error: "Ocurrio un error"
            });
        }
    });
}