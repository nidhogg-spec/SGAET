import {
  reservaCotizacionInterface,
  servicioProductoOfReservaCotizacionInterface
} from "@/utils/interfaces/db";

interface servicioCreateReservaCotizacionBodyParam
  extends Omit<
    servicioProductoOfReservaCotizacionInterface,
    "IdReservaCotizacion" | "FechaLimitePago"
  > {
  FechaLimitePago: string;
}

export interface createReservaCotizacionBodyParam
  extends Omit<
    reservaCotizacionInterface,
    | "_id"
    | "Estado"
    | "tableData"
    | "ServicioProducto.IdReservaCotizacion"
    | "IdReservaCotizacion"
    | "ListaPasajeros"
    | "ServicioProducto"
    | "URLLlenadoPasajeros"
  > {
  ServicioProducto: servicioCreateReservaCotizacionBodyParam[];
}