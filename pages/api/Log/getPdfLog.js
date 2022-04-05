import { connectToDatabase } from "@/utils/API/connectMongo-v2";

import pdfMake from "pdfmake";
import fs from "fs";

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  let DataLog
  try {
    await connectToDatabase().then(async connectedObject => {
      let dbo = connectedObject.db;
      let collection = dbo.collection("Log");
      try {
        DataLog = await collection.find({}).project({ _id: 0 }).toArray();
      } catch (error) {
        console.log("Error - 103");
        console.log("error => " + error);
        res.status(500).json({ error: "Algun error" });
      }
    });
  } catch (error) {
    console.log("Error - 102");
    console.log("error => " + error);
    // res.redirect("/500");
    res.status(500).json({ error: "Algun error" });
  }
  //-------------------------------------------------------------------
  new Promise((resolv, reject) => {
    let docDefinition = {};
    let arrayContent = []
    DataLog.map((x) => {
      arrayContent.push(
        "LogMessage: " + x["LogMessage"],
        "Usuario: " + x["user"],
        "Fecha y Hora: " + x["time"] + "\n\n",
      )
    })
    docDefinition = {
      content: arrayContent,
      defaultStyle: {
        font: "Times"
      }
    };
    createPdfBinary(docDefinition, (binary) => {
      // res.contentType("application/pdf");
      res.send(binary);
    });
    resolv()
  })

  //-------------------------------------------------------------------
  try {
    await connectToDatabase().then(async connectedObject => {
      let dbo = connectedObject.db;
      let collection = dbo.collection("Log");
      try {
        await collection.deleteMany({})
      } catch (error) {
        console.log("Error - 103");
        console.log("error => " + error);
        res.status(500).json({ error: "Algun error" });
      }
    });

  } catch (error) {
    console.log("Error - 102");
    console.log("error => " + error);
    // res.redirect("/500");
    res.status(500).json({ error: "Algun error" });
  }
};

function createPdfBinary(pdfDoc, callback) {
  var fontDescriptors = {
    Times: {
      normal: "Times-Roman",
      bold: "Times-Bold",
      italics: "Times-Italic",
      bolditalics: "Times-BoldItalic"
    }
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
