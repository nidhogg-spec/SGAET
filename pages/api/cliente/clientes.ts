import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { clienteProspectoInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { generarIdNuevo } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";


export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    if (req.method === "POST") {
        switch (req.body.accion) {
            case "create":
                await crearCliente(req, res);
                break;
            case "update":
                await actualizarCliente(req, res);
                break;
            case "delete":
                await eliminarCliente(req, res);
                break;
            default:
                res.status(500).json({
                    message: "Error al recibir el metodo HTTP"
                });
                break;
        } 
    } else if (req.method === "GET") {
        await obtenerCliente(req, res);
    }
}

const crearCliente = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo : string, 
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Cliente;
    const { coleccion : coleccionNombre, keyId } : { coleccion : string, keyId : string} = coleccion;
    const cliente : clienteProspectoInterface = req.body.data;
    const clienteNuevo : clienteProspectoInterface = {
        ...cliente,
        [keyId]: await generarIdNuevo(coleccion)
    };
    
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccionNombre);
        try {
            const result = await collection.insertOne(clienteNuevo);
            res.status(200).send(result);
            console.log("Se agrego correctamente el cliente");
        } catch (err) {
            console.log(`Error al ingresar - ${err}`);
        }
    });
}

const actualizarCliente = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Cliente;
    const cliente : clienteProspectoInterface = req.body.data;
    const idCliente : string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        try {
            collection.updateOne(
                {
                    [coleccion.keyId]: idCliente
                }, 
                {
                    $set: cliente
                }
            );
            res.status(200).json({
                message: "Actualizacion hecha correctamente"
            });
        } catch (err) {
            res.status(500).json({
                error: true,
                message: `Error al actualizar ${err}`
            });
        }
    });
}


const eliminarCliente = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Cliente;
    const idCliente : string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        try {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion.coleccion);
            await collection.deleteOne(
                {
                    [coleccion.keyId]: idCliente
                }
            );
            console.log("Eliminacion correcta");
            res.status(200).json({
                message: "Eliminacion correctamente"
            });
        } catch (err) {
            res.status(500).json({
                error: true,
                message: "Error al eliminar"
            });
        }
    });

}

const obtenerCliente = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        obtenerClienteCallback(db, (err : any, data : any) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Ocurrio un error al listar"
                });
                return;
            }
            res.status(200).json({
                data
            });
        });
    });
}

const obtenerClienteCallback = async (dbo : Db, callback : any) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Cliente;
    const { coleccion : coleccionNombre } : {coleccion : string} = coleccion;
    const collection : Collection<any> = dbo.collection(coleccionNombre);
    collection.find({}).toArray(callback);
}