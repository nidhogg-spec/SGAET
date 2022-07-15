import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { egresoInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { generarIdElementoNuevo, generarIdNuevo } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";


export default async (req: NextApiRequest, res: NextApiResponse) => {
    /*switch (req.method) {
        case "POST":
            await crearEgreso(req, res);
            break;
        case "GET":
            await obtenerEgreso(req, res);
            break;
    }*/
    if (req.method == "POST") {
        switch (req.body.accion) {
            case "create":
                await crearEgreso(req, res);
                break;
            case "update":
                await actualizarEgreso(req, res);
                break;
            case "delete":
                await eliminarEgreso(req, res);
                break;
            default:
                res.status(500).json({
                    message: "Error al enviar un metodo HTTP",
                });
        }

    } else if (req.method == "GET") {
        await obtenerEgreso(req, res);
    }
};


const crearEgreso = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    let coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Egreso;
    const { coleccion: coleccionAtributo, prefijo }: {
        coleccion: string,
        prefijo: string
    } = coleccion;
    let egresoServicio: egresoInterface = {
        IdEgreso: await generarIdNuevo(coleccion),
        MetodoPago: "",
        Adelanto: 0,
        IdReservaCotizacion: "",
        Comision: 0,
        TotalNeto: 0,
        Total: 0,
        Npasajeros: ""
    }

    if (req.body.data.IdEgreso == undefined) {
        res.status(304).send("No se ha ingresado el IdEgreso");
        console.log("IdEgreso no se ha definido");
        return;
    }
    /*
    if (req.body.data.IdReservaCotizacion == undefined) {
        res.status(304).send("No se ha ingresado el IdReservaCotizacion");
        console.log("IdReservaCotizacion no se ha definido");
        return;
    }*/

    let egreso: egresoInterface = {
        ...req.body.data,
        IdEgreso: egresoServicio.IdEgreso
    };

    await connectToDatabase().then(async connectedObject => {
        let dbo: Db = connectedObject.db;
        let collection: Collection<any> = dbo.collection(coleccionAtributo);
        try {
            let result = await collection.insertOne(egreso);
            res.status(200).send(result);
            console.log("Se agrego el egreso correctamente");
        } catch (err) {
            console.log(`error - ${err}`);
        }
    });
}

const actualizarEgreso = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Egreso;
    const egreso: egresoInterface = req.body.data;
    const idEgreso: string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        const dbo: Db = connectedObject.db;
        const collection: Collection<any> = dbo.collection(coleccion.coleccion);
        try {

            collection.updateOne(
                {
                    [coleccion.keyId]: idEgreso
                },
                {
                    $set: egreso
                }/*
                (error, result) => {
                    if (error) {
                        res.status(500).json({
                            error: true,
                            message: `Error al actualizar - ${error}`
                        });
                        return;
                    }
                    console.log("Actualizacion satisfactoria");
                    res.status(200).json({
                        message: "Actualizacion satifactoria"
                    });
                }*/
            );
            res.status(200).json({
                message: "Actualizacion satifactoria"
            });
        } catch (err) {
            res.status(500).json({
                error: true,
                message: `Error al actualizar - ${err}`
            })
            console.log(err);

        }
    });
}


const eliminarEgreso = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Egreso;
    const idEgreso: string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        try {
            const dbo: Db = connectedObject.db;
            const collection: Collection<any> = dbo.collection(coleccion.coleccion);
            await collection.deleteOne(
                {
                    [coleccion.keyId]: idEgreso
                }/*
                (err, result) => {
                    if (err) {
                        res.status(500).json({
                            error: true,
                            message: "Error al eliminar"
                        });
                        return;
                    }
                    console.log("Eliminacion correctamente");
                    res.status(200).json({
                        message: "Eliminacion satisfactoria"
                    });
                }*/
            );
            console.log("Eliminacion correctamente");
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

const obtenerEgreso = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    await connectToDatabase().then(async connectedObject => {
        let dbo: Db = connectedObject.db;
        obtenerEgresoCallback(dbo, (err: any, data: any) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Ocurrio un error inesperado"
                });
                return;
            }
            res.status(200).json({ data });
        });
    });
}

const obtenerEgresoCallback = async (dbo: Db, callback: any) => {
    let coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Egreso;
    const { coleccion: coleccionAtributo }: {
        coleccion: string
    } = coleccion;
    const collection: Collection<any> = dbo.collection(coleccionAtributo);
    collection.find({}).toArray(callback);
}