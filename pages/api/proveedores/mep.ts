import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { evaluacionActividadInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { construirId, generarIdNuevo, obtenerUltimo } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";

/*
La respuesta de agregar muchos no termina de cerrar y se queda a la espera

Ejemplo de peticion:
{
    "accion": "createmany",
    "data": [
        {
            "evaperiodo": [
                {
                    "descripcion": "Que esté activo y este habido en la SUNAT",
                    "valor": "2",
                    "criterio": "Comprobantes y Factura",
                    "estado": 0,
                    "IdActividad": "AC00006",
                    "actividad": {
                        "estado": 0
                    }
                },
                {
                    "descripcion": "Entrega de comprobantes de pago antes de que concluya el mes",
                    "valor": "1",
                    "criterio": "Comprobantes y Factura",
                    "estado": 1,
                    "IdActividad": "AC00004",
                    "actividad": {
                        "estado": 0
                    }
                }
            ],
            "IdProveedor": "TT00003"
        },
        {
            "evaperiodo": [
                {
                    "descripcion": "Que esté activo y exista en la SUNAT",
                    "valor": "1",
                    "criterio": "Comprobantes y Factura",
                    "estado": 1,
                    "IdActividad": "AC00006",
                    "actividad": {
                        "estado": 0
                    }
                },
                {
                    "descripcion": "Entrega de comprobantes de pago antes de que concluya el mes",
                    "valor": "1",
                    "criterio": "Comprobantes y Factura",
                    "estado": 1,
                    "IdActividad": "AC00004",
                    "actividad": {
                        "estado": 0
                    }
                }
            ],
            "IdProveedor": "TT00003"
        }
    ]
}

*/

export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    if (req.method === "POST") {
        switch (req.body.accion) {
            case "create":
                await crearEvaluacionActividad(req, res);
                break;
            case "createmany":
                await crearMuchosEvaluacionActividad(req, res);
                break;
            case "update":
                await actualizarEvaluacionActividad(req, res);
                break;
            case "delete":
                await eliminarEvaluacionActividad(req, res);
                break;
            default: 
                res.status(500).json({
                    message: `Error al enviar metodo HTTP`
                });
        }
    } else if (req.method === "GET") {
        await obtenerEvaluacionActividad(req, res);
    }
}


const crearEvaluacionActividad = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.EvaluacionActividad;
    const { coleccion : coleccionNombre, keyId } = coleccion;
    const evaluacionActividad : evaluacionActividadInterface = req.body.data;
    const nuevoEvaluacionActividad : evaluacionActividadInterface = {
        ...evaluacionActividad,
        [keyId]: await generarIdNuevo(coleccion)
    };
    

    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        const collection : Collection<any> = dbo.collection(coleccionNombre);
        try {
            const result = await collection.insertOne(nuevoEvaluacionActividad);
            res.status(200).send(result);
            console.log("Se agrego correctamente el ingreso");
        } catch (err) {
            console.log(`Error - ${err}`);
        }
    });
}

const crearMuchosEvaluacionActividad = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.EvaluacionActividad;
    const { coleccion : coleccionNombre, prefijo, keyId } : {coleccion : string, prefijo: string, keyId : string} = coleccion;
    const evaluacionesActividad : Array<evaluacionActividadInterface> = [...req.body.data];
    
    try {

        let indicesActualizados : any;
        const ultimoObjeto = await obtenerUltimo(coleccion);
        let ultimoId = ultimoObjeto[keyId];
        indicesActualizados = evaluacionesActividad.map(evaluacionActividad => {
            const idNuevo : string = construirId(evaluacionActividad, prefijo, keyId, ultimoId);
            
            ultimoId = idNuevo;
            
            
            const nuevoEvaluacionActividad : evaluacionActividadInterface = {
                ...evaluacionActividad,
                [keyId]: idNuevo
            };
            return nuevoEvaluacionActividad;
    
        });
        
        await connectToDatabase().then(async connectedObject => {
            try {
                const db : Db = connectedObject.db;
                const collection : Collection<any> = db.collection(coleccionNombre);
                const result = await collection.insertMany(indicesActualizados);
                console.log("Ingresos correctos");
            } catch (err) {
                console.log(`Error - ${err}`);
            }
        });
    } catch (err) {
        console.log(`Error - ${err}`);
    }
}

const actualizarEvaluacionActividad = async (req : NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.EvaluacionActividad;
    const evaluacionActividad : evaluacionActividadInterface = req.body.data;
    const idEvaluacionActividad : string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        const collection  : Collection<any> = dbo.collection(coleccion.coleccion);
        try {
            collection.updateOne(
                {
                    [coleccion.keyId]: idEvaluacionActividad,
                }, 
                {
                    $set: evaluacionActividad
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

const eliminarEvaluacionActividad = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.EvaluacionActividad;

    const idEvaluacionActividad : string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        try {
            const dbo : Db = connectedObject.db;
            const collection : Collection<any> = dbo.collection(coleccion.coleccion);
            await collection.deleteOne(
                {
                    [coleccion.keyId]: idEvaluacionActividad
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


const obtenerEvaluacionActividad = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    await connectToDatabase().then(async connectedObject => {
        const dbo : Db = connectedObject.db;
        obtenerEvaluacionActividadCallback(dbo, (err : any, data : any) => {
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

const obtenerEvaluacionActividadCallback = async (dbo : Db, callback : any) => {
    const coleccion : {
        prefijo : string,
        coleccion: string,
        keyId : string
    } = dbColeccionesFormato.EvaluacionActividad;
    const { coleccion : coleccionNombre } : {coleccion : string} = coleccion;
    const collection : Collection<any> = dbo.collection(coleccionNombre);
    collection.find({}).toArray(callback);
}