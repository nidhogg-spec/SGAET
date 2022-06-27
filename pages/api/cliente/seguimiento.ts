import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { generarIdNuevo } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";
import { dbColeccionesFormato } from "@/utils/interfaces/db";


export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    if (req.method === "POST") {
        switch (req.body.accion) {
            case "create":
                await crearSeguimiento(req, res);
                break;
            case "update":
                await actualizarSeguimiento(req, res);
                break;
            case "delete":
                await eliminarSeguimiento(req, res);
                break;
            default:
                res.status(500).json({
                    message: "Error al enviar metodo HTTP"
                });
                break;
        }
    }
}


const crearSeguimiento = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string, 
        coleccion: string, 
        keyId: string
    } = dbColeccionesFormato.Seguimiento;
    const seguimiento  = req.body.data;
    const nuevoSeguimiento = {
        ...seguimiento,
        [coleccion.keyId]: await generarIdNuevo(coleccion)
    };
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        try {
            const result = await collection.insertOne(nuevoSeguimiento);
            res.status(200).send(result);
            console.log("Se agrego correctamente el seguimiento");
        } catch (err) {
            console.log(`Error - ${err}`);
        }
    });
}

const actualizarSeguimiento = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Seguimiento;
    const seguimiento = req.body.data;
    const idSeguimiento = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        try {
            collection.updateOne(
                {
                    [coleccion.keyId]: idSeguimiento
                },
                {
                    $set: seguimiento
                }
            );
            res.status(200).json({
                message: "Actualizacion satisfactoria"
            });
        } catch (err) {
            res.status(500).json({
                error: true,
                message: `Error al actualizar - ${err}`
            });
            console.log(err);
        }
    });
}

const eliminarSeguimiento = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId:string
    } = dbColeccionesFormato.Seguimiento;
    const idSeguimiento : string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        try {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion.coleccion);
            await collection.deleteOne(
                {
                    [coleccion.keyId]: idSeguimiento
                }
            );
            console.log("Eliminacion correcta");
            res.status(500).json({
                error: true,
                message: "Error satisfactoria"
            });
        } catch (err) {
            res.status(500).json({
                error: true,
                message: "Error al eliminar"
            });
            console.log(err);
        }
    });
}

