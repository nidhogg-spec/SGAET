import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { Collection, Db } from "mongodb";
import { dbColeccionesFormato } from "@/utils/interfaces/db";

export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    switch (req.method) {
        case "POST":
            switch (req.body.accion) {
                case "ObtenerCambioDolar":
                    await obtenerCambioDolar(req, res);
                    break;
                case "CambiarCambioDolar":
                    await actualizarCambioDolar(req, res);
                    break;
                default: 
                    res.status(500).json({
                        message: "Error al obtener el metodo HTTP"
                    });
                    break;
            }
        default:
            res.status(404);
            break; 
    }
}

const obtenerCambioDolar = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : string = "DataSistema";
    const id : string = "CambioDolar";
    try {
        await connectToDatabase().then(async connectedObject => {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion);
            const result = await collection.findOne({
                TipoDato: id
            });
            if (result) {
                console.log(`Devolviendo info ${result.value}`);
                res.status(200).json({
                    value: result.value
                });
            } else {
                collection.insertOne({
                    TipoDato: id,
                    value: 3.5
                });
                res.status(200).json({
                    value: 3.5
                });
            }
        });
    } catch (error) {
        console.log(`Error al obtener los datod - ${error}`);
        res.status(405);
    }
}

const actualizarCambioDolar = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        coleccion : string, 
        keyId: string
    } = dbColeccionesFormato.DataSistema;
    const { coleccion : coleccionNombre, keyId} : {coleccion: string, keyId: string} = coleccion;

    const id : string = "CambioDolar";
    const valor = {
        value: req.body.value
    };
    try {
        await connectToDatabase().then(async connectedObject => {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccionNombre);
            const result = await collection.updateOne(
                {
                    [keyId]: id,
                }, 
                {
                    $set: valor
                }
            );
            result ? res.status(200).send(result) : res.status(500).send("Error con la seleccion de datos");
        });
    } catch (err) {
        console.log(`Error al realizar el cambio de dolar - ${err}`);
    }
}