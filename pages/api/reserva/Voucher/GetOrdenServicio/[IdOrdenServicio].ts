import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { dbColeccionesFormato } from "@/utils/interfaces/db";
import { Collection, Db } from "mongodb";

import pdfMake from "pdfmake";

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const {
    query: { IdOrdenServicio }
  } = req;
  const ordenServicio: any = await encontrarOrdenServicio(
    req,
    res,
    IdOrdenServicio as string | string[]
  );
  let docDefinition = {};
  switch (ordenServicio.TipoOrdenServicio) {
    case "A":
      docDefinition = definicionA(ordenServicio);
      break;
    case "B":
      docDefinition = definicionB(ordenServicio);
      break;
    case "C":
      docDefinition = definicionC(ordenServicio);
      break;
    case "D":
      docDefinition = definicionD(ordenServicio);
      break;
  }
  createPdfBinary(docDefinition, (binary: any) => {
    res.send(binary);
  });
};

const encontrarOrdenServicio = async (
  req: NextApiRequest,
  res: NextApiResponse<any>,
  IdOrdenServicio: string | Array<string>
) => {
  const coleccion: {
    prefijo: string;
    coleccion: string;
    keyId: string;
  } = dbColeccionesFormato.OrdenServicio;
  let ordenServicio;
  try {
    await connectToDatabase().then(async (connectedObject) => {
      const db: Db = connectedObject.db;
      const collection: Collection<any> = db.collection(coleccion.coleccion);
      try {
        ordenServicio = await collection.findOne(
          {
            IdOrdenServicio
          },
          {
            projection: { _id: 0 }
          }
        );
      } catch (err) {
        console.log("Error - 103");
        console.log(`Error => ${err}`);
        res.status(500).json({ error: "Ocurrio un error" });
      }
    });
  } catch (err) {
    console.log("Error - 102");
    console.log(`Error - Obtener cambios dolar => ${err}`);
    res.status(500).json({ error: "Ocurrio un error" });
  }
  return ordenServicio;
};

const definicionA = (OrdenServicio: any) => ({
  content: [
    "Codigo Orden de Servicio: " + OrdenServicio["CodigoOrdenServ"],
    "Codigo de Grupo: " + OrdenServicio["CodGrupo"],
    "Tour: " + OrdenServicio["Tour"],
    "Guia: " + OrdenServicio["Guia"],
    "Asistente: " + OrdenServicio["Asistente"],
    "Fecha: " + OrdenServicio["Fecha"],

    "N° Pax: " + OrdenServicio["NumPax"],
    "N° Porters: " + OrdenServicio["NumPorters"],
    "Transporte: " + OrdenServicio["Trasnporte"],
    "Grupo Nombre: " + OrdenServicio["NomGrupo"],
    "Anexo: " + OrdenServicio["Anexo"],
    "Ingreso: " + OrdenServicio["Ingreso"],
    "N° Box Lunch: " + OrdenServicio["BoxLunch"],
    "N° Botiquin: " + OrdenServicio["Nbotiquin"],
    "N° Primeros Auxilios: " + OrdenServicio["NprimerosAuxilios"],
    "Imprevistos(S/.): " + OrdenServicio["ImprevistosSoles"],
    "Imprevistos(US $): " + OrdenServicio["ImprevistosDolares"]
  ],
  defaultStyle: {
    font: "Times"
  }
});

const definicionB = (OrdenServicio: any) => ({
  content: [
    "Codigo de Grupo: " + OrdenServicio["CodGrupo"],
    "Trekking: " + OrdenServicio["trekking"],
    "Fecha: " + OrdenServicio["Fecha"],
    "N° Pax: " + OrdenServicio["Fecha"],
    "Guia: " + OrdenServicio["Guia"],
    "Asistente: " + OrdenServicio["Asistente"],
    "Cocinero: " + OrdenServicio["Cocinero"],
    "Transporte: " + OrdenServicio["Trasnporte"],
    "Grupo Nombre: " + OrdenServicio["NomGrupo"],
    "Anexo: " + OrdenServicio["Anexo"],
    "PTO. de Ingreso: : " + OrdenServicio["PuntoIngreso"],
    "Oxigeno: " + OrdenServicio["Oxigeno"],
    "N° Botiquin: " + OrdenServicio["NumBotiquin"],
    "Imprevistos(S/.): " + OrdenServicio["ImprevistosSoles"],
    "Imprevistos(US $): " + OrdenServicio["ImprevistosDolares"],
    "N° Porters: " + OrdenServicio["NumPorters"],
    "N° Porters Extra: " + OrdenServicio["NumPortersExtra"],
    "N° Arrieros: " + OrdenServicio["NumaArrieros"],
    "N° Caballos Carga: " + OrdenServicio["NumCaballoCarga"],
    "N° Caballos Silla: " + OrdenServicio["NumCaballoSilla"],
    "Campamento 1er Dia: " + OrdenServicio["CampoPrimerDia"],
    "Campamento 2do Dia: " + OrdenServicio["CampoSegunDia"],
    "Campamento 3er Dia: " + OrdenServicio["CampoTercerDia"],
    "Campamento 4to Dia: " + OrdenServicio["CampoCuartoDia"],
    "Carpas Dobles: " + OrdenServicio["NumCarpaDobles"],
    "Carpas Simples: " + OrdenServicio["NumCarpaSimples"],
    "Carpas Triple: : " + OrdenServicio["NumCarpaTriple"],
    "Matras Simples: " + OrdenServicio["NumMatrasSimples"],
    "Matras Infables: " + OrdenServicio["NumMatrasInfables"],
    "Sleeping Sinteticos: " + OrdenServicio["NumSleepingSinteticos"],
    "Sleeping Plumas: " + OrdenServicio["ImprevistosDolares"],
    "Bastones " + OrdenServicio["NumBastones"],
    "Duffel: " + OrdenServicio["NumDuffel"],
    "Carpa Guia: " + OrdenServicio["CarpaGuia"],
    "Carpa Comedor: " + OrdenServicio["CarpaComedor"],
    "Carpa Cocina: " + OrdenServicio["CarpaCocina"],
    "Carpa Baño: " + OrdenServicio["CarpaBaño"],
    "Bolsas Biodegradables: " + OrdenServicio["BolsasBiodegradables"],
    "Oxigeno: " + OrdenServicio["Oxigeno"],
    "Botiquin: " + OrdenServicio["Botiquin"],
    "Otros" + OrdenServicio["Otros"]
  ],
  defaultStyle: {
    font: "Times"
  }
});

const definicionC = (OrdenServicio: any) => ({
  content: [
    "Empresa: " + OrdenServicio["Empresa"],
    "Codigo de Grupo: " + OrdenServicio["CodGrupo"],
    "Tour: " + OrdenServicio["Tour"],
    "N° Pax: " + OrdenServicio["NumPax"],
    "Tipo de Tranporte: " + OrdenServicio["TipoTranporte"],
    "Capacidad: " + OrdenServicio["Capacidad"],
    "Fecha IN: " + OrdenServicio["FechaIn"],
    "Fecha OUT: " + OrdenServicio["FechaOut"],
    "Tabla Pasajero: ",
    "Tabla Trasnporte: "
  ],
  defaultStyle: {
    font: "Times"
  }
});

const definicionD = (OrdenServicio: any) => ({
  content: [
    "CodigoOrdenServicio: " + OrdenServicio["CodigoOrdenServicio"],
    "Para: " + OrdenServicio["Empresa"],
    "Direccion: " + OrdenServicio["Direccion"],
    "Telefono: " + OrdenServicio["Telefono"],
    "N° Paxs: " + OrdenServicio["NumPax"],
    "Idioma: " + OrdenServicio["Idioma"],
    "A Nombre de PAX: " + OrdenServicio["Pax"],
    "Detalle de Servicio: " + OrdenServicio["NombreServicio"],
    "Fecha: " + OrdenServicio["FechaReserva"],
    "Observaciones: " + OrdenServicio["Observaciones"]
  ],
  defaultStyle: {
    font: "Times"
  }
});

const createPdfBinary = (pdfDoc: any, callback: any) => {
  const fontDescriptors = {
    Times: {
      normal: "Times-Roman",
      bold: "Times-Bold",
      italics: "Times-Italic",
      bolditalics: "Times-BoldItalic"
    }
  };
  const printer: pdfMake = new pdfMake(fontDescriptors);
  const doc: PDFKit.PDFDocument = printer.createPdfKitDocument(pdfDoc);
  const chunks: Uint8Array[] = [];
  let result;
  doc.on("data", (chunk) => {
    chunks.push(chunk);
  });
  doc.on("end", () => {
    result = Buffer.concat(chunks);
    callback(result.toString("base64"));
  });
  doc.end();
};
