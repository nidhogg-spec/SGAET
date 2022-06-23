import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { servicioEscogidoInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { generarIdNuevo } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";

export default async (req : NextApiRequest, res : NextApiResponse) => {
    const { 
        query: {
            accion, IdServicioEscogido
        }
    } = req;
    switch (req.method) {
        case "GET":
            await obtenerServicioEscogido(req, res);            
            break;
        case "POST":
            await crearServicioEscogido(req, res); 
            break;
        case "PUT":
            if (req.body['Accion'] == 'UpdateMany') {
                await actualizarMuchosServicioEscogido(req, res); 
            } else {
                await actualizarServicioEscogido(req, res);
            }
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
    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        obtenerServicioEscogidoCallback(dbo, (err : any, data : any) => {
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

const obtenerServicioEscogidoCallback = async (dbo : Db, callback : any) => {
    const coleccion : {
        prefijo : string,
        coleccion: string,
        keyId : string
    } = dbColeccionesFormato.ServicioEscogido;
    const { coleccion : coleccionNombre } : {coleccion : string} = coleccion;
    const collection : Collection<any> = dbo.collection(coleccionNombre);
    collection.find({}).toArray(callback);
}

const crearServicioEscogido = async (req : NextApiRequest, res: NextApiResponse<any>) => {
    const servicioEscogido : servicioEscogidoInterface = req.body.ServicioEscogido;
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ServicioEscogido;
    const { coleccion : coleccionNombre, keyId } : { coleccion : string, keyId: string } = coleccion;
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
            console.log("Se agrego correctamente el servicio escogido");
        } catch (err) {
            console.log(`Error - ${err}`);
        }
    });

}


const actualizarServicioEscogido = async (req : NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ServicioEscogido;
    const servicioEscogido : servicioEscogidoInterface = req.body.ServicioEscogido;
    const idServicioEscogido : string = req.body.IdServicioEscogido;
    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        const collection  : Collection<any> = dbo.collection(coleccion.coleccion);
        try {
            collection.updateOne(
                {
                    [coleccion.keyId]: idServicioEscogido,
                }, 
                {
                    $set: servicioEscogido
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

const eliminarServicioEscogido = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ServicioEscogido;

    const idServicioEscogido : string = req.body.IdServicioEscogido;
    await connectToDatabase().then(async connectedObject => {
        try {
            const dbo : Db = connectedObject.db;
            const collection : Collection<any> = dbo.collection(coleccion.coleccion);
            await collection.deleteOne(
                {
                    [coleccion.keyId]: idServicioEscogido
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


const actualizarMuchosServicioEscogido = async (req : NextApiRequest, res: NextApiResponse<any>) => {
    const servicioEscogido : Array<servicioEscogidoInterface> = req.body.ServicioEscogido;
    const serviciosEscogidos = [...servicioEscogido];
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ServicioEscogido;
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        const { coleccion : coleccionNombre, keyId: keyId } : {coleccion: string, keyId : string } = coleccion;
        try {
            await Promise.all(
                serviciosEscogidos.map(async servicio => {
                    if (servicio[keyId as keyof typeof servicio]) {
                        try {
                            await collection.updateOne(
                                {
                                    [keyId]: servicio[keyId as keyof typeof servicio]
                                }, 
                                {
                                    $set: servicio 
                                }
                            );
                            console.log("Se actualizaron todos los registros");
                        } catch (err) {
                            console.log(`Error al actualizar ${servicio[keyId as keyof typeof servicio]}`);
                            console.log(err);
                        }
                    } else {
                        try {
                            const servicioEscogido = {
                                ...servicio,
                                [keyId]: await generarIdNuevo(coleccion)
                            };
                            servicio = servicioEscogido;
                        } catch (err) {
                            console.log(`Error 2 al actualizar servicioEscogido ${servicio[keyId as keyof typeof servicio]}`);
                            console.log(`error 2 - ${err}`);
                        }
                        try {
                            await collection.insertOne(servicio);
                            console.log("Actualizacion de muchos realizada");

                        } catch (err) {
                            console.log(`Error 3 al ingresar ${servicio[keyId as keyof typeof servicio]}`);
                            console.log(err);
                        }
                    }
                })
            );
            res.status(200).send("Actualizaciones hechas correctamente");
        } catch (err) {
            res.status(500).send(`Ocurrio un error - ${err}`);
        }
    });
}