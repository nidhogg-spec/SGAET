import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { programaTuristicoInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { generarIdNuevo } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";

export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    switch (req.method) {
        case "GET":
            await obtenerProgramaTuristico(req,res);
            break;
        case "POST":
            await crearProgramaTuristico(req,res);
            break;
        case "PUT":
            await actualizarProgramaTuristico(req,res);
            break;
        case "DELETE":
            await eliminarProgramaTuristico(req, res);
            break;
        default:
            res.status(404);
            break;
    }
}


const obtenerProgramaTuristico = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string, 
        coleccion: string, 
        keyId : string
    } = dbColeccionesFormato.ProgramaTuristico;
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        try {
            const inactivos : string | string[] = req.query.inactivos;
            const result = inactivos == "true" ? await collection.find({
                $or: [
                    {
                        Estado: 1
                    },
                    {
                        Estado: 0
                    }
                ]
            }).toArray() : await collection.find({
                $or: [
                    {
                        Estado: 1
                    }
                ]
            }).toArray();
            res.status(200).json({
                data: result
            });
        } catch (err) {
            res.status(500);
            console.log(err);
        }
    });
}

const crearProgramaTuristico = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string, 
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ProgramaTuristico;
    const { coleccion : coleccionNombre, keyId} = coleccion;
    const programaTuristico : programaTuristicoInterface = req.body.ProgramaTuristico;
    const nuevoProgramaTuristico : programaTuristicoInterface = {
        ...programaTuristico,
        [keyId]: await generarIdNuevo(coleccion)
    };
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccionNombre);
        try {
            const result = await collection.insertOne(nuevoProgramaTuristico);
            res.status(200).json({
                data : result.ops[0]
            });
        } catch (err) {
            res.status(500).json({
                error: true,
                message: "Error al insertar"
            });
            res.status(500);
            console.log(err);
            
        }
    });
}

const actualizarProgramaTuristico = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ProgramaTuristico;
    const programaTuristico : programaTuristicoInterface = req.body.ProgramaTuristico;
    const idProgramaTuristico : string = req.body.IdProgramaTuristico;
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        try {
            await collection.updateOne(
                {
                    [coleccion.keyId]: idProgramaTuristico
                },
                {
                    $set: programaTuristico
                }
            );
            res.status(200).send("Actualizacion realizada correctamente");
            console.log("Actualizado correctamente");
        }  catch (err) {
            res.status(500);
            console.log(err);
        }
    });
}

const eliminarProgramaTuristico = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ProgramaTuristico;
    const idProgramaTuristico : string = req.body.IdProgramaTuristico;
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        try {
            await collection.deleteOne(
                {
                    [coleccion.keyId]: idProgramaTuristico
                }
            );
            console.log("Eliminacion correcta");
            res.status(200).send("Eliminacion realizada");
        }  catch (err) {
            res.status(500);
            console.log(err);
        }
    });
}