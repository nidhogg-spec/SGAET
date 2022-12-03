import { BibliaRepository } from "@/src/adapters/repository/biblia.repository";
import { ReservaCotizacionRepository } from "@/src/adapters/repository/reservaCotizacion.repository";
import {
  dbColeccionesFormato,
  bibliaInterface,
  reservaCotizacionInterface
} from "@/utils/interfaces/db";
import { NextApiRequest, NextApiResponse } from "next";
import pdfMake from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";

export class PdfBibliaUsecase {
  bibliaRepository: BibliaRepository;
  reservaCotizacionRepository: ReservaCotizacionRepository;
  coleccion: { prefijo: string; coleccion: string; keyId: string };
  constructor() {
    this.bibliaRepository = new BibliaRepository();
    this.reservaCotizacionRepository = new ReservaCotizacionRepository();
    this.coleccion = dbColeccionesFormato.Biblia;
  }

  async generate(
    IdReservaCotizacion: string
  ): Promise<[pdfBase64: string | null, err: Error | null]> {
    const [biblia, errorDB] = await this.encontrarBiblia(IdReservaCotizacion);
    if (errorDB) return [null, errorDB];
    if (biblia == null) return [null, new Error("reserva is empty")];

    const [reservacotizacion, errorDBRes] = await this.encontrarReserva(
      IdReservaCotizacion
    );
    if (errorDBRes) return [null, errorDBRes];
    if (reservacotizacion == null) return [null, new Error("reserva is empty")];

    const docDefinition = this.definicionDoc(biblia, reservacotizacion);
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

  async encontrarBiblia(
    IdReservaCotizacion: string
  ): Promise<[biblia: bibliaInterface | null, err: Error | null]> {
    try {
      const result = await this.bibliaRepository.findWithFilters({
        IdReservaCotizacion: IdReservaCotizacion
      });
      return [result[0], null];
    } catch (err) {
      return [null, new Error("Error - 102 - ${err}")];
    }
  }

  async encontrarReserva(
    IdReservaCotizacion: string
  ): Promise<[biblia: reservaCotizacionInterface | null, err: Error | null]> {
    try {
      const result = await this.reservaCotizacionRepository.findWithFilters({
        IdReservaCotizacion: IdReservaCotizacion
      });
      return [result[0], null];
    } catch (err) {
      return [null, new Error("Error - 102 - ${err}")];
    }
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
    Biblia: bibliaInterface,
    ReservaCotizacion: reservaCotizacionInterface
  ): TDocumentDefinitions {
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
        x.Nombres ?? "",
        x.Apellidos ?? "",
        x.Email ?? "",
        x.TipoDocumento ?? "",
        x.NroDocumento ?? "",
        x.Sexo ?? ""
      ]);
    });

    //data de tabla de transportes
    const productosTransportes = ReservaCotizacion.ServicioProducto.filter(
      (servicio) =>
        servicio.IdServicioProducto.startsWith("PT") ||
        servicio.IdServicioProducto.startsWith("PF")
    );
    let data_lista_transporte = [
      [
        "Nro.",
        "Nombre de Servicio",
        "Precio de Cotizacion Total",
        "Currency",
        "Fecha de Reserva"
      ]
    ];
    productosTransportes.forEach((x, i) => {
      data_lista_transporte.push([
        (i + 1).toString(),
        x.NombreServicio ?? "",
        x.PrecioCotiTotal.toString() ?? "",
        x.Currency ?? "",
        x.FechaReserva ?? ""
      ]);
    });

    //data de tabla de briefing
    const productosBriefing = ReservaCotizacion.ServicioProducto.filter(
      (servicio) => servicio.IdServicioProducto.startsWith("PR")
    );
    let data_lista_briefing = [
      [
        "Nro.",
        "Nombre de Servicio",
        "Precio de Cotizacion Total",
        "Currency",
        "Fecha de Reserva"
      ]
    ];
    productosBriefing.forEach((x, i) => {
      data_lista_briefing.push([
        (i + 1).toString(),
        x.NombreServicio ?? "",
        x.PrecioCotiTotal.toString() ?? "",
        x.Currency ?? "",
        x.FechaReserva ?? ""
      ]);
    });

    //data de tabla de entradas
    const productosEntrada = ReservaCotizacion.ServicioProducto.filter(
      (servicio) => servicio.IdServicioProducto.startsWith("PS")
    );
    let data_lista_entrada = [
      [
        "Nro.",
        "Nombre de Servicio",
        "Precio de Cotizacion Total",
        "Currency",
        "Fecha de Reserva"
      ]
    ];
    productosEntrada.forEach((x, i) => {
      data_lista_entrada.push([
        (i + 1).toString(),
        x.NombreServicio ?? "",
        x.PrecioCotiTotal.toString() ?? "",
        x.Currency ?? "",
        x.FechaReserva ?? ""
      ]);
    });

    //data de tabla de equipo
    let data_lista_equipo = [
      ["Nro.", "Nombre de equipo", "Descripcion", "Cantidad"]
    ];
    Biblia.Equipos.forEach((x, i) => {
      data_lista_equipo.push([
        (i + 1).toString(),
        x.NombreEquipo ?? "",
        x.Descripcion ?? "",
        x.Cantidad.toString() ?? ""
      ]);
    });

    //data de tabla de observaciones
    let data_lista_observacion = [
      ["Nro.", "Nombre de descripcion", "Descripcion", "Otro"]
    ];
    Biblia.Equipos.forEach((x, i) => {
      data_lista_observacion.push([
        (i + 1).toString(),
        x.NombreObservacion ?? "",
        x.Descripcion ?? "",
        x.Otro ?? ""
      ]);
    });

    return {
      content: [
        {
          text:
            "Biblia" +
            (ReservaCotizacion["IdReservaCotizacion"]
              ? " - " + ReservaCotizacion["IdReservaCotizacion"]
              : ""),
          style: "header",
          color: "black",
          alignment: "center",
          bold: true,
          fontSize: 18,
          margin: [0, 0, 0, 20]
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
          text: "Entradas",
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
            body: data_lista_entrada
          },
          margin: [0, 0, 0, 15]
        },
        {
          text: "Briefing",
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
            body: data_lista_briefing
          },
          margin: [0, 0, 0, 15]
        },
        {
          text: "Transporte",
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
            body: data_lista_transporte
          },
          margin: [0, 0, 0, 15]
        },
        {
          text: "Equipo",
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
            widths: [30, 120, 120, 120],
            body: data_lista_equipo
          },
          margin: [0, 0, 0, 15]
        },
        {
          text: "Observaciones",
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
            widths: [30, 120, 120, 120],
            body: data_lista_observacion
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
