import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { dbColeccionesFormato } from "@/utils/interfaces/db";
import { Collection, Db } from "mongodb";

/*
No se cierra la peticion, peticion abierta
*/


export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const { query: {
        IdProgramaTuristico
    }} = req;
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ProgramaTuristico;
    try {
        await connectToDatabase().then(async connectedObject => {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion.coleccion);
            const result = await collection.findOne({
                [coleccion.keyId]: IdProgramaTuristico
            });
            const servicios = result.value['ServicioProducto'];
            delete result.value['ServicioProducto'];
            if (result) {
                res.status(200).json({
                    DataProgramaTuristico: result.value, 
                    Servicios: servicios
                });
            } else {
                console.log("Ningun resultado");
                res.status(500).send("Ningun resultado");
            }
        });
    } catch (err) {
        console.log(`Error - ${err}`);
    }
}