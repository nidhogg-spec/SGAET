import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { ingresoInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { generarIdNuevo } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";

export default async (req : NextApiRequest, res : NextApiResponse) => {
    if (req.method === "POST") {
        switch (req.body.accion) {
            case "create":
                await crearIngreso(req, res);
                break;
            case "update":
                await actualizarIngreso(req, res);
                break;
            case "delete":
                await eliminarIngreso(req, res);
                break;
            default: 
                res.status(500).json({
                    message: "Error al enviar un metodo HTTP"
                });

        }
    } else if (req.method === "GET") {
        await obtenerIngreso(req, res);
    }
}

const crearIngreso = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Ingreso;
    const { coleccion : coleccionNombre, keyId } = coleccion;
    const ingresoServicio : ingresoInterface = req.body.data;
    const nuevoIngreso : ingresoInterface = {
        ...ingresoServicio,
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
            const result = await collection.insertOne(nuevoIngreso);
            res.status(200).send(result);
            console.log("Se agrego correctamente el ingreso");
        } catch (err) {
            console.log(`Error - ${err}`);
        }
    });
}

const actualizarIngreso = async (req : NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Ingreso;
    const ingreso : ingresoInterface = req.body.data;
    const idIngreso : string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        const collection  : Collection<any> = dbo.collection(coleccion.coleccion);
        try {
            collection.updateOne(
                {
                    [coleccion.keyId]: idIngreso,
                }, 
                {
                    $set: ingreso
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

const eliminarIngreso = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Ingreso;

    const idIngreso : string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        try {
            const dbo : Db = connectedObject.db;
            const collection : Collection<any> = dbo.collection(coleccion.coleccion);
            await collection.deleteOne(
                {
                    [coleccion.keyId]: idIngreso
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

const obtenerIngreso = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        obtenerIngresoCallback(dbo, (err : any, data : any) => {
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

const obtenerIngresoCallback = async (dbo : Db, callback : any) => {
    const coleccion : {
        prefijo : string,
        coleccion: string,
        keyId : string
    } = dbColeccionesFormato.Ingreso;
    const { coleccion : coleccionNombre } : {coleccion : string} = coleccion;
    const collection : Collection<any> = dbo.collection(coleccionNombre);
    collection.find({}).toArray(callback);
}