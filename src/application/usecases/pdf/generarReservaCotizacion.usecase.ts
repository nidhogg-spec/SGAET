import { ReservaCotizacionRepository } from "@/src/adapters/repository/reservaCotizacion.repository";
import {
  dbColeccionesFormato,
  reservaCotizacionInterface
} from "@/utils/interfaces/db";
import { NextApiRequest, NextApiResponse } from "next";
import pdfMake from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";

export class PdfReservaCotizacionUsecase {
  reservaCotizacionRepository: ReservaCotizacionRepository;
  coleccion: { prefijo: string; coleccion: string; keyId: string };
  constructor() {
    this.reservaCotizacionRepository = new ReservaCotizacionRepository();
    this.coleccion = dbColeccionesFormato.ReservaCotizacion;
  }

  async generate(
    IdReservaCotizacion: string
  ): Promise<[pdfBase64: string | null, err: Error | null]> {
    const [reservaCotizacion, errorDB] = await this.encontrarReservaCotizacion(
      IdReservaCotizacion
    );
    if (errorDB) return [null, errorDB];
    if (reservaCotizacion == null) return [null, new Error("reserva is empty")];
    const docDefinition = this.definicionDoc(reservaCotizacion);
    const [pdfBinary, err] = await this.createPdfBinary(docDefinition);
    if (err)
      return [
        "",
        new Error(
          "error generating pdf of reservacotizacion " + IdReservaCotizacion
        )
      ];
    return [pdfBinary, null];
  }

  async encontrarReservaCotizacion(
    IdReservaCotizacion: string
  ): Promise<
    [reservaCotizacion: reservaCotizacionInterface | null, err: Error | null]
  > {
    let reservaCotizacion;
    try {
      const result = await this.reservaCotizacionRepository.findWithFilters({
        IdReservaCotizacion
      });
      return [result[0], null];
    } catch (err) {
      return [null, new Error("Error - 102 - ${err}")];
    }
    return [reservaCotizacion, null];
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
    ReservaCotizacion: reservaCotizacionInterface
  ): TDocumentDefinitions {
    //data de tabla de lista de servicios
    let data_lista_servicios = [
      [
        "Nro.",
        "Nombre de Servicio",
        "Precio de Cotizacion Total",
        "Currency",
        "Fecha de Reserva"
      ]
    ];

    ReservaCotizacion.ServicioProducto.forEach((x, i) => {
      data_lista_servicios.push([
        (i + 1).toString(),
        x.NombreServicio,
        x.PrecioCotiTotal.toString(),
        x.Currency,
        x.FechaReserva
      ]);
    });

    //data de tabla de lista de pasajeros
    let data_lista_pasajeros = [
      [
        "Nro.",
        "Nombres",
        "Apellidos",
        "Email",
        "Tipo de Documento",
        "Nro Documento",
        "Sexo"
      ]
    ];
    ReservaCotizacion.ListaPasajeros?.forEach((x, i) => {
      data_lista_pasajeros.push([
        (i + 1).toString(),
        x.Nombres,
        x.Apellidos,
        x.Email,
        x.TipoDocumento,
        x.NroDocumento,
        x.Sexo
      ]);
    });

    //data de tabla de lista de pasajeros
    let data_lista_recomendaciones = [["Nro.", "Recomendacion"]];
    ReservaCotizacion.RecomendacionesLlevar?.forEach((x, i) => {
      data_lista_recomendaciones.push([(i + 1).toString(), x.Recomendacion]);
    });

    //data de tabla de lista de incluye
    let data_lista_incluye = [["Nro.", "Actividad"]];
    ReservaCotizacion.Incluye.forEach((x, i) => {
      data_lista_incluye.push([(i + 1).toString(), x.Actividad]);
    });

    //data de tabla de lista de no incluye
    let data_lista_no_incluye = [["Nro.", "Actividad"]];
    ReservaCotizacion.NoIncluye.forEach((x, i) => {
      data_lista_no_incluye.push([(i + 1).toString(), x.Actividad]);
    });
    return {
      content: [
        {
          text:
            "Informacion de reserva" +
            (ReservaCotizacion["CodGrupo"]
              ? " - " + ReservaCotizacion["CodGrupo"]
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
                { text: "Codigo de grupo", bold: true },
                ReservaCotizacion.CodGrupo
              ],
              [
                { text: "Nombre de grupo", bold: true },
                ReservaCotizacion.NombreGrupo
              ],
              [
                { text: "Fecha de inicio", bold: true },
                ReservaCotizacion.FechaIN
              ],
              [
                { text: "Numero de pasajeros", bold: true },
                ReservaCotizacion.NpasajerosAdult +
                  ReservaCotizacion.NpasajerosChild
              ]
            ]
          },
          layout: "noBorders",
          margin: [15, 0, 0, 15]
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
          text: "Lista de pasajeros",
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
            widths: [30, "*", "*", "*", "*", "*", "*"],
            body: data_lista_pasajeros
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
