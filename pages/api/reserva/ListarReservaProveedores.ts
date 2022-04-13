import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { tiposProveedoresServicios } from "@/utils/dominio";
import {
  clienteProspectoInterface,
  ordenServicioInterface,
  productoInterface,
  proveedorInterface,
  reservaCotizacionInterface,
  servicioEscogidoInterface
} from "@/utils/interfaces/db";
import { dbColeccionesFormato } from "@/utils/interfaces/db";
import { exists } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
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
    switch (req.method) {
      case "GET":
        let data = await Obtener_datos_proveedores_reserva(IdReserva as string);
        res.status(200).json(data);
        break;
      default:
        res.status(404);
        break;
    }
    res.end();
    resolve();
  });
};

const Obtener_datos_proveedores_reserva = async (IdReserva: string) => {
  let DatosServEscogido: servicioEscogidoInterface[] | null = null;
  let data_result: Obtener_datos_proveedores_reserva_result[] = [];
  let especificacionPorProveedor: Proveedores_por_reserva_result[] = [];
  const connectedObject = await connectToDatabase();
  // -------------------------------------------------------------- Obtener de la reserva
  let collection = connectedObject.db.collection(
    dbColeccionesFormato.ReservaCotizacion.coleccion
  );
  let reserva:reservaCotizacionInterface = await collection.findOne({ IdReservaCotizacion: IdReserva });
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
    return [];
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
            serviciosEscogidos: [servicioEscogido],
            
          });
        }
        return;
      }
    )
  );

  return {
    tablaProductos: data_result,
    especificacionPorProveedor: especificacionPorProveedor,
    reserva: reserva
  };
};
