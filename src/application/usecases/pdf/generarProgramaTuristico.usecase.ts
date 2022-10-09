import { ProgramaTuristicoRepository } from "@/src/adapters/repository/programaTuristico.repository";
import {
  dbColeccionesFormato,
  programaTuristicoInterface
} from "@/utils/interfaces/db";
import { NextApiRequest, NextApiResponse } from "next";
import pdfMake from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";

export class PdfProgramaTuristicoUsecase {
  programaTuristicoRepository: ProgramaTuristicoRepository;
  coleccion: { prefijo: string; coleccion: string; keyId: string };
  constructor() {
    this.programaTuristicoRepository = new ProgramaTuristicoRepository();
    this.coleccion = dbColeccionesFormato.ProgramaTuristico;
  }

  async generate(
    IdProgramaTuristico: string
  ): Promise<[pdfBase64: string | null, err: Error | null]> {
    const [programaTuristico, errorDB] = await this.encontrarProgramaTuristico(
      IdProgramaTuristico
    );
    if (errorDB) return [null, errorDB];
    if (programaTuristico == null) return [null, new Error("reserva is empty")];
    const docDefinition = this.definicionDoc(programaTuristico);
    const [pdfBinary, err] = await this.createPdfBinary(docDefinition);
    if (err)
      return [
        "",
        new Error(
          "error generating pdf of reservacotizacion " + IdProgramaTuristico
        )
      ];
    return [pdfBinary, null];
  }

  async encontrarProgramaTuristico(
    IdProgramaTuristico: string
  ): Promise<
    [programaTuristico: programaTuristicoInterface | null, err: Error | null]
  > {
    let programaTuristico;
    try {
      const result = await this.programaTuristicoRepository.findWithFilters({
        IdProgramaTuristico
      });
      return [result[0], null];
    } catch (err) {
      return [null, new Error("Error - 102 - ${err}")];
    }
    return [programaTuristico, null];
  }

  async createPdfBinary(
    pdfDoc: any
  ): Promise<[pdfBase64: string, err: Error | null]> {
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
    let result: Buffer;
    result = await new Promise((res, rej) => {
      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });
      doc.on("end", () => {
        result = Buffer.concat(chunks);
        res(result);
      });
      doc.end();
    });

    return [result.toString("base64"), null];
  }

  definicionDoc(
    ProgramaTuristico: programaTuristicoInterface
  ): TDocumentDefinitions {
    //data de tabla de lista de servicios
    let data_lista_servicios = [
      ["Nro.", "Nombre de Servicio", "Precio de Cotizacion Total", "Currency"]
    ];

    ProgramaTuristico.ServicioProducto.forEach((x, i) => {
      data_lista_servicios.push([
        (i + 1).toString(),
        x.NombreServicio,
        x.PrecioCotiTotal.toString(),
        x.Currency
      ]);
    });

    //data de tabla de lista de pasajeros
    let data_lista_recomendaciones = [["Nro.", "Recomendacion"]];
    ProgramaTuristico.RecomendacionesLlevar?.forEach((x, i) => {
      data_lista_recomendaciones.push([(i + 1).toString(), x.Recomendacion]);
    });

    //data de tabla de lista de incluye
    let data_lista_incluye = [["Nro.", "Actividad"]];
    ProgramaTuristico.Incluye.forEach((x, i) => {
      data_lista_incluye.push([(i + 1).toString(), x.Actividad]);
    });

    //data de tabla de lista de no incluye
    let data_lista_no_incluye = [["Nro.", "Actividad"]];
    ProgramaTuristico.NoIncluye.forEach((x, i) => {
      data_lista_no_incluye.push([(i + 1).toString(), x.Actividad]);
    });
    return {
      content: [
        {
          text:
            "Informacion de reserva" +
            (ProgramaTuristico["NombrePrograma"]
              ? " - " + ProgramaTuristico["NombrePrograma"]
              : ""),
          style: "header",
          color: "black",
          alignment: "center",
          bold: true,
          fontSize: 18,
          margin: [0, 0, 0, 20]
        },
        {
          text: "Datos principales de reserva",
          style: "subheader",
          bold: true
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1
            }
          ],
          style: "line",
          color: "gray",
          margin: [0, 5, 0, 15]
        },
        {
          table: {
            headerRows: 1,
            widths: [200, "*"],
            body: [
              [
                { text: "Codigo de programa turistico", bold: true },
                ProgramaTuristico.CodigoPrograma
              ],
              [
                { text: "Nombre de programa turistico", bold: true },
                ProgramaTuristico.NombrePrograma
              ],
              [
                { text: "Duracion en dias", bold: true },
                ProgramaTuristico.DuracionDias
              ],
              [
                { text: "Localizacion", bold: true },
                ProgramaTuristico.Localizacion
              ],
              [
                { text: "Tipo de progra turistico", bold: true },
                ProgramaTuristico.Tipo
              ]
            ]
          },
          layout: "noBorders",
          margin: [15, 0, 0, 15]
        },
        {
          text: "Descripcion",
          style: "subheader",
          bold: true
        },
        {
          text: ProgramaTuristico.Descripcion,
          alignment: "justify"
        },
        {
          text: "Servicios contratados",
          style: "subheader",
          bold: true
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1
            }
          ],
          style: "line",
          color: "gray",
          margin: [0, 5, 0, 15]
        },
        {
          table: {
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            headerRows: 1,
            widths: [30, 120, 120, 120, 120],
            body: data_lista_servicios
          },
          margin: [0, 0, 0, 15]
        },
        {
          text: "Incluye",
          style: "subheader",
          bold: true
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1
            }
          ],
          style: "line",
          color: "gray",
          margin: [0, 5, 0, 15]
        },
        {
          table: {
            headerRows: 1,
            widths: [30, "*"],
            body: data_lista_incluye
          },
          margin: [0, 0, 0, 15]
        },
        {
          text: "No incluye",
          style: "subheader",
          bold: true
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1
            }
          ],
          style: "line",
          color: "gray",
          margin: [0, 5, 0, 15]
        },
        {
          table: {
            headerRows: 1,
            widths: [30, "*"],
            body: data_lista_no_incluye
          },
          margin: [0, 0, 0, 15]
        },
        {
          text: "Recomendaciones",
          style: "subheader",
          bold: true
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1
            }
          ],
          style: "line",
          color: "gray",
          margin: [0, 5, 0, 15]
        },
        {
          table: {
            headerRows: 1,
            widths: [30, "*"],
            body: data_lista_recomendaciones
          },
          margin: [0, 0, 0, 15]
        }
      ],
      defaultStyle: {
        font: "Times"
      }
    };
  }
}
