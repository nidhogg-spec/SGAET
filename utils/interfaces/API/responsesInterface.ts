import {
  proveedorInterface,
  servicioEscogidoInterface,
  reservaCotizacionInterface
} from "../db";

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
  reserva: reservaCotizacionInterface;
}
export interface UsesCase_to_API_response {
  data: object | null;
  message: string;
  status: number;
  errorList?: string[];
  error?: boolean;
}
