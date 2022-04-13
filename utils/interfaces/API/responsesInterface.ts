import { proveedorInterface, servicioEscogidoInterface, reservaCotizacionInterface } from "../db";

export interface ListarReservaProveedores_get_response {
  tablaProductos: {
    NombreProveedor: string;
    TipoProveedor: string;
    PagoTotal: number;
    IdProveedor: string;
    Currency: string;
  };
  especificacionPorProveedor: {
    IdProveedor: string;
    Proveedor: proveedorInterface;
    serviciosEscogidos: servicioEscogidoInterface[];
  }[];
  reserva: reservaCotizacionInterface
}
