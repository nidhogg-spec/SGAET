import moment from "moment";
import {
  clienteProspectoInterface,
  programaTuristicoInterface,
  reservaCotizacionInterface
} from "../interfaces/db";

export const generarCotizacion = (
  programaTuristico: programaTuristicoInterface,
  nmrPasajero: number,
  clienteProspecto: clienteProspectoInterface
): reservaCotizacionInterface => {
  let cotizacion: reservaCotizacionInterface;

  let serviciotemp: reservaCotizacionInterface["ServicioProducto"] =
    programaTuristico.ServicioProducto.map((servi) => {
      return {
        IdServicioProducto: servi.IdServicioProducto,
        TipoServicio: servi.TipoServicio,
        PrecioConfiUnitario: servi.PrecioConfiUnitario,
        NombreServicio: servi.NombreServicio,
        Dia: servi.Dia,
        Cantidad: nmrPasajero,
        PrecioCotiUnitario: servi.PrecioCotiUnitario,
        IGV: servi.IGV,
        PrecioCotiTotal: servi.PrecioCotiUnitario * nmrPasajero,
        PrecioConfiTotal: servi.PrecioConfiUnitario * nmrPasajero,
        Currency: servi.Currency,
        PrecioPublicado: servi.PrecioPublicado,
        FechaReserva: moment().format("YYYY-MM-DD"),
        IdReservaCotizacion: "",
        IdServicioEscogido: "",
        FechaLimitePago: undefined,
        Estado: 1,
        IdProveedor: ""
      };
    });

  cotizacion = {
    NombreGrupo: "", // after
    CodGrupo: "", // after
    NpasajerosAdult: nmrPasajero,
    NpasajerosChild: 0,
    NombrePrograma: programaTuristico.NombrePrograma,
    CodigoPrograma: programaTuristico.CodigoPrograma,
    Tipo: programaTuristico.Tipo,
    DuracionDias: programaTuristico.DuracionDias,
    DuracionNoche: programaTuristico.DuracionNoche,
    Localizacion: programaTuristico.Localizacion,
    Descripcion: programaTuristico.Descripcion,
    Itinerario: programaTuristico.Itinerario,
    Incluye: programaTuristico.Incluye,
    NoIncluye: programaTuristico.NoIncluye,
    RecomendacionesLlevar: programaTuristico.RecomendacionesLlevar,
    ServicioProducto: serviciotemp,
    IdProgramaTuristico: programaTuristico.IdProgramaTuristico,
    FechaIN: "",
    Estado: 1,
    NumPaxTotal: nmrPasajero,
    IdClienteProspecto: clienteProspecto.IdClienteProspecto ?? "",
    IdReservaCotizacion: undefined,
    ListaPasajeros: undefined
  };

  return cotizacion;
};
