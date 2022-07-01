import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { generarIdNuevo, obtenerUltimo } from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    switch (req.method) {
        case "POST":
            switch (req.body.accion) {
                case "FindSome":
                    await encontrarAlgunos(req, res);
                    break;
                case "FindOne":
                    await encontrarUno(req, res);
                    break;
                case "FindAll":
                    await encontrarTodo(req, res);
                    break;
                case "InsertMany":
                    await insertarMuchos(req, res);
                    break;
                case "Insert":
                    await insertar(req, res);
                    break;
                case "update":
                    await actualizar(req, res);
                    break;
                case "DeleteOne":
                    await eliminarUno(req, res);
                    break;
                case "IdGenerator":
                    await idGenerator(req, res);
                    break;
                default:
                    res.status(500).json({
                        message: "Error - accion incorrecta"
                    });
                    break;
            }
            break;
        default:
            res.status(500).json({
                message: "Error - metodo HTTP incorrecto"
            });
            break;
    }
}

const encontrarAlgunos = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    await connectToDatabase().then(async connectedObject => {
        const { coleccion, keyId, dataFound, projection } = req.body;
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion);
        const query : any = {
            $or: []
        };
        let x : any = {};
        dataFound.map((data : any) => {
            x = {};
            x[keyId] = data;
            query.$or.push(x);
        });
        console.log(query);
        collection.find(
            query,
            {
                projection
            }
        ).toArray((err, result) => {
            if (err) {
                throw err;
            }
            res.status(200).json({ result });
        });
    });
}

const encontrarUno = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const { coleccion, dataFound, projection, keyId } = req.body;
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion);
        const query = {
            [keyId]: dataFound
        };
        console.log(query);
        const result : any[] = await collection.findOne(
            query,
            {
                projection
            }
        );
        res.status(200).json({ result });
    });
}

const encontrarTodo = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const { coleccion, projection } = req.body;
    try {
        await connectToDatabase().then(async connectedObject => {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion);
            collection.find(
                {},
                {
                    projection
                }
            ).toArray((err, result) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({ result });
            });
        })
    } catch (err) {
        console.log(err);
    }
}


const insertarMuchos = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    let idNumero : number = 1;
    const { coleccion, keyId, Prefijo } = req.body;
    let { data } = req.body;
    try {
        await connectToDatabase().then(async connectedObject => {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion)
            const ultimo : any = obtenerUltimo(coleccion);
            if (ultimo && ultimo[keyId as keyof typeof ultimo]) {
                idNumero = +ultimo[keyId as keyof typeof ultimo].slice(Prefijo.length);
                idNumero++;
            }
            let dt_sinId = [...data];
            dt_sinId.map((dt : any) => {
                dt[keyId] =  `${Prefijo}${("00000" + idNumero.toString()).slice(idNumero.toString().length)}`;
                idNumero++;
            });
            data = dt_sinId;

            collection.insertMany(data, (err, res) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log(`Numero de documentos insertados: ${res.insertedCount}`);
            });
            res.status(200).json({
                result: "Insercion realizada"
            });
        });
    } catch (err) {
        console.log(err);
    }
}

const insertar = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const { keyId, coleccion, Prefijo, data } = req.body;
    try {
        await connectToDatabase().then(async connectedObject => {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion);
            const dbColeccion = {
                prefijo: Prefijo,
                coleccion,
                keyId
            };
            data[keyId] = await generarIdNuevo(dbColeccion);
            collection.insertOne(data, (err, result) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log(`Numero de documentos insertados ${result.insertedCount}`);
            });
            res.status(200).json({
                result: "Insercion realizada"
            });
        });

    } catch (err) {
        console.log(err);
    }
}

const actualizar = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const { coleccion, data, query } = req.body;
    try {
        await connectToDatabase().then(async connectedObject => {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion);
            await collection.updateOne(
                query,
                {
                    $set: data
                }, (err, result) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    console.log("Actualizado");
                }
            );
            res.status(200).json({
                result: "Actualizacion realizada"
            });
        });
    } catch (err) {
        console.log(err);
    }
}

const eliminarUno = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const { coleccion, query } = req.body;
    try {
        await connectToDatabase().then(async connectedObject => {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccion);
            await collection.deleteOne(
                query,
                (err, res) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    console.log("eliminacion correctamente");
                }
            );
        });
        res.status(200).json({
            result: "Eliminacion correctamente"
        });
    } catch (err) {
        console.log(err);
    }
}

const idGenerator = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const { coleccion, keyId, Prefijo } = req.body;
    try {
        const dbColeccion = {
            prefijo: Prefijo,
            coleccion,
            keyId
        };
        res.status(200).json({
            result: await generarIdNuevo(dbColeccion)
        });

    } catch (err) {
        console.log(`Error al devolver el ID - ${err}`);
    }
}