import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { criterioInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { generarIdNuevo } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";

export default async (req : NextApiRequest, res : NextApiResponse) => {
    if (req.method == "POST") {
        switch (req.body.accion) {
            case "create":
                await crearCriterio(req, res);
                break;
            case "update":
                await actualizarCriterio(req, res);
                break;
            case "delete":
                await eliminarCriterio(req, res);
                break;
            default: 
                res.status(500).json({
                    message: "Error al enviar metodo HTTP"
                });
                break;
        }
    } else if (req.method == "GET") {
        await obtenerCriterio(req, res);
    }
}

const crearCriterio = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string, 
        coleccion: string, 
        keyId: string
    } = dbColeccionesFormato.Criterio;
    const { coleccion : coleccionNombre, keyId } = coleccion;
    const criterio : criterioInterface = req.body.data;
    const nuevoCriterio : criterioInterface = {
        ...criterio,
        [keyId]: await generarIdNuevo(coleccion)
    };
    if (req.body.data.IdCriterio == undefined) {
        res.status(304).send("No se ha definido el id");
        console.log("IdCriterio no se ha definido");
        return;
    }

    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        const collection : Collection<any> = dbo.collection(coleccionNombre);
        try {
            const result = await collection.insertOne(nuevoCriterio);
            res.status(200).send(result);
            console.log("Se agrego correctamente el criterio");

        } catch (err) {
            console.log(`Error - ${err}`);
        }
    });

}

const actualizarCriterio = async (req : NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion : string,
        keyId : string
    } = dbColeccionesFormato.Criterio;
    const criterio : criterioInterface = req.body.data;
    const idCriterio : string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        const collection : Collection<any> = dbo.collection(coleccion.coleccion);
        try {
            collection.updateOne(
                {
                    [coleccion.keyId]: idCriterio
                },
                {
                    $set: criterio
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

const eliminarCriterio = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId : string
    } = dbColeccionesFormato.Criterio;
    const idCriterio : string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        try {
            const dbo : Db = connectedObject.db;
            const collection : Collection<any> = dbo.collection(coleccion.coleccion);
            await collection.deleteOne(
                {
                    [coleccion.keyId]: idCriterio
                }
            );
            console.log("Eliminacion correcta");
            res.status(200).json({
                message: "Eliminacion satisfactoria"
            });

        } catch (err) {
            res.status(500).json({ error: true, message: "Error al eliminar" });
            console.log(err);
        }
    });
}

const obtenerCriterio = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        obtenerCriterioCallback(dbo, (err : any, data  : any) => {
            if (err) {
                res.status(500).json({ error: true, message: "Ocurrio un error al listar"});
                return;
            }
            res.status(200).json({data});
        });
    });
}

const obtenerCriterioCallback = async (dbo : Db, callback : any) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Criterio;
    const { coleccion : coleccionNombre } : {coleccion : string} = coleccion;
    const collection : Collection<any> = dbo.collection(coleccionNombre);
    collection.find({}).toArray(callback);
}