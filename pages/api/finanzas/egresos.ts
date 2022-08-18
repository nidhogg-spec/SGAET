import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { egresoInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { construirId, generarIdElementoNuevo, generarIdNuevo, obtenerMesSiguiente, obtenerUltimo } from "@/utils/API/generarId";
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
            case "createMany":
                await crearMuchos(req, res);
                break;
            case "update":
                await actualizarEgreso(req, res);
                break;
            case "updateMany":
                await actualizarMuchos(req, res);
                break;
            case "delete":
                await eliminarEgreso(req, res);
                break;
            case "deleteMany":
                await eliminarMuchos(req, res);
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


    const egreso: egresoInterface = req.body.data;
    const date : Date = new Date();
    const nuevoEgreso: egresoInterface = {
        ...egreso,
        IdEgreso: await generarIdNuevo(coleccion),
        FechaCreacion: date,
        FechaModificacion: date
    };

    await connectToDatabase().then(async connectedObject => {
        let dbo: Db = connectedObject.db;
        let collection: Collection<any> = dbo.collection(coleccionAtributo);
        try {
            let result = await collection.insertOne(nuevoEgreso);
            res.status(200).send(result);
            console.log("Se agrego el egreso correctamente");
        } catch (err) {
            console.log(`error - ${err}`);
        }
    });
}

const crearMuchos = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Egreso;
    const egresos: egresoInterface[] = req.body.data;

    await connectToDatabase().then(async connectedObject => {
        try {
            const ultimoEgreso: egresoInterface | any = await obtenerUltimo(coleccion);
            let ultimoId: string = ultimoEgreso.IdEgreso;
            const egresosActualizados: egresoInterface[] = egresos.map((egreso: egresoInterface) => {
                const nuevoId: string = construirId({}, coleccion.prefijo, coleccion.keyId, ultimoId);
                const date : Date = new Date();
                const egresoActualizado: egresoInterface = {
                    ...egreso,
                    [coleccion.keyId]: nuevoId,
                    FechaCreacion: date,
                    FechaModificacion: date
                };
                ultimoId = nuevoId;
                return egresoActualizado;
            });
            const db: Db = connectedObject.db;
            const collection: Collection<any> = db.collection(coleccion.coleccion);
            await collection.insertMany(egresosActualizados);
            res.status(200).json({
                message: "Insercion realizada satisfactoriamente"
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({
                error: true,
                message: "Error al ingresar varios egresos"
            });
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
    const egresoFechaActualizada : egresoInterface = {
        ...egreso,
        FechaModificacion: new Date()
    }
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
                    $set: egresoFechaActualizada
                }
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

const actualizarMuchos = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Egreso;
    const egresos = req.body.data;
    egresos.forEach((elemento: any) => {
        elemento.egreso.FechaModificacion = new Date();
    });
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection: Collection<any> = db.collection(coleccion.coleccion);
        try {
            egresos.forEach( async (elemento : any) => {
                const { idProducto, egreso : egresoActualizado } = elemento;
                console.log(elemento);
                await collection.updateOne({
                    [coleccion.keyId]: idProducto
                }, {
                    $set: egresoActualizado
                });
            });
            res.status(200).json({
                message: "Actualizacion satisfactoria"
            });
        } catch (err : any) {
            res.status(500).json({
                error: true,
                message: `Error al actualizar - ${err.message}`
            });
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
                }
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


const eliminarMuchos = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Egreso;
    const ids: string[] = req.body.data;
    const listaCondiciones: any = {
        $or: []
    };
    await connectToDatabase().then(async connectedObject => {
        try {
            ids.forEach(id => {
                listaCondiciones.$or.push({
                    [coleccion.keyId]: id
                });
            });
            const db: Db = connectedObject.db;
            const collection: Collection<any> = db.collection(coleccion.coleccion);
            await collection.deleteMany(listaCondiciones);
            res.status(200).json({
                message: "Eliminacion correcta"
            });
        } catch (err: any) {
            console.log(err);
            res.status(500).json({
                error: true,
                message: `Erros al eliminar varios - ${err.message}`
            });
        }

    });
}

const obtenerEgreso = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Egreso;
    const filtro: any = req.query;
    await connectToDatabase().then(async connectedObject => {
        const db: Db = connectedObject.db;
        const collection: Collection<any> = db.collection(coleccion.coleccion);
        try {
            if (filtro.hasOwnProperty("fechaInicio") && filtro.hasOwnProperty("fechaFin")) {
                const { fechaInicio, fechaFin } = filtro;
                const data = await collection.find({
                    FechaCreacion: {
                        $gte: new Date(fechaInicio),
                        $lte: new Date(fechaFin)
                    }
                }).toArray();
                res.status(200).json({data});
            } else if (filtro.hasOwnProperty("mes") && filtro.hasOwnProperty("anio")) {
                const { mes, anio } = filtro;
                const fechaInicio : string = `${anio}-${mes}-01`;
                const fechaFinal : string = obtenerMesSiguiente(mes, anio);
                const data = await collection.find({
                    FechaCreacion: {
                        $gte: new Date(fechaInicio),
                        $lte: new Date(fechaFinal)
                    }
                }).toArray();
                res.status(200).json({ data });
            } else {
                const data = await collection.find({}).toArray();
                res.status(200).json({ data });
            }

        } catch (error: any) {
            res.status(500).json({
                error: true,
                message: `Ocurrio un error - ${error.message}`
            });
        }

    });
}
