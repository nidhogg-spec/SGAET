import { connectToDatabase } from "@/utils/API/connectMongo-v2";

import { NextApiRequest, NextApiResponse } from "next";
import { productoHotelesInterface, productoRestaurantesInterface, productoTransportesInterface, productoGuiasInterface, productoAgenciaInterface, productoTransFerroviarioInterface, productoSitioTuristicoInterface, productoOtrosInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { generarIdNuevo } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";

let coleccion : any;

export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const { query : { TipoProveedor }} = req;
    switch (TipoProveedor) {
        case "hotel":
            coleccion = dbColeccionesFormato.ProductoHoteles;
            break;
        case "restaurante":
            coleccion = dbColeccionesFormato.ProductoRestaurantes;
            break;
        case "transporteterrestre":
            coleccion = dbColeccionesFormato.ProductoTransportes;
            break;
        case "guia":
            coleccion = dbColeccionesFormato.ProductoGuias;
            break;
        case "agencia":
            coleccion = dbColeccionesFormato.ProductoAgencias;
            break;
        case "transporteferroviario":
            coleccion = dbColeccionesFormato.ProductoSitioTransFerroviario;
            break;
        case "sitioturistico":
            coleccion = dbColeccionesFormato.ProductoSitioTuristicos;
            break;
        case "otro":
            coleccion = dbColeccionesFormato.ProductoOtros;
            break;
    }
    if (req.method == "POST") {
        switch (req.body.accion) {
            case "create":
                await crearColeccion(req, res);
                break;
            case "update":
                await actualizarColeccion(req, res);
                break;
            case "delete":
               await eliminarColeccion(req, res);
                break;
            default:
                res.status(500).json({
                    message: "Error al recibir el metodo HTTP"
                });
                break;
        }
    } else if (req.method == "GET") {
        //await obtenerColeccion(req, res);
    }
}


const crearColeccion = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    await connectToDatabase().then(async connectedObject => {
        if (!(coleccion in coleccion)) {
            const { prefijo, collectionName, idKey } = coleccion;
            coleccion = {
                prefijo,
                coleccion: collectionName,
                keyId: idKey
            };
        }
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        try {
            const producto = req.body.data;
            const nuevoProducto = {
                 ...producto,
                [coleccion.keyId]: await generarIdNuevo(coleccion)
            };
            const result = await collection.insertOne(nuevoProducto);
            if (result.insertedCount) {
                console.log("Creacion realizada");
                res.status(200).send("Creacion realizada satisfactoriamente");
            } else {
                console.log(result.insertedCount);
                console.log("Ocurrio un error");
            }
        } catch (err) {
            console.log(`Ocurrio un error - ${err}`);
        }
    });
}

const actualizarColeccion = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    if (!(coleccion in coleccion)) {
        const { prefijo, collectionName, idKey } = coleccion;
        coleccion = {
            prefijo,
            coleccion: collectionName,
            keyId: idKey
        };
    }
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        try {
            const producto = req.body.data;
            const idProducto : string = req.body.idProducto;
            const result = collection.updateOne(
                {
                    [coleccion.keyId]: idProducto
                },
                {
                    $set: producto
                }
            );
            console.log("Actualizacion satisfatoria");
            res.status(200).send("Actualizacion satisfactoria");
        } catch (err) {
            console.log(`Ocurrio un error - ${err}`);
        }

    })
}

const eliminarColeccion = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    if (!(coleccion in coleccion)) {
        const { prefijo, collectionName, idKey } = coleccion;
        coleccion = {
            prefijo,
            coleccion: collectionName,
            keyId: idKey
        };
    }
    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        const collection : Collection<any> = dbo.collection(coleccion.coleccion);
        try {
            const idProducto: string = req.body.idProducto;
            const result = collection.deleteOne(
                {
                    [coleccion.keyId]: idProducto
                }
            );
            console.log("Eliminacion correcta");
            res.status(200).send("Eliminacion correcta");
        } catch (err) {
            console.log("Error al eliminar");
        }
    });
}
