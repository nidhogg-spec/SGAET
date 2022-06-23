import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { servicioEscogidoInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { generarIdNuevo } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";


export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    switch (req.method) {
        case "GET":
            await obtenerServicioEscogido(req, res);
            break;
        case "POST":
            await crearServicioEscogido(req, res);
            break;
        case "PUT":
            await actualizarServicioEscogido(req, res);
            break;
        case "DELETE":
            await eliminarServicioEscogido(req, res);
            break;
        default:
            res.status(404);
            break;
    }
}

const obtenerServicioEscogido = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ServicioEscogido;
    await connectToDatabase().then(async connectedObject => {
        try {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion.coleccion);
            const data = await collection.find({}).project({ "_id": 0 }).toArray();
            res.status(200).send(data);
        } catch (err) {
            res.status(500);
            console.log(err);
        }
    });
}

const crearServicioEscogido = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string, 
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ServicioEscogido;
    const { coleccion : coleccionNombre, keyId } : {coleccion : string, keyId : string } = coleccion;
    const servicioEscogido : servicioEscogidoInterface = req.body.ServicioEscogido;
    const nuevoServicioEscogido : servicioEscogidoInterface = {
        ...servicioEscogido, 
        [keyId]: await generarIdNuevo(coleccion)
    };

    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccionNombre);
        try {
            const result = await collection.insertOne(nuevoServicioEscogido);
            res.status(200).send(result);
            console.log("Insercion realizada");
        } catch (err) {
            res.status(500);
            console.log(err);
        }
    });

}

const actualizarServicioEscogido = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ServicioEscogido;
    const servicioEscogido : servicioEscogidoInterface = req.body.ServicioEscogido;
    const { IdServicioEscogido } =  req.query;
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        try {
            const result = collection.updateOne(
                {
                    [coleccion.keyId]: IdServicioEscogido
                }, 
                {
                    $set: servicioEscogido
                }
            );
            console.log("Actualizacion satisfactoria");
            res.status(200).send(result);
        } catch (err) {
            res.status(500);
            console.log(err);
            
        }
    });
}

const eliminarServicioEscogido = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ServicioEscogido;
    const { IdServicioEscogido } = req.query;
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        try {
            const result = await collection.deleteOne(
                {
                    [coleccion.keyId]: IdServicioEscogido
                }
            );
            console.log("Eliminacion correcta");
            res.status(200).send(result);
        } catch (err) {
            res.status(500);
            console.log(err);
        }
    });
    
}