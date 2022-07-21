export const dbColeccionesFormato = {
  // A:{
  //     prefijo: "",
  //     coleccion: "",
  //     keyId: "",
  // },

  // Agregados recientemente
  ProgramaTuristico: {
    prefijo: "OS",
    coleccion: "ProgramaTuristico",
    keyId: "IdProgramaTuristico"
  },
  Seguimiento: {
    prefijo: "SG",
    coleccion: "Seguimiento",
    keyId: "IdSeguimiento"
  },

  Proveedor: {
    prefijo: "HT",
    coleccion: "Proveedor",
    keyId: "IdProveedor"
  },
  ReservaCotizacion: {
    prefijo: "RC",
    coleccion: "ReservaCotizacion",
    keyId: "IdReservaCotizacion"
  },
  ServicioEscogido: {
    prefijo: "SE",
    coleccion: "ServicioEscogido",
    keyId: "IdServicioEscogido"
  },
  ClienteProspecto: {
    prefijo: "CP",
    coleccion: "ClienteProspecto",
    keyId: "IdClienteProspecto"
  },
  Criterio: {
    prefijo: "CT",
    coleccion: "Criterio",
    keyId: "IdCriterio"
  },
  DataSistema: {
    coleccion: "DataSistema",
    keyId: "TipoDato"
  },
  Egreso: {
    prefijo: "EG",
    coleccion: "Egreso",
    keyId: "IdEgreso"
  },
  EvaluacionActividad: {
    prefijo: "EA",
    coleccion: "EvaluacionActividad",
    keyId: "IdEvaluacionActividad"
  },
  Ingreso: {
    prefijo: "IG",
    coleccion: "Ingreso",
    keyId: "IdIngreso"
  },
  OrdenServicio: {
    prefijo: "OS",
    coleccion: "OrdenServicio",
    keyId: "IdOrdenServicio"
  },
  Pasajero: {
    prefijo: "PA",
    coleccion: "Pasajero",
    keyId: "IdPasajero"
  },
  Cliente: {
    prefijo: "CL",
    coleccion: "Cliente",
    keyId: "IdCliente"
  },
  Actividad: {
    prefijo: "AC",
    coleccion: "Actividad",
    keyId: "IdActividad"
  },
  ProductoHoteles: {
    prefijo: "PH",
    coleccion: "ProductoHoteles",
    keyId: "IdProductoHoteles"
  },
  ProductoAgencias: {
    prefijo: "PA",
    coleccion: "ProductoAgencias",
    keyId: "IdProductoAgencias"
  },
  ProductoGuias: {
    prefijo: "PG",
    coleccion: "ProductoGuias",
    keyId: "IdProductoGuia"
  },
  ProductoOtros: {
    prefijo: "PO",
    coleccion: "ProductoOtros",
    keyId: "IdProductoOtro"
  },
  ProductoRestaurantes: {
    prefijo: "PR",
    coleccion: "ProductoRestaurantes",
    keyId: "IdProductoRestaurante"
  },
  ProductoSitioTuristicos: {
    prefijo: "PS",
    coleccion: "ProductoSitioTuristico",
    keyId: "IdProductoSitioTuristico"
  },
  ProductoSitioTransFerroviario: {
    prefijo: "PF",
    coleccion: "ProductoTransFerroviario",
    idKey: "IdProductoTransFerroviario"
  },
  ProductoTransportes: {
    prefijo: "PT",
    coleccion: "ProductoTransportes",
    keyId: "IdProductoTransporte"
  },
  User: {
    prefijo: "US",
    coleccion: "User",
    keyId: "IdUser"
  }
};

export interface servicioEscogidoInterface {
  _id?: string;
  IdServicioProducto: string;
  TipoServicio: "Restaurante" | string;
  PrecioConfiUnitario: number;
  NombreServicio: string;
  Dia: number;
  Cantidad: number;
  PrecioCotiUnitario: number;
  IGV: false;
  PrecioCotiTotal: number;
  PrecioConfiTotal: number;
  Currency: "Dolar" | "Soles" | string;
  PrecioPublicado: number;
  tableData?: object;
  FechaReserva: string;
  IdReservaCotizacion: string;
  IdServicioEscogido: string;
  FechaLimitePago: Date;
  Estado: number;
}
// ------------------Productos-------------------
export interface productoInterface {
  _id?: string;
  IdProveedor: string;
  precioPubli: number;
  precioConfi: number;
  precioCoti: number;
  tableData?: {
    id: number;
  };
}
export interface productoAgenciaInterface extends productoInterface {
  TipoPaxs: string;
  servicio: string;
  codServicio: string;
  incluye: string;
  duracion: string;
  IdProductoAgencia: string;
}
export interface productoGuiasInterface extends productoInterface {
  TipoPaxs: string;
  codServicio: string;
  direccion: string;
  dni: string;
  idiomas: string;
  gremio: string;
  carne: string;
  fecExpedi: string;
  fecCaduc: string;
  IdProductoGuia: string;
}
export interface productoHotelesInterface extends productoInterface {
  TipoPaxs: string;
  tipoHabitacion: string;
  descripcionHabitacion: string;
  IdProductoHotel: string;
}
export interface productoOtrosInterface extends productoInterface {
  TipoPaxs: string;
  servicio: string;
  codServicio: string;
  Descripcion: string;
  IdProductoOtro: string;
}
export interface productoRestaurantesInterface extends productoInterface {
  TipoPaxs: string;
  servicio: string;
  codServicio: string;
  caracte: string;
  IdProductoRestaurante: string;
}
export interface productoSitioTuristicoInterface extends productoInterface {
  NomServicio: string;
  Categoria: string;
  HoraAtencion: string;
  IdProductoSitioTuristico: string;
}
export interface productoTransFerroviarioInterface extends productoInterface {
  TipoPaxs: string;
  ruta: string;
  salida: string;
  llegada: string;
  tipoTren: string;
  IdProductoTransFerroviario: string;
  EtapaPaxs: string;
}
export interface productoTransportesInterface extends productoInterface {
  TipoPaxs: string;
  codServicio: string;
  servicio: string;
  horario: string;
  tipvehiculo: string;
  IdProductoTransporte: string;
}

// ------------------Programa Turistico-------------------
export interface programaTuristicoInterface {
  _id?: string;
  Estado: number;
  NombrePrograma: string;
  CodigoPrograma: string;
  Tipo: string;
  DuracionDias: string | number;
  DuracionNoche: string | number;
  Localizacion: string;
  Descripcion: string;
  Itinerario: {
    Dia: number;
    "Hora Inicio": string;
    "Hora Fin": string;
    Actividad: string;
    tableData?: {
      id: number;
    };
  }[];
  ItinerarioDescripcion: string;
  Incluye: {
    Actividad: string;
    tableData?: {
      id: number;
    };
  }[];
  NoIncluye: {
    Actividad: string;
    tableData?: {
      id: number;
    };
  }[];
  RecomendacionesLlevar: {
    Recomendacion: string;
    tableData?: {
      id: number;
    };
  }[];
  ServicioProducto: {
    IdServicioProducto: string;
    TipoServicio: string;
    PrecioConfiUnitario: number;
    NombreServicio: string;
    Dia: number;
    Cantidad: number;
    PrecioCotiUnitario: number;
    IGV: boolean;
    PrecioCotiTotal: number;
    PrecioConfiTotal: number;
    Currency: "Dolar" | "Soles" | string;
    PrecioPublicado: number;
    tableData?: {
      id: number;
    };
  }[];
  IdProgramaTuristico: string;
}
// ------------------Proveedor-------------------
export interface proveedorInterface {
  _id?: string;
  tipo: string;
  RazonSocial: string;
  nombre: string;
  TipoDocumento: string;
  NroDocumento: string;
  DireccionFiscal: string;
  TipoMoneda: "Dolar" | "Soles" | string;
  NumeroPrincipal: string;
  EmailPrincipal: string;
  Estado: number | string;
  NombreRepresentanteLegal: string;
  NroDocIdentRepresentanteLegal: string;
  EnlaceDocumento: string;
  //------------------ Guia
  NombreGuia: "";
  Idiomas: string[];
  //------------------ Hotel
  NEstrellas: number | string;
  //---------------------------
  Contacto: {
    NombreContac: string;
    Area: string;
    Numero: string;
    Email: string;
    tableData?: {
      id: number;
    };
  }[];
  DatosBancarios: {
    Banco: string;
    Beneficiario: string;
    TipoCuenta: string;
    TipoDocumento: string;
    NumDoc: string;
    Cuenta: string;
    CCI: string;
    Moneda: string;
    tableData?: {
      id: number;
    };
  }[];
  IdProveedor: string;
  periodoActual: string;
  porcentajeTotal: null | number;
  PaginaWeb: string;
}
// ------------------ReservaCotizacion-------------------
export interface reservaCotizacionInterface {
  _id: string;
  NombreGrupo: string;
  CodGrupo: string;
  NpasajerosAdult: number | string;
  NpasajerosChild: number | string;
  NombrePrograma: string;
  CodigoPrograma: string;
  Tipo: string;
  DuracionDias: number | string;
  DuracionNoche: number | string;
  Localizacion: string;
  Descripcion: string;
  Itinerario: [
    {
      Dia: number;
      "Hora Inicio": string;
      "Hora Fin": string;
      Actividad: string;
      tableData: {
        id: number;
      };
    }
  ];
  Incluye: {
    Actividad: string;
    tableData?: {
      id: number;
    };
  }[];
  NoIncluye: {
    Actividad: string;
    tableData?: {
      id: number;
    };
  }[];
  RecomendacionesLlevar: {
    Recomendacion: string;
    tableData?: {
      id: number;
    };
  }[];
  ServicioProducto: [
    {
      IdServicioProducto: string;
      TipoServicio: string;
      PrecioConfiUnitario: number;
      NombreServicio: string;
      Dia: number;
      Cantidad: number;
      PrecioCotiUnitario: number;
      IGV: boolean;
      PrecioCotiTotal: number;
      PrecioConfiTotal: number;
      Currency: "Dolar" | "Soles" | string;
      PrecioPublicado: number;
      tableData: {
        id: number;
      };
      FechaReserva: string;
    }
  ];
  IdProgramaTuristico: string;
  FechaIN: string;
  Estado: number;
  NumPaxTotal: number;
  IdClienteProspecto: string;
  IdReservaCotizacion: string;
  ListaPasajeros?: pasajeroInterface[];
}
// ------------------Orden de Servicio-------------------
export interface ordenServicioInterface {
  _id?: string;
  TipoOrden: "A" | "B" | "C" | "D" | string;
  Estado: number | string;
  CodigoOrdenServicio: string;
  IdServicioEscogido: string;
  IdOrdenServicio: string;
  Proveedor: {
    IdProveedor: string;
    NombreProveedor: string;
    Direccion: string;
    TipoDocumento: string;
    NroDocumento: string;
    Email: string;
    Telefono: string;
  };
}
export interface ordenServicioDInterface extends ordenServicioInterface {
  Servicios: {}[];
  DetalleServicio: string;
  Observacion: string;
  Fecha: string;
  Idioma: string;
}
// ------------------Ingresos-------------------
export interface ingresoInterface {
  _id?: string;
  Total: number;
  TotalNeto: number;
  Comision: number;
  /* IdReservaCotizacion: string; */
  ListaRelacionesId: any;
  Adelanto: number;
  MetodoPago: string;
  IdIngreso: string;
  FechaCreacion: Date
  FechaModificacion: Date
}
// ------------------Egreso-------------------
export interface egresoInterface {
  _id?: string;
  Total: number;
  TotalNeto: number;
  Comision: number;
  /* IdReservaCotizacion: string; */
  ListaRelacionesId:  any;
  Adelanto: number;
  MetodoPago: string;
  IdEgreso: string;
  FechaCreacion: Date
  FechaModificacion: Date
}
// ------------------Evaluacion Actividad-------------------
export interface evaluacionActividadInterface {
  _id?: string;
  evaperiodo: {
    descripcion: string;
    valor: number | string;
    criterio: string;
    estado: number;
    IdActividad: string;
    tableData?: {
      id: number;
    };
  }[];
  IdProveedor: string;
  periodo: string;
  IdEvaluacionActividad: string;
}
// ------------------Actividad-------------------
export interface actividadInterface {
  _id: string;
  descripcion: string;
  valor: number | string;
  criterio: string;
  estado: number;
  IdActividad: string;
  tableData: {
    id: number;
  };
}
// ------------------Criterio-------------------
export interface criterioInterface {
  _id?: string;
  criterio: string;
  estado: number | string;
  IdCriterio: string;
  tableData: {
    id: number;
  };
}
// ------------------Cliente Prospecto-------------------
export interface clienteProspectoInterface {
  _id?: string;
  NombreCompleto: string;
  TipoCliente: "Directo" | "Corporativo" | "Otro" | string;
  Estado: "Cliente" | "Prospecto" | string;
  TipoDocumento: TipoDocumento;
  NroDocumento: string;
  IdClienteProspecto: string;
  Celular: string;
  Email: string;
  tableData?: {
    id: number;
  };
}
// ------------------Cliente Prospecto-------------------
export interface pasajeroInterface {
  _id?: string;
  Nombres: string;
  Apellidos: string;
  TipoDocumento: TipoDocumento;
  NroDocumento: string;
  Sexo: "Masculino" | "Femenino" | string;
  FechaNacimiento: string;
  Celular: string;
  Email: string;
  Nacionalidad: string;
  IdReservaCotizacion: string;
  UrlDocumentos: string[];
  RegimenAlimenticioDescripcion: string;
  RegimenAlimenticioEspecial: boolean;
  ProblemasMedicos: boolean;
  ProblemasMedicosDescripcion: string;
  NumPasajero: number;
  tableData?: {
    id: number;
  };
}
// ------------------ Usuarios -------------------
export interface userInterface {
  _id?: string;
  Nombre: string;
  Apellido: string;
  Email: string;
  Password: string;
  TipoUsuario: "Administrador" | "Ventas" | "Marketing" | "";
  Estado: "Activo" | "Inactivo" | string;
  IdUser: string;
}

export enum TipoDocumento {
  DNI = "DNI",
  RUC = "RUC",
  PASAPORTE = "PASAPORTE",
  CARNET_EXTRANJERIA = "CARNET_EXTRANJERIA",
  CEDULA_DIPLOMATICA = "CEDULA_DIPLOMATICA",
  OTRO = "OTRO"
}
