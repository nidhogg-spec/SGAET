import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { ordenServicioInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { generarIdNuevo } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";


export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
    if (req.method === "POST") {
        switch (req.body.accion) {
            case "create":
                await crearOrdenServicioA(req, res);
                break;
        }
    } else if (req.method === "GET") {
        await obtenerOrdenServicioA(req, res);
    }

}

const obtenerOrdenServicioA = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    await connectToDatabase().then(async connectedObject => {
        const dbo: Db = connectedObject.db;
        obtenerOrdenServicioACallback(dbo, (err: any, data: any) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Ocurrio un error al listar"
                });
                return;
            }
            res.status(200).json({ data });
        });
    })
}

const obtenerOrdenServicioACallback = async (dbo: Db, callback: any) => {
    const coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.OrdenServicio;
    const { coleccion: coleccionNombre }: { coleccion: string } = coleccion;
    const collection: Collection<any> = dbo.collection(coleccionNombre);
    collection.find({}).toArray(callback);
}


const crearOrdenServicioA = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.OrdenServicio;
    const { coleccion: coleccionNombre, keyId } = coleccion;
    const ordenServicioA: ordenServicioInterface = req.body.data;
    const nuevoOrdenServicioA: ordenServicioInterface = {
        ...ordenServicioA,
        [keyId]: await generarIdNuevo(coleccion)
    };

    await connectToDatabase().then(async connectedObject => {
        const dbo: Db = connectedObject.db;
        const collection: Collection<any> = dbo.collection(coleccionNombre);
        const result = await collection.find({}).project({ "_id": 0 }).toArray();

        const idReq: string = req.body.data.IdServicioEscogido;
        try {
            
            for (let i = 0; i <= result.length; i++) {
    
                if (!result.length) {
                    collection.insertOne(nuevoOrdenServicioA, (err, result) => {
                        if (err) {
                            console.log(err);
                            throw err;
                        }
                        console.log("Se agrego correctamente");
                    });
                } else if (result[i].IdServicioEscogido === idReq) {
                    console.log("Ya existe una orden de servicio");
                    break;
                } else if (result[i].IdServicioEscogido != idReq && result.length - 1) {
                    collection.insertOne(nuevoOrdenServicioA, (err, res) => {
                        if (err) {
                            console.log(err);
                            throw err;
                        }
                        console.log("Se agrego correctamente");
                    });
                }
                console.log("Se agrego correctamente");
    
            }
        } catch (err) {
            console.log(`Error - ${err}`);
        }


    });
}
