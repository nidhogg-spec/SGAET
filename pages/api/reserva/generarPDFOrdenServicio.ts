import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { tiposProveedoresServicios } from "@/utils/dominio";
import {
  dbColeccionesFormato,
  productoInterface,
  proveedorInterface,
  reservaCotizacionInterface,
  servicioEscogidoInterface
} from "@/utils/interfaces/db";
import { NextApiRequest, NextApiResponse } from "next";
import PdfPrinter from "pdfmake";

interface Obtener_datos_proveedores_reserva_result {
  NombreProveedor: string;
  TipoProveedor: string;
  PagoTotal: number;
  IdProveedor: string;
  Currency: string;
}
interface Proveedores_por_reserva_result {
  IdProveedor: string;
  Proveedor: proveedorInterface;
  serviciosEscogidos: servicioEscogidoInterface[];
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await new Promise<void>(async (resolve, reject) => {
    const IdReserva = req.query.IdReserva;
    if (!IdReserva) {
      res.status(400);
      res.end();
      resolve();
      return;
    }
    const IdProveedor = req.query.IdProveedor;
    if (!IdProveedor) {
      res.status(400);
      res.end();
      resolve();
      return;
    }
    switch (req.method) {
      case "GET":
        let data = await Generar_PDF_Orden_Servicio(IdReserva as string,IdProveedor as string);
        res.setHeader("Content-Type", "application/pdf").send(data);
        break;
      default:
        res.status(404);
        break;
    }
    res.end();
    resolve();
  });
};
const Generar_PDF_Orden_Servicio = async (IdReserva: string,IdProveedor:string ) => {
  const info = await Obtener_all_data(IdReserva);
  let Lista_servicios = [
    [
      "Nro.",
      "Nombre de Servicio",
      "Precio de Cotizacion Total",
      "Currency",
      "Fecha de Reserva"
    ],
  ]

  info?.especificacionPorProveedor[info?.especificacionPorProveedor.findIndex(x=>x.IdProveedor==IdProveedor)].serviciosEscogidos.forEach((x,i)=>{
    Lista_servicios.push([
      (i+1).toString(),
      x.NombreServicio,
      x.PrecioCotiTotal.toString(),
      x.Currency,
      x.FechaReserva
    ])
  })
  //------------------------------------------------------------
  let fonts = {
    Roboto: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique'
    },
  };
  let printer = new PdfPrinter(fonts);
  let docDefinition = {
    content: [
      {
        text: "Orden de Servicio",
        style: "header",
        justify: "center",
        color: "black"
      },
      {
        text: "Datos",
        style: "subheader"
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            color: "gray"
          }
        ],
        style: "line"
      },
      {
        table: {
          headerRows: 1,
          widths: [200, "*"],
          body: [
            [{ text: "Codigo de grupo", bold: true }, info?.reserva.CodGrupo],
            [{ text: "Nombre de grupo", bold: true }, info?.reserva.NombreGrupo],
            [{ text: "Fecha de inicio", bold: true }, info?.reserva.FechaIN],
            [{ text: "Numero de pasajeros", bold: true }, info?.reserva.NumPaxTotal]
          ]
        },
        layout: "noBorders",
        margin: [15, 0, 0, 0]
      },
      {
        text: "Servicios",
        style: "subheader"
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            color: "gray"
          }
        ],
        style: "line"
      },
      {
        table: {
          headerRows: 1,
          widths: [30, "*", "*", "*", "*"],
          body: Lista_servicios
        }
      },
      {
        text: "Datos de Pasajeros",
        style: "subheader"
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            color: "gray"
          }
        ],
        style: "line"
      },
      {
        table: {
          headerRows: 1,
          widths: [30, "*", "*", "*", "*"],
          body: [
            [
              "Nro.",
              "Nombre de Pasajero",
              "Vegeteariano",
              "Alergias",
            ],
            ["1", "", "", ""],

          ]
        }
      }
    ],
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        alignment: "center",
        margin: [0, 20],
        color: "white"
      },
      subheader: {
        fontSize: 15,
        bold: true,
        margin: [0, 25, 0, 0],
        color: "gray"
      },
      quote: {
        italics: true
      },
      small: {
        fontSize: 8
      },

      line: {
        margin: [0, 0, 0, 25]
      },
      tableDatos: {
        alignment: "center"
      },
      header3: {
        bold: true,
        margin: [0, 10, 0, 10]
      }
    }
  };
  let pdfDoc = printer.createPdfKitDocument(docDefinition as any);

  return new Promise((resolve, reject) => {
    try {
      let chunks: any[] = [];
      pdfDoc.on("data", (chunk: any) => chunks.push(chunk));
      pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
      pdfDoc.end();
    } catch (err) {
      reject(err);
    }
  });
};
const Obtener_all_data = async (
  IdReserva: string
): Promise<
  | {
      especificacionPorProveedor: Proveedores_por_reserva_result[];
      reserva: reservaCotizacionInterface;
    }
  | undefined
> => {
  let DatosServEscogido: servicioEscogidoInterface[] | null = null;
  let data_result: Obtener_datos_proveedores_reserva_result[] = [];
  let especificacionPorProveedor: Proveedores_por_reserva_result[] = [];
  const connectedObject = await connectToDatabase();
  // -------------------------------------------------------------- Obtener de la reserva
  let collection = connectedObject.db.collection(
    dbColeccionesFormato.ReservaCotizacion.coleccion
  );
  let reserva: reservaCotizacionInterface = await collection.findOne({
    IdReservaCotizacion: IdReserva
  });
  // -------------------------------------------------------------- Obtener todos los de ServicioEscogido de la reserva
  collection = connectedObject.db.collection(
    dbColeccionesFormato.ServicioEscogido.coleccion
  );
  let result01: servicioEscogidoInterface[] = await collection
    .find({
      IdReservaCotizacion: IdReserva
    })
    .toArray();
  if (result01.length == 0) {
    console.log("No se encontraron Servicios escogidos");
    return;
  }
  DatosServEscogido = [...result01];
  await Promise.all(
    DatosServEscogido.map(
      async (servicioEscogido: servicioEscogidoInterface) => {
        // --------------------------------------------------- Obtener datos de Producto
        let tipoProveedor = tiposProveedoresServicios.find(
          (tipo) =>
            tipo.prefijo == servicioEscogido?.IdServicioProducto.slice(0, 2)
        );
        collection = connectedObject.db.collection(
          tipoProveedor?.collectionName as string
        );
        let findObject: any = {};
        findObject[tipoProveedor?.idKey as string] =
          servicioEscogido?.IdServicioProducto;
        let producto: productoInterface[] = await collection
          .find(findObject)
          .project({
            _id: 0
          })
          .toArray();
        //   ------------------------------------------------- Obtener datos de Proveedor
        collection = connectedObject.db.collection(
          dbColeccionesFormato.Proveedor.coleccion
        );
        if (producto.length == 0) {
          console.error("No se encontró el producto");
          console.error(servicioEscogido);
          return false;
        }
        let proveedor: proveedorInterface[] = await collection
          .find({
            IdProveedor: producto[0].IdProveedor
          })
          .project({
            _id: 0
          })
          .toArray();
        if (
          data_result.find((data) => {
            return data.IdProveedor == proveedor[0].IdProveedor;
          }) != null
        ) {
          data_result[
            data_result.findIndex((data) => {
              return data.IdProveedor == proveedor[0].IdProveedor;
            })
          ].PagoTotal += parseFloat(
            servicioEscogido.PrecioConfiTotal.toString()
          );
          //................................................................
          let index = especificacionPorProveedor.findIndex((data) => {
            return data.IdProveedor == proveedor[0].IdProveedor;
          });
          especificacionPorProveedor[index] = {
            ...especificacionPorProveedor[index],
            serviciosEscogidos: [
              ...especificacionPorProveedor[index].serviciosEscogidos,
              servicioEscogido
            ]
          };
        } else {
          data_result.push({
            IdProveedor: proveedor[0].IdProveedor,
            NombreProveedor: proveedor[0].nombre,
            TipoProveedor: proveedor[0].tipo,
            PagoTotal: parseFloat(servicioEscogido.PrecioConfiTotal.toString()),
            Currency: proveedor[0].TipoMoneda
          });
          //------------------------------------------------------------------------
          especificacionPorProveedor.push({
            IdProveedor: proveedor[0].IdProveedor,
            Proveedor: proveedor[0],
            serviciosEscogidos: [servicioEscogido]
          });
        }
        return;
      }
    )
  );
  return {
    especificacionPorProveedor: especificacionPorProveedor,
    reserva: reserva
  };
};
