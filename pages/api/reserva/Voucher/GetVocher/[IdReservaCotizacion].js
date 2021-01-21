import { MongoClient } from "mongodb";
require("dotenv").config();
import pdfMake from "pdfmake";
import fs from "fs";

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  const {
    query: { IdReservaCotizacion },
  } = req;
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let ReservaCotizacion;
  try {
    await client.connect();
    let dbo = client.db(dbName);
    let collection = dbo.collection("ReservaCotizacion");
    try {
      ReservaCotizacion = await collection.findOne(
        { IdReservaCotizacion: IdReservaCotizacion },
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
  let docDefinition = {
    content: [
      'NombreGrupo: '+ReservaCotizacion['NombreGrupo'],
      'CodGrupo: '+ReservaCotizacion['CodGrupo'],
      'NpasajerosAdult: '+ReservaCotizacion['NpasajerosAdult'],
      'NpasajerosChild: '+ReservaCotizacion['NpasajerosChild'],
      'FechaOUT: '+ReservaCotizacion['FechaOUT'],
      'Descripcion: '+ReservaCotizacion['Descripcion'],
      'FechaIN: '+ReservaCotizacion['FechaIN'],
      'IdClienteProspecto: '+ReservaCotizacion['IdClienteProspecto'],
      'IdReservaCotizacion: '+ReservaCotizacion['IdReservaCotizacion'],
    //   ': '+ReservaCotizacion[''],
    //   ': '+ReservaCotizacion[''],
    ],
    defaultStyle: {
      font: "Times",
    },
  };
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
