import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { reservaCotizacionInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { generarIdNuevo } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";

export default async (req : NextApiRequest, res : NextApiResponse) => {
    if (req.method === "POST") {
        switch (req.body.accion) {
            case "create":
                await crearReservaCotizacion(req, res);
                break;
            case "update":
                await actualizarReservaCotizacion(req, res);
                break;
            case "delete":
                await eliminarReservaCotizacion(req, res);
                break;
            default:
                res.status(500).json({
                    message: "Error al enviar un metodo HTTP"
                });
                break;
        }
    } else if (req.method === "GET") {
        await obtenerReservaCotizacion(req, res);
    }
}


const obtenerReservaCotizacion = async (req : NextApiRequest, res: NextApiResponse<any>) => {
    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        obtenerReservaCotizacionCallback(dbo, (err : any, data : any) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Ocurrio un error al listar"
                });
                return;
            }
            // Antiguo : .json({data});
            res.status(200).send(data);
        });
    });
}

const obtenerReservaCotizacionCallback = async (dbo : Db, callback : any) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ReservaCotizacion;
    const { coleccion : coleccionNombre } : { coleccion : string} = coleccion;
    const collection : Collection<any> = dbo.collection(coleccionNombre);
    collection.find({}).toArray(callback);

}

const crearReservaCotizacion = async (req : NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion : {
        prefijo : string,
        coleccion : string,
        keyId : string
    } = dbColeccionesFormato.ReservaCotizacion;
    const { coleccion : coleccionNombre, keyId} = coleccion;
    const reservaCotizacion : reservaCotizacionInterface = req.body.data;
    const nuevaReservaCotizacion : reservaCotizacionInterface = {
        ...reservaCotizacion,
        [keyId]: await generarIdNuevo(coleccion)
    };
    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        const collection : Collection<any> = dbo.collection(coleccionNombre);
        try {
            const result = await collection.insertOne(nuevaReservaCotizacion);
            res.status(200).send(result);
            console.log("Se agrego correctamente la reserva");
        } catch (err) {
            console.log(`Error - ${err}`);
        }
    });
}

const actualizarReservaCotizacion = async (req : NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ReservaCotizacion;
    const reservaCotizacion : reservaCotizacionInterface = req.body.data;
    const idReservaCotizacion : string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        const collection  : Collection<any> = dbo.collection(coleccion.coleccion);
        try {
            collection.updateOne(
                {
                    [coleccion.keyId]: idReservaCotizacion,
                }, 
                {
                    $set: reservaCotizacion
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

const eliminarReservaCotizacion = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ReservaCotizacion;

    const idReservaCotizacion : string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        try {
            const dbo : Db = connectedObject.db;
            const collection : Collection<any> = dbo.collection(coleccion.coleccion);
            await collection.deleteOne(
                {
                    [coleccion.keyId]: idReservaCotizacion
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
