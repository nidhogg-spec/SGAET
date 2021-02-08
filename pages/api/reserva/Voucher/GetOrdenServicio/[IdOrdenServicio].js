import { MongoClient } from "mongodb";
require("dotenv").config();
import pdfMake from "pdfmake";
import fs from "fs";

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  const {
    query: { IdOrdenServicio },
  } = req;
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let   OrdenServicio;
  try {
    await client.connect();
    let dbo = client.db(dbName);
    let collection = dbo.collection("OrdenServicio");
    try {
        OrdenServicio = await collection.findOne(
        { IdOrdenServicio: IdOrdenServicio },
        { projection: { _id: 0 } }
      );
    } catch (error) {
      console.log("Error - 103");
      console.log("error => " + error);
      res.status(500).json({ error: "Algun error" });
    }
  } catch (error) {
    console.log("Error - 102");
    console.log("error => " + error);
    // res.redirect("/500");
    res.status(500).json({ error: "Algun error" });
  } finally {
    client.close();
  }
  //-------------------------------------------------------------------
  let docDefinition = {}
  switch(OrdenServicio.TipoOrdenServicio){
    case "A":
      docDefinition = {
        content: [
          'Codigo Orden de Servicio: '+OrdenServicio['CodigoOrdenServ'],
          'Codigo de Grupo: '+OrdenServicio['CodGrupo'],
          'Tour: '+OrdenServicio['Tour'],
          'Guia: '+OrdenServicio['Guia'],
          'Asistente: '+OrdenServicio['Asistente'],
          'Fecha: '+OrdenServicio['Fecha'],
          
          'N° Pax: '+OrdenServicio['NumPax'],
          'N° Porters: '+OrdenServicio['NumPorters'],
          'Transporte: '+OrdenServicio['Trasnporte'],
          'Grupo Nombre: '+OrdenServicio['NomGrupo'],
          'Anexo: ' +OrdenServicio['Anexo'],
          'Ingreso: '+OrdenServicio['Ingreso'],
          'N° Box Lunch: '+OrdenServicio['BoxLunch'],
          'N° Botiquin: '+OrdenServicio['Nbotiquin'],
          'N° Primeros Auxilios: '+OrdenServicio['NprimerosAuxilios'],
          'Imprevistos(S/.): '+OrdenServicio['ImprevistosSoles'],
          'Imprevistos(US $): '+OrdenServicio['ImprevistosDolares'],
        ],
        defaultStyle: {
          font: "Times",
        },
      };
      break;
    case "B":
      docDefinition = {
        content: [
          'Codigo de Grupo: '+OrdenServicio['CodGrupo'],
          'Trekking: '+OrdenServicio['trekking'],
          'Fecha: '+OrdenServicio['Fecha'],
          'N° Pax: '+OrdenServicio['Fecha'],
          'Guia: '+OrdenServicio['Guia'],
          'Asistente: '+OrdenServicio['Asistente'],
          'Cocinero: '+OrdenServicio['Cocinero'],
          'Transporte: '+OrdenServicio['Trasnporte'],
          'Grupo Nombre: '+OrdenServicio['NomGrupo'],
          'Anexo: ' +OrdenServicio['Anexo'],
          'PTO. de Ingreso: : '+OrdenServicio['PuntoIngreso'],
          'Oxigeno: '+OrdenServicio['Oxigeno'],
          'N° Botiquin: '+OrdenServicio['NumBotiquin'],
          'Imprevistos(S/.): '+OrdenServicio['ImprevistosSoles'],
          'Imprevistos(US $): '+OrdenServicio['ImprevistosDolares'],
          'N° Porters: '+OrdenServicio['NumPorters'],
          'N° Porters Extra: '+OrdenServicio['NumPortersExtra'],
          'N° Arrieros: '+OrdenServicio['NumaArrieros'],
          'N° Caballos Carga: '+OrdenServicio['NumCaballoCarga'],
          'N° Caballos Silla: ' +OrdenServicio['NumCaballoSilla'],
          'Campamento 1er Dia: '+OrdenServicio['CampoPrimerDia'],
          'Campamento 2do Dia: '+OrdenServicio['CampoSegunDia'],
          'Campamento 3er Dia: '+OrdenServicio['CampoTercerDia'],
          'Campamento 4to Dia: '+OrdenServicio['CampoCuartoDia'],
          'Carpas Dobles: '+OrdenServicio['NumCarpaDobles'],
          'Carpas Simples: ' +OrdenServicio['NumCarpaSimples'],
          'Carpas Triple: : '+OrdenServicio['NumCarpaTriple'],
          'Matras Simples: '+OrdenServicio['NumMatrasSimples'],
          'Matras Infables: '+OrdenServicio['NumMatrasInfables'],
          'Sleeping Sinteticos: '+OrdenServicio['NumSleepingSinteticos'],
          'Sleeping Plumas: '+OrdenServicio['ImprevistosDolares'],
          'Bastones '+OrdenServicio['NumBastones'],
          'Duffel: '+OrdenServicio['NumDuffel'],
          'Carpa Guia: '+OrdenServicio['CarpaGuia'],
          'Carpa Comedor: '+OrdenServicio['CarpaComedor'],
          'Carpa Cocina: ' +OrdenServicio['CarpaCocina'],
          'Carpa Baño: '+OrdenServicio['CarpaBaño'],
          'Bolsas Biodegradables: '+OrdenServicio['BolsasBiodegradables'],
          'Oxigeno: '+OrdenServicio['Oxigeno'],
          'Botiquin: '+OrdenServicio['Botiquin'],
          'Otros'+OrdenServicio['Otros'],
        ],
        defaultStyle: {
          font: "Times",
        },
      };
      break;
    case "C":
      docDefinition = {
        content: [
          'Empresa: '+OrdenServicio['Empresa'],
          'Codigo de Grupo: '+OrdenServicio['CodGrupo'],
          'Tour: '+OrdenServicio['Tour'],
          'N° Pax: '+OrdenServicio['NumPax'],
          'Tipo de Tranporte: '+OrdenServicio['TipoTranporte'],
          'Capacidad: '+OrdenServicio['Capacidad'],
          'Fecha IN: '+OrdenServicio['FechaIn'],
          'Fecha OUT: '+OrdenServicio['FechaOut'],
          'Tabla Pasajero: ',
          'Tabla Trasnporte: ',
        ],
        defaultStyle: {
          font: "Times",
        },
      };
      break;
    case "D":
      docDefinition = {
        content: [
          'CodigoOrdenServicio: '+OrdenServicio['CodigoOrdenServicio'],
          'Para: '+OrdenServicio['Empresa'],
          'Direccion: '+OrdenServicio['Direccion'],
          'Telefono: '+OrdenServicio['Telefono'],
          'N° Paxs: '+OrdenServicio['NumPax'],
          'Idioma: '+OrdenServicio['Idioma'],
          'A Nombre de PAX: '+OrdenServicio['Pax'],
          'Detalle de Servicio: '+OrdenServicio['NombreServicio'],
          'Fecha: '+OrdenServicio['FechaReserva'],
          'Observaciones: '+OrdenServicio['Observaciones'],
        ],
        defaultStyle: {
          font: "Times",
        },
      };
      break;
  }
  createPdfBinary(docDefinition, (binary) => {
    // res.contentType("application/pdf");
    res.send(binary);
  });
  //-------------------------------------------------------------------
};

function createPdfBinary(pdfDoc, callback) {
  var fontDescriptors = {
    Times: {
      normal: "Times-Roman",
      bold: "Times-Bold",
      italics: "Times-Italic",
      bolditalics: "Times-BoldItalic",
    },
  };

  var printer = new pdfMake(fontDescriptors);

  var doc = printer.createPdfKitDocument(pdfDoc);

  var chunks = [];
  var result;

  doc.on("data", function (chunk) {
    chunks.push(chunk);
  });
  doc.on("end", function () {
    result = Buffer.concat(chunks);
    // callback("data:application/pdf;base64," + result.toString("base64"));
    callback(result.toString("base64"));
  });
  doc.end();
}
