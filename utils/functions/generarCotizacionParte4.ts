import axios from "axios";
import moment from "moment";
import { Currency } from "../dominio";
import { createReservaCotizacionBodyParam } from "../interfaces/API/reservaCotizacion.interface";
import { reservaCotizacionInterface } from "../interfaces/db";

export interface formInterface {
  NombreGrupo: string;
  CodGrupo: string;
  NpasajerosAdult: number;
  NpasajerosChild: number;
  NombrePrograma: string;
  CodigoPrograma: string;
  Tipo: string;
  DuracionDias: number;
  DuracionNoche: number;
  Localizacion: string;
  Descripcion: string;
  IdProgramaTuristico: string;
  FechaIN: string;
  NumPaxTotal: number;
  IdClienteProspecto: string;
  IdReservaCotizacion: string;
  Idioma: string;
  Moneda: string;
}

export async function generarCotizacionParte4(
  data: formInterface,
  Cotizacion: reservaCotizacionInterface
): Promise<[createReservaCotizacionBodyParam, Error | null]> {
  
  const ServicioProductoTemp = Cotizacion.ServicioProducto.map((servi) => {
    return {
      FechaLimitePago: servi.FechaLimitePago ?? "",
      IdServicioProducto: servi.IdServicioProducto,
      TipoServicio: servi.TipoServicio,
      NombreServicio: servi.NombreServicio,
      Dia: parseInt(servi.Dia.toString()),
      Cantidad: parseInt(servi.Cantidad.toString()),
      IGV: servi.IGV,
      PrecioCotiUnitario: parseInt(servi.PrecioCotiUnitario.toString()),
      PrecioCotiTotal: parseInt(servi.PrecioCotiTotal.toString()),
      PrecioConfiUnitario: parseInt(servi.PrecioConfiUnitario.toString()),
      PrecioConfiTotal: parseInt(servi.PrecioConfiTotal.toString()),
      Currency: servi.Currency,
      PrecioPublicado: parseInt(servi.PrecioPublicado.toString()),
      FechaReserva: servi.FechaReserva,
      IdServicioEscogido: servi.IdServicioEscogido,
      Estado: parseInt(servi.Estado.toString()),
      IdProveedor: servi.IdProveedor
    };
  });
  let FechaOUTTemp = moment(Cotizacion.FechaIN);
  if (FechaOUTTemp.isValid()) {
    const maxDayService = ServicioProductoTemp.reduce(
      (accumulator, currentValue) => {
        return parseInt(accumulator.Dia.toString()) >
          parseInt(currentValue.Dia.toString())
          ? accumulator
          : currentValue;
      }
    );
    FechaOUTTemp = FechaOUTTemp.add(
      parseInt(maxDayService.Dia.toString()) - 1,
      "day"
    );
  }

  //Obtener valor de combercion de dolar
  let CambioDolar_temp: number = parseFloat(
    sessionStorage.getItem("CambioDolar") ?? "NaN"
  );
  if (CambioDolar_temp == NaN) {
    const res = await axios.post(
      "/api/DataSistema",
      {
        accion: "ObtenerCambioDolar"
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    CambioDolar_temp = parseFloat(res.data.value as string);
    sessionStorage.setItem("CambioDolar", CambioDolar_temp.toString());
  }

  const PrecioTotal = ServicioProductoTemp.reduce(
    (accumulator, currentValue) => {
      if (data.Moneda == Currency.Dolares) {
        if (
          currentValue.Currency.toLowerCase() == "dolar" ||
          currentValue.Currency.toLowerCase() == "dolares"
        )
          return (
            accumulator +
            parseInt(currentValue.Cantidad.toString()) *
              parseInt(currentValue.PrecioCotiUnitario.toString())
          );
        else
          return (
            accumulator +
            (parseInt(currentValue.Cantidad.toString()) *
              parseInt(currentValue.PrecioCotiUnitario.toString())) /
              CambioDolar_temp
          );
      } else {
        if (
          currentValue.Currency.toLowerCase() == "dolar" ||
          currentValue.Currency.toLowerCase() == "dolares"
        )
          return (
            accumulator +
            parseInt(currentValue.Cantidad.toString()) *
              parseInt(currentValue.PrecioCotiUnitario.toString()) *
              CambioDolar_temp
          );
        else
          return (
            accumulator +
            parseInt(currentValue.Cantidad.toString()) *
              parseInt(currentValue.PrecioCotiUnitario.toString())
          );
      }
    },
    0
  );

  let tempCotizacion: createReservaCotizacionBodyParam = {
    ServicioProducto: ServicioProductoTemp,
    NombreGrupo: data.NombreGrupo,
    CodGrupo: data.CodGrupo,
    NpasajerosAdult: parseInt(Cotizacion.NpasajerosAdult.toString()),
    NpasajerosChild: parseInt(Cotizacion.NpasajerosChild.toString()),
    NombrePrograma: Cotizacion.NombrePrograma,
    CodigoPrograma: Cotizacion.CodigoPrograma,
    Tipo: Cotizacion.Tipo.toString(),
    DuracionDias: parseInt(Cotizacion.DuracionDias.toString()),
    DuracionNoche: parseInt(Cotizacion.DuracionNoche.toString()),
    Localizacion: Cotizacion.Localizacion,
    Descripcion: Cotizacion.Descripcion,
    IdProgramaTuristico: Cotizacion.IdProgramaTuristico,
    FechaIN: Cotizacion.FechaIN,
    NumPaxTotal: parseInt(Cotizacion.NumPaxTotal.toString()),
    IdClienteProspecto: Cotizacion.IdClienteProspecto,
    Itinerario: [...Cotizacion.Itinerario],
    Incluye: [...Cotizacion.Incluye],
    NoIncluye: [...Cotizacion.NoIncluye],
    RecomendacionesLlevar: [...Cotizacion.RecomendacionesLlevar],
    Moneda: data.Moneda,
    FechaOUT: FechaOUTTemp.isValid() ? FechaOUTTemp.format("YYYY-MM-DD") : "",
    VoucherLink: "",
    Idioma: data.Idioma,
    FechaEntregaVoucher: "",
    PrecioTotal: PrecioTotal
  };

  return [tempCotizacion, null];
}
