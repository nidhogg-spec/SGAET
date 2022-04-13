export enum Currency {
  Dolares = "Dolares",
  Soles = "Soles"
}

export const tiposProveedoresServicios = [
  {
    prefijo: "PH",
    collectionName: "ProductoHoteles",
    idKey: "IdProductoHotel"
  },
  {
    prefijo: "PA",
    collectionName: "ProductoAgencias",
    idKey: "IdProductoAgencia"
  },
  {
    prefijo: "PG",
    collectionName: "ProductoGuias",
    idKey: "IdProductoGuia"
  },
  {
    prefijo: "PO",
    collectionName: "ProductoOtros",
    idKey: "IdProductoOtro"
  },
  {
    prefijo: "PR",
    collectionName: "ProductoRestaurantes",
    idKey: "IdProductoRestaurante"
  },
  {
    prefijo: "PS",
    collectionName: "ProductoSitioTuristico",
    idKey: "IdProductoSitioTuristico"
  },
  {
    prefijo: "PF",
    collectionName: "ProductoTransFerroviario",
    idKey: "IdProductoTransFerroviario"
  },
  {
    prefijo: "PT",
    collectionName: "ProductoTransportes",
    idKey: "IdProductoTransporte"
  }
];

export const estadosReservaCotizacion = {
  0: {
    estado: "Cotizacion",
    numero: 0
  },
  1: {
    estado: "Reserva",
    numero: 1
  },
  2: {
    estado: "Reserva / Proveedores confirmados",
    numero: 2
  },
  3: {
    estado: "Reserva / Ordenes de Servicio generadas",
    numero: 3
  },
  4: {
    estado: "Reserva / Proveedores pagados",
    numero: 4
  },
  5: {
    estado: "Reserva Concluida",
    numero: 5
  },
  11: {
    estado: "Cotizacion Inactiva",
    numero: 11
  },
  12: {
    estado: "Reserva Inactiva",
    numero: 12
  }
};

export enum Idiomas {
  Español = "Español",
  Ingles = "Ingles",
  Aleman = "Aleman",
  Francés = "Francés",
  Italiano = "Italiano",
  Japonés = "Japonés",
  Portugués = "Portugués",
  Ruso = "Ruso",
  Chino = "Chino",
  Coreano = "Coreano",
  Otro = "Otro"
}
