export enum Currency {
  Dolares = "Dolares",
  Soles = "Soles"
}

export const tiposProveedoresServicios = [
  {
    prefijo: "PH",
    collectionName: "ProductoHoteles",
    idKey: "IdProductoHoteles",
    nombreGeneral: "Hotel",
    nombreTipo: "Hotel"
  },
  {
    prefijo: "PA",
    collectionName: "ProductoAgencias",
    idKey: "IdProductoAgencias",
    nombreGeneral: "Agencia",
    nombreTipo: "Agencia"
  },
  {
    prefijo: "PG",
    collectionName: "ProductoGuias",
    idKey: "IdProductoGuia",
    nombreGeneral: "Guia",
    nombreTipo: "Guia"
  },
  {
    prefijo: "PO",
    collectionName: "ProductoOtros",
    idKey: "IdProductoOtro",
    nombreGeneral: "Otro",
    nombreTipo: "Otro"
  },
  {
    prefijo: "PR",
    collectionName: "ProductoRestaurantes",
    idKey: "IdProductoRestaurante",
    nombreGeneral: "Restaurante",
    nombreTipo: "Restaurante"
  },
  {
    prefijo: "PS",
    collectionName: "ProductoSitioTuristico",
    idKey: "IdProductoSitioTuristico",
    nombreGeneral: "Sitio Turistico",
    nombreTipo: "SitioTuristico"
  },
  {
    prefijo: "PF",
    collectionName: "ProductoTransFerroviario",
    idKey: "IdProductoTransFerroviario",
    nombreGeneral: "Transporte Ferroviario",
    nombreTipo: "TransporteFerroviario"
  },
  {
    prefijo: "PT",
    collectionName: "ProductoTransportes",
    idKey: "IdProductoTransporte",
    nombreGeneral: "Transporte Terrestre",
    nombreTipo: "TransporteTerrestre"
  }
];

export const estadosReservaCotizacion = {
  0: {
    estado: "Cotizacion",
    numero: 0,
    validNextStates: [1, 11]
  },
  1: {
    estado: "Reserva",
    numero: 1,
    validNextStates: [2, 3, 4, 6, 12]
  },
  2: {
    estado: "Reserva / Proveedores confirmados",
    numero: 2,
    validNextStates: [3, 4, 5, 6]
  },
  3: {
    estado: "Reserva / Ordenes de Servicio generadas",
    numero: 3,
    validNextStates: [4, 5, 6]
  },
  4: {
    estado: "Reserva / Proveedores pagados",
    numero: 4,
    validNextStates: [5]
  },
  5: {
    estado: "Reserva Concluida",
    numero: 5,
    validNextStates: []
  },
  6: {
    estado: "Reserva Cancelada",
    numero: 6,
    validNextStates: []
  },
  11: {
    estado: "Cotizacion Inactiva",
    numero: 11,
    validNextStates: [0]
  },
  12: {
    estado: "Reserva Inactiva",
    numero: 12,
    validNextStates: [1]
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
