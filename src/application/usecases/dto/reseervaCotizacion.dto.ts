import {
  reservaCotizacionInterface,
  servicioProductoOfReservaCotizacionInterface
} from "@/utils/interfaces/db";

interface servicioCreateReservaCotizacionDataDTO
  extends Omit<
    servicioProductoOfReservaCotizacionInterface,
    "IdReservaCotizacion" | "FechaLimitePago"
  > {
  FechaLimitePago: string;
}

export interface createReservaCotizacionDataDTO
  extends Omit<
    reservaCotizacionInterface,
    | "_id"
    | "Estado"
    | "tableData"
    | "ServicioProducto.IdReservaCotizacion"
    | "IdReservaCotizacion"
    | "ListaPasajeros"
    | "ServicioProducto"
  > {
  ServicioProducto: servicioCreateReservaCotizacionDataDTO[];
}
