import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";

import { ingresoInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { construirId, generarIdNuevo, obtenerMesSiguiente, obtenerUltimo, procesarFinanza } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        switch (req.body.accion) {
            case "create":
                await crearIngreso(req, res);
                break;
            case "createMany":
                await crearMuchos(req, res);
                break;
            case "update":
                await actualizarIngreso(req, res);
                break;
            case "updateMany":
                await actualizarMuchos(req, res);
                break;
            case "delete":
                await eliminarIngreso(req, res);
                break;
            case "deleteMany":
                await eliminarMuchos(req, res);
                break;
            default:
                res.status(500).json({
                    message: "Error al enviar un metodo HTTP"
                });

        }
    } else if (req.method === "GET") {
        await obtenerIngreso(req, res);
    }
}

const crearIngreso = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Ingreso;
    const { coleccion: coleccionNombre, keyId } = coleccion;

    const date: Date = new Date();

    const ingresoServicio: ingresoInterface = req.body.data;
    const nuevoIngreso: ingresoInterface = {
        ...ingresoServicio,
        [keyId]: await generarIdNuevo(coleccion),
        FechaCreacion: date,
        FechaModificacion: date,
    };

    await connectToDatabase().then(async connectedObject => {
        const dbo: Db = connectedObject.db;
        const collection: Collection<any> = dbo.collection(coleccionNombre);
        try {
            const result = await collection.insertOne(nuevoIngreso);
            res.status(200).send(result);
            console.log("Se agrego correctamente el ingreso");
        } catch (err) {
            console.log(`Error - ${err}`);
        }
    });
}

const crearMuchos = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Ingreso;
    const ingresos: ingresoInterface[] = req.body.data;

    await connectToDatabase().then(async connectedObject => {
        try {
            const ultimoIngreso: ingresoInterface | any = await obtenerUltimo(coleccion);
            let ultimoId: string = ultimoIngreso.IdIngreso;
            const ingresosActualizados: ingresoInterface[] = ingresos.map((ingreso: ingresoInterface) => {
                const nuevoId: string = construirId({}, coleccion.prefijo, coleccion.keyId, ultimoId)
                const date: Date = new Date();
                const ingresoActualizado: ingresoInterface = {
                    ...ingreso,
                    [coleccion.keyId]: nuevoId,
                    FechaCreacion: date,
                    FechaModificacion: date
                };
                ultimoId = nuevoId;
                return ingresoActualizado;
            });
            const db: Db = connectedObject.db;
            const collection: Collection<any> = db.collection(coleccion.coleccion);
            await collection.insertMany(ingresosActualizados);
            res.status(200).json({
                message: "Insercion realizada satisfactoriamente"
            });
        } catch (e: any) {
            console.log(e);
            res.status(500).json({
                error: true,
                message: `Error al ingresar varios valores - ${e.message}`
            });
        }

    });

}


const actualizarIngreso = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Ingreso;
    const ingreso: ingresoInterface = req.body.data;
    const ingresoFechaActualizada: ingresoInterface = {
        ...ingreso,
        FechaModificacion: new Date()
    }
    const idIngreso: string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        const dbo: Db = connectedObject.db;
        const collection: Collection<any> = dbo.collection(coleccion.coleccion);
        try {
            collection.updateOne(
                {
                    [coleccion.keyId]: idIngreso,
                },
                {
                    $set: ingresoFechaActualizada
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

const actualizarMuchos = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Ingreso;
    const ingresos = req.body.data;
    ingresos.forEach((elemento: any) => {
        elemento.ingreso.FechaModificacion = new Date();
    });
    await connectToDatabase().then(async connectedObject => {
        const db: Db = connectedObject.db;
        const collection: Collection<any> = db.collection(coleccion.coleccion);
        try {
            ingresos.forEach(async (elemento: any) => {
                const { idProducto, ingreso: ingresoActualizado } = elemento;
                console.log(elemento);
                await collection.updateOne({
                    [coleccion.keyId]: idProducto
                }, {
                    $set: ingresoActualizado
                });
            });
            res.status(200).json({
                message: "Actualizacion satisfactoria"
            });
        } catch (err: any) {
            res.status(500).json({
                error: true,
                message: `Error al actualizar - ${err.message}`
            });
            console.log(err);
        }
    });

}


const eliminarIngreso = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Ingreso;

    const idIngreso: string = req.body.idProducto;
    await connectToDatabase().then(async connectedObject => {
        try {
            const dbo: Db = connectedObject.db;
            const collection: Collection<any> = dbo.collection(coleccion.coleccion);
            await collection.deleteOne(
                {
                    [coleccion.keyId]: idIngreso
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

const eliminarMuchos = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Ingreso;
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

const obtenerIngreso = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.Ingreso;
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
                const dataProcesada = procesarFinanza(data);
                res.status(200).json({ data: dataProcesada });
            } else if (filtro.hasOwnProperty("mes") && filtro.hasOwnProperty("anio")) {
                const { mes, anio } = filtro;
                const fechaInicio: string = `${anio}-${mes}-01`;
                const fechaFinal: string = obtenerMesSiguiente(mes, anio);
                const data = await collection.find({
                    FechaCreacion: {
                        $gte: new Date(fechaInicio),
                        $lte: new Date(fechaFinal)
                    }
                }).toArray();
                const dataProcesada = procesarFinanza(data);

                res.status(200).json({ data : dataProcesada });
            } else {
                const data = await collection.find({}).toArray();
                const dataProcesada = procesarFinanza(data);
                res.status(200).json({ data : dataProcesada });
            }

        } catch (error: any) {
            res.status(500).json({
                error: true,
                message: `Ocurrio un error - ${error.message}`
            });
        }
    });
}

