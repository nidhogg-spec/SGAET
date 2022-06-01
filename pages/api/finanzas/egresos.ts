import { db_connect } from "@/src/db";
import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { egresoInterface, dbColeccionesFormato } from "@/utils/interfaces/db";

const crearEgreso = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    let idNumero : number = 1;
    let [client, collection] = await db_connect(coleccion);
    try {
        const options = {
            sort: {}
        };
        options.sort[keyId] = -1;

        const result = await collection.findOne(
            {},
            options
        );
    }
}