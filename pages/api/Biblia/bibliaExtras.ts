import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { biblia, dbColeccionesFormato } from "@/utils/interfaces/db";
import { Collection, Db } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";

export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const { query: { Accion }, method} = req;
    switch (method) {
        case "GET":
            await listarExtras(req, res);
            break;
        case "PUT":
            await actualizarRegistro(req, res);
            break;
        case "POST":
            await crearRegistro(req, res);
            break;
    }
}


const actualizarRegistro = async (req : NextApiRequest, res : NextApiResponse) => {
    const coleccion = dbColeccionesFormato.Biblia;
    const registro : biblia = req.body.data;
    const nuevoRegistro = {
        ...registro,
    };
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        try {
            const result = collection.updateOne(
                {
                    IdReservaCotizacion: nuevoRegistro.IdReservaCotizacion
                },
                {
                    $set: nuevoRegistro
                }
            );
            res.status(200).send(result);
            console.log("Se actualizo correctamente una nueva entrada a la biblia");
        } catch (error : any) {
            console.log(`Ocurrio un error al agregar - ${error}`);
        }
    });
}

const crearRegistro = async (req : NextApiRequest, res : NextApiResponse) => {
    const coleccion = dbColeccionesFormato.Biblia;
    const registro : biblia = req.body.data;
    const nuevoRegistro = {
        ...registro,
        IdRegistroBiblia: v4()
    };
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection <any> = db.collection(coleccion.coleccion);
        try {
            const result = collection.insertOne(nuevoRegistro);
            res.status(200).send(result);
            console.log("Se creo correctamente un registro");
        } catch (error : any) {
            console.log(`Ocurrio un error - ${error}`);
        }
    });
}

const listarExtras = async (req : NextApiRequest, res : NextApiResponse) => {
    const coleccion = dbColeccionesFormato.Biblia;
    const idReserva = req.query.IdReservaCotizacion;
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        try {
            const result = await collection.find({ IdReservaCotizacion: idReserva}).toArray();
            res.status(200).json({
                data: result
            });
        } catch (error : any) {
            console.log(`Ocurrio un error inesperado - ${error}`);
        }
    });
}