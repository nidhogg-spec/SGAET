import * as uuid from "uuid";
import moment from "moment";
import { parse } from "path";
import {
  clienteProspectoInterface,
  programaTuristicoInterface,
  reservaCotizacionInterface
} from "../interfaces/db";

export const generarCotizacion = (
  programaTuristico: programaTuristicoInterface,
  nmrPasajero: number,
  clienteProspecto: clienteProspectoInterface,
  fechaIn: string
): reservaCotizacionInterface => {
  let cotizacion: reservaCotizacionInterface;
  let FechaIN = moment(fechaIn);

  let serviciotemp: reservaCotizacionInterface["ServicioProducto"] =
    programaTuristico.ServicioProducto.map((servi) => {
      let FechaINTemp = moment(FechaIN);
      return {
        IdServicioProducto: servi.IdServicioProducto,
        TipoServicio: servi.TipoServicio,
        PrecioConfiUnitario: servi.PrecioConfiUnitario,
        NombreServicio: servi.NombreServicio,
        Dia: parseInt(servi.Dia.toString()),
        Cantidad: parseInt(nmrPasajero.toString()),
        PrecioCotiUnitario: servi.PrecioCotiUnitario,
        IGV: servi.IGV,
        PrecioCotiTotal: servi.PrecioCotiUnitario * nmrPasajero,
        PrecioConfiTotal: servi.PrecioConfiUnitario * nmrPasajero,
        Currency: servi.Currency,
        PrecioPublicado: servi.PrecioPublicado,
        FechaReserva: FechaINTemp.add(
          parseInt(servi.Dia.toString()) - 1,
          "days"
        ).format("YYYY-MM-DD"),
        IdReservaCotizacion: "",
        IdServicioEscogido: uuid.v1(),
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
    DuracionDias: parseInt(programaTuristico.DuracionDias.toString()),
    DuracionNoche: parseInt(programaTuristico.DuracionNoche.toString()),
    Localizacion: programaTuristico.Localizacion,
    Descripcion: programaTuristico.Descripcion,
    Itinerario: programaTuristico.Itinerario,
    Incluye: programaTuristico.Incluye,
    NoIncluye: programaTuristico.NoIncluye,
    RecomendacionesLlevar: programaTuristico.RecomendacionesLlevar,
    ServicioProducto: serviciotemp,
    IdProgramaTuristico: programaTuristico.IdProgramaTuristico,
    FechaIN: FechaIN.format("YYYY-MM-DD"),
    Estado: 1,
    NumPaxTotal: nmrPasajero,
    IdClienteProspecto: clienteProspecto.IdClienteProspecto ?? "",
    IdReservaCotizacion: undefined,
    ListaPasajeros: undefined
  };

  return cotizacion;
};
