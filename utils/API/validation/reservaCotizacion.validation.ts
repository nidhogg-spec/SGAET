import { createReservaCotizacionBodyParam } from "@/utils/interfaces/API/reservaCotizacion.interface";
import Ajv, { JSONSchemaType } from "ajv";
const ajv = new Ajv();

export function validateCreateReservaCotizacionBodyParam(
  value: unknown
): [
  createReservaCotizacionBodyParam | null,
  string | null | undefined,
  number
] {
  const schema: JSONSchemaType<createReservaCotizacionBodyParam> = {
    type: "object",
    required: [
      "ServicioProducto",
      "NombreGrupo",
      "CodGrupo",
      "NpasajerosAdult",
      "NpasajerosChild",
      "NombrePrograma",
      "CodigoPrograma",
      "Tipo",
      "DuracionDias",
      "DuracionNoche",
      "Localizacion",
      "Descripcion",
      "Itinerario",
      "Incluye",
      "NoIncluye",
      "RecomendacionesLlevar",
      "IdProgramaTuristico",
      "FechaIN",
      "NumPaxTotal",
      "IdClienteProspecto"
    ],
    properties: {
      NombreGrupo: {
        type: "string"
      },
      CodGrupo: {
        type: "string"
      },
      NpasajerosAdult: {
        type: "number"
      },
      NpasajerosChild: {
        type: "number"
      },
      NombrePrograma: {
        type: "string"
      },
      CodigoPrograma: {
        type: "string"
      },
      Tipo: {
        type: "string"
      },
      DuracionDias: {
        type: "number"
      },
      DuracionNoche: {
        type: "number"
      },
      Localizacion: {
        type: "string"
      },
      Descripcion: {
        type: "string"
      },
      Itinerario: {
        type: "array",
        items: {
          type: "object",
          required: ["Actividad", "Dia", "Hora Fin", "Hora Inicio"],
          properties: {
            Dia: {
              type: "number"
            },
            "Hora Inicio": {
              type: "string"
            },
            "Hora Fin": {
              type: "string"
            },
            Actividad: {
              type: "string"
            }
          }
        }
      },
      Incluye: {
        type: "array",
        items: {
          type: "object",
          required: ["Actividad"],
          properties: {
            Actividad: {
              type: "string"
            }
          }
        }
      },
      NoIncluye: {
        type: "array",

        items: {
          type: "object",
          required: ["Actividad"],
          properties: {
            Actividad: {
              type: "string"
            }
          }
        }
      },
      RecomendacionesLlevar: {
        type: "array",
        items: {
          type: "object",
          required: ["Recomendacion"],
          properties: {
            Recomendacion: {
              type: "string"
            }
          }
        }
      },
      ServicioProducto: {
        type: "array",
        items: {
          type: "object",
          required: [
            "IdServicioProducto",
            "TipoServicio",
            "PrecioConfiUnitario",
            "NombreServicio",
            "Dia",
            "Cantidad",
            "PrecioCotiUnitario",
            "IGV",
            "PrecioCotiTotal",
            "PrecioConfiTotal",
            "Currency",
            "PrecioPublicado",
            "FechaReserva",
            "IdServicioEscogido",
            // "FechaLimitePago",
            "Estado",
            "IdProveedor"
          ],
          properties: {
            IdServicioProducto: {
              type: "string"
            },
            TipoServicio: {
              type: "string"
            },
            PrecioConfiUnitario: {
              type: "number"
            },
            NombreServicio: {
              type: "string"
            },
            Dia: {
              type: "number"
            },
            Cantidad: {
              type: "number"
            },
            PrecioCotiUnitario: {
              type: "number"
            },
            IGV: {
              type: "boolean"
            },
            PrecioCotiTotal: {
              type: "number"
            },
            PrecioConfiTotal: {
              type: "number"
            },
            Currency: {
              type: "string"
            },
            PrecioPublicado: {
              type: "number"
            },
            FechaReserva: {
              type: "string"
            },
            IdServicioEscogido: {
              type: "string"
            },
            FechaLimitePago: {
              type: "string"
            },
            Estado: {
              type: "number"
            },
            IdProveedor: {
              type: "string"
            }
          }
        }
      },
      IdProgramaTuristico: {
        type: "string"
      },
      FechaIN: {
        type: "string"
      },
      NumPaxTotal: {
        type: "number"
      },
      IdClienteProspecto: {
        type: "string"
      }
    },
    additionalProperties: true
  };
  try {
    const validate = ajv.compile(schema);

    if (validate(value)) {
      // data is MyData here
      return [value as createReservaCotizacionBodyParam, null, 200];
    }
    return [
      null,
      validate.errors
        ?.flatMap((x) => `|${x.instancePath} - ${x.message}|`)
        .join(),
      400
    ];
  } catch (error) {
    return [null, `${error}`, 400];
  }
}
