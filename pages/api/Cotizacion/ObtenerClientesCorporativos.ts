import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { Collection, Db } from "mongodb";

export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : string = "ClienteProspecto";
    let DatosClientesCorporativos : any = [];
    try {
        await connectToDatabase().then(async connectedObject => {
            const dbo : Db = connectedObject.db;
            const collection : Collection<any> = dbo.collection(coleccion);
            const resultClienteCorporativo = await collection.find({}).project({
                _id: 0
            }).toArray();
            resultClienteCorporativo.map(cliente => {
                if (cliente.TipoCliente == "Corporativo") {
                    DatosClientesCorporativos.push(cliente);
                }
            });
            res.status(200).json({
                data: DatosClientesCorporativos
            });
        });
    } catch (err) {
        console.log(`Error - ${err}`);
        res.status(500).send("No hubo resultados");
    }
}