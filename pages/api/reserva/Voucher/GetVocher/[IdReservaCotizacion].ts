import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { dbColeccionesFormato } from "@/utils/interfaces/db";
import { Collection, Db } from "mongodb";

import pdfMake from "pdfmake";

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const { query: { IdReservaCotizacion } } = req;
    const reservaCotizacion : any = await encontrarReservaCotizacion(req, res, IdReservaCotizacion);
    const docDefinition = definicionDoc(reservaCotizacion);
    createPdfBinary(docDefinition, (binary : any) => {
        res.send(binary);
    });

}

const encontrarReservaCotizacion = async (req: NextApiRequest, res: NextApiResponse<any>, IdReservaCotizacion : string | Array<string>) => {
    const coleccion: {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ReservaCotizacion;
    let reservaCotizacion;
    try {
        await connectToDatabase().then(async connectedObject => {
            const db: Db = connectedObject.db;
            const collection: Collection<any> = db.collection(coleccion.coleccion);

            try {
                reservaCotizacion = await collection.findOne(
                    {
                        IdReservaCotizacion
                    },
                    {
                        projection: { _id: 0 }
                    }
                );
            } catch (err) {
                console.log("Error - 103");
                console.log(`Error => ${err}`);
                res.status(500).json({ error: "Ocurrio un error " });
            }

        });
    } catch (err) {
        console.log("Error - 102");
        console.log(`Error => ${err}`);
        res.status(500).json({ error: "Ocurrio un error " });
    }
    return reservaCotizacion;
}

const createPdfBinary = async (pdfDoc: any, callback: any) => {
    const fontDescriptors = {
        Times: {
            normal: "Times-Roman",
            bold: "Times-Bold",
            italics: "Times-Italic",
            bolditalics: "Times-Bolditalic"
        }
    };
    const printer: pdfMake = new pdfMake(fontDescriptors);
    const doc: PDFKit.PDFDocument = printer.createPdfKitDocument(pdfDoc);
    const chunks: Uint8Array[] = [];
    let result;
    doc.on("data", chunk => {
        chunks.push(chunk);
    });
    doc.on("end", () => {
        result = Buffer.concat(chunks);
        callback(result.toString("base64"));
    });
    doc.end();
}

const definicionDoc = (ReservaCotizacion : any) => (
    {
        content: [
            'NombreGrupo: ' + ReservaCotizacion['NombreGrupo'],
            'CodGrupo: ' + ReservaCotizacion['CodGrupo'],
            'NpasajerosAdult: ' + ReservaCotizacion['NpasajerosAdult'],
            'NpasajerosChild: ' + ReservaCotizacion['NpasajerosChild'],
            'FechaOUT: ' + ReservaCotizacion['FechaOUT'],
            'Descripcion: ' + ReservaCotizacion['Descripcion'],
            'FechaIN: ' + ReservaCotizacion['FechaIN'],
            'IdClienteProspecto: ' + ReservaCotizacion['IdClienteProspecto'],
            'IdReservaCotizacion: ' + ReservaCotizacion['IdReservaCotizacion'],
            //   ': '+ReservaCotizacion[''],
            //   ': '+ReservaCotizacion[''],
        ],
        defaultStyle: {
            font: "Times",
        }
    }
);