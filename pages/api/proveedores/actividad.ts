import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { actividadInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { generarIdNuevo } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";

export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    if (req.method === "POST") {
        switch (req.body.accion) {
            case "create":
                await crearActividad(req, res);
                break;
            case "update":
                await actualizarActividad(req, res);
                break;
            case "updateEstado":
                await actualizarEstadoActividad(req, res);
                break;
            case "delete":
                await eliminarActividad(req, res);
                break;
            
        }
    } else if (req.method == "GET") {
        await obtenerActividad(req, res);
    }
}



const crearActividad = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Actividad;
    const { coleccion : coleccionNombre, keyId } = coleccion;
    const actividad : actividadInterface = req.body.data;
    const nuevaActividad : actividadInterface = {
        ...actividad,
        [keyId]: await generarIdNuevo(coleccion)
    };
    if (req.body.data.IdIngreso == undefined) {
        res.status(304).send("No se ha ingresado un Id de ingreso");
        console.log("IdIngreso no se ha definido");
        return;
    }

    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        const collection : Collection<any> = dbo.collection(coleccionNombre);
        try {
            const result = await collection.insertOne(nuevaActividad);
            res.status(200).send(result);
            console.log("Se agrego correctamente el ingreso");
        } catch (err) {
            console.log(`Error - ${err}`);
        }
    });
}

const actualizarActividad = async (req : NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Actividad;
    const actividad : actividadInterface = req.body.data;
    const idActividad : string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        const collection  : Collection<any> = dbo.collection(coleccion.coleccion);
        try {
            collection.updateOne(
                {
                    [coleccion.keyId]: idActividad,
                }, 
                {
                    $set: actividad
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

const actualizarEstadoActividad = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Actividad;
    const actividad = req.body.data;
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        collection.bulkWrite(
            actividad, 
            (err, result) => {
                if (err) {
                    res.status(500).json({
                        error: true,
                        message: `Ocurrio un error ${err}`
                    });
                    return;
                }
                console.log("Actualizacion satisfactoria");
            }
        );
    });
}

const eliminarActividad = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Actividad;

    const idActividad : string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        try {
            const dbo : Db = connectedObject.db;
            const collection : Collection<any> = dbo.collection(coleccion.coleccion);
            await collection.deleteOne(
                {
                    [coleccion.keyId]: idActividad
                }
            );
            console.log("Eliminacion correcta");
            res.status(200).json({
                message: "Eliminacion satisfactoria"
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



const obtenerActividad = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        obtenerActividadCallback(dbo, (err : any, data : any) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Ocurrio un error al listar"
                });
                return;
            }
            res.status(200).json({data});
        });
    })
}

const obtenerActividadCallback = async (dbo : Db, callback : any) => {
    const coleccion : {
        prefijo : string,
        coleccion: string,
        keyId : string
    } = dbColeccionesFormato.Actividad;
    const { coleccion : coleccionNombre } : {coleccion : string} = coleccion;
    const collection : Collection<any> = dbo.collection(coleccionNombre);
    collection.find({}).toArray(callback);
}