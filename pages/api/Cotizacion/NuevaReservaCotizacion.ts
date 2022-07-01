import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { generarIdNuevo, obtenerUltimo } from "@/utils/API/generarId";
import { dbColeccionesFormato, servicioEscogidoInterface } from "@/utils/interfaces/db";
import { Collection, Db, MongoError } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const { ReservaCotizacion, ClienteProspecto, ServiciosEscogidos } = req.body;
    if (ReservaCotizacion == undefined || ClienteProspecto == undefined || ServiciosEscogidos == undefined) {
        res.status(500).send("Envie los datos correctamente");
        return;
    }

    if (ClienteProspecto.IdClienteProspecto == undefined || ClienteProspecto.IdClienteProspecto == null) {
        ClienteProspecto.IdClienteProspecto = await generarIdNuevo(dbColeccionesFormato.ClienteProspecto);
        ReservaCotizacion.IdClienteProspecto = ClienteProspecto.IdClienteProspecto;
    }

    ReservaCotizacion.IdReservaCotizacion = await generarIdNuevo(dbColeccionesFormato.ReservaCotizacion);

    try {
        const {
            prefijo,
            coleccion,
            keyId
        } = dbColeccionesFormato.ServicioEscogido;
        const ultimo: servicioEscogidoInterface = await obtenerUltimo(dbColeccionesFormato.ServicioEscogido);
        let idNumero: number = 1;
        if (ultimo && ultimo.IdServicioEscogido) {
            idNumero = +ultimo.IdServicioEscogido.slice(prefijo.length);
            idNumero++;
        }
        ServiciosEscogidos.map((dt: any) => {
            dt.IdReservaCotizacion = ReservaCotizacion.IdReservaCotizacion;
            dt.IdServicioEscogido = `${prefijo}${("0000" + idNumero.toString()).slice(idNumero.toString().length)}`;
            idNumero++;
        });
    } catch (err) {
        console.log(`Error - ${err}`);
    }

    await Promise.all([
        promiseReservaCotizacion(ReservaCotizacion),
        promiseClienteProspecto(ClienteProspecto),
        promiseServicioEscogido(ServiciosEscogidos)
    ]);
    res.status(200).json({
        message: "Insercion satisfactoria"
    });


}

const promiseReservaCotizacion = (reservaCotizacion : any) => new Promise<void>(async (resolve, reject) => {
    delete reservaCotizacion['_id'];
    const coleccion = dbColeccionesFormato.ReservaCotizacion;
    try {
        await connectToDatabase().then(async connectedObject => {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion.coleccion);
            await collection.insertOne(reservaCotizacion, (err : MongoError, res : any) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log(`Numero de documentos insertados: ${res.insertedCount}`);
            });
            resolve();
        });
    } catch (err) {
        console.log(err);
        reject();
    }
})

const promiseClienteProspecto = (clienteProspecto : any) => new Promise<void>(async (resolve, reject) => {
    if (clienteProspecto.TipoCliente == "Directo") {
        const coleccion = dbColeccionesFormato.ClienteProspecto;
        try {
            await connectToDatabase().then(async connectedObject => {
                const db : Db = connectedObject.db;
                const collection : Collection<any> = db.collection(coleccion.coleccion);
                await collection.insertOne(clienteProspecto, (err : MongoError, res : any) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    console.log(`Numero de documentos insertados ${res.insertedCount}`);
                });
                resolve();
            });
        } catch (err) {
            console.log(err);
            reject();
        }
    } else {
        console.log("No es necesario ingresar cliente corporativo");
        resolve();
    }
})

const promiseServicioEscogido = (servicioEscogido : any) => new Promise<void>(async (resolve, reject) => {
    const coleccion = dbColeccionesFormato.ServicioEscogido;
    await connectToDatabase().then(async connectedObject => {
        try {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion.coleccion);
            collection.insertMany(servicioEscogido, (err : MongoError, res : any) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log(`Numero de documentos insertados: ${res.insertedCount}`);
            });
            resolve()
        } catch (err) {
            console.log(err);
            reject();
        }
    });
})
