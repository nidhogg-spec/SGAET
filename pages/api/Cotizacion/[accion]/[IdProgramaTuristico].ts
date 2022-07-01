import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { dbColeccionesFormato } from "@/utils/interfaces/db";
import { Db, Collection } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const {
        query: { accion, IdProgramaTuristico }
    } = req;
    switch (req.method) {
        case "GET":
            switch (accion) {
                case "ObtenerTodosPT":
                    await obtenerTodosPT(req, res);
                    break;
                case "ObtenerUnPT":
                    await obtenerUnPT(req, res);
                    break;
                default:
                    res.status(500).json({
                        message: "Falta especificar la accion"
                    });
                    break;
            }
            break;
        case "POST":
            switch (accion) {
                default:
                    res.status(500).json({
                        message: "Falta accion"
                    });
                    break;
            }
            break;
        default:
            res.status(404);
            break;
    }
}

const obtenerTodosPT = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ProgramaTuristico;
    try {
        await connectToDatabase().then(async connectedObject => {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion.coleccion);
            collection.find({}, {
                projection: {
                    _id: 0,
                    IdProgramaTuristico: 1,
                    NombrePrograma: 1,
                    CodigoPrograma: 1,
                    Localizacion: 1,
                    Descripcion: 1,
                    DuracionDias: 1,
                    DuracionNoche: 1,
                    PrecioEstandar: 1
                }
            }).toArray((err, result) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({
                    AllProgramasTuristicos: result
                });
            });
        });
    } catch (err) {
        console.log(err);
    }
}


const obtenerUnPT = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const {
        query: { accion, IdProgramaTuristico }
    } = req;
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ProgramaTuristico;
    try {
        await connectToDatabase().then(async connectedObject => {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion.coleccion);
            const result = await collection.findOne(
                {
                    [coleccion.keyId]: IdProgramaTuristico
                }
            );
            res.status(200).json({result});
        });
    } catch (err) {
        res.status(500);
        console.log(err);
    }
}