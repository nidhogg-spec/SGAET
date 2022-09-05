export interface listarServiciosHttp {
  IdServicioProducto: null | string;
  IdProveedor: string;
  TipoServicio: string;
  Nombre: string;
  Descripcion: string;
  Precio: number;
  Costo: number;
  NombreProveedor: string;
  PuntajeProveedor?: number | null;
  Currency: Currency;
  PrecioPublicado: number | null;
  OrdenServicio: OrdenServicio | null;
}

export enum Currency {
  Dolar = "Dolar",
  Sol = "Sol",
  Soles = "Soles"
}

export interface OrdenServicio {
  TipoOrden: string;
  Estado: number;
}
