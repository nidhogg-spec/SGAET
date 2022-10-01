import { createReservaCotizacionDataDTO } from "@/src/application/usecases/dto/reseervaCotizacion.dto";
import { ReservaCotizacionUsecase } from "@/src/application/usecases/reservaCorizacion.usecase";
import { validateCreateReservaCotizacionBodyParam } from "@/utils/API/validation/reservaCotizacion.validation";
import { Currency, Idiomas } from "@/utils/dominio";
import { NextApiRequest, NextApiResponse } from "next";

export default async function reservaCottizacionHttp(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      await obtenerReservaCotizacion(req, res);
      return;
      break;
    case "POST":
      await crearReservaCotizacion(req, res);
      return;
      break;
    case "PUT":
      await actualizarReservaCotizacion(req, res);
      return;
      break;
    case "DELETE":
      await eliminarReservaCotizacion(req, res);
      return;
      break;
    default:
      res.status(404).send("This method doeesn exist");
      return;
      break;
  }
}

async function obtenerReservaCotizacion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const estado = req.query.estado;

  if (estado != "0" && estado != "1" && estado != "all") {
    res
      .status(400)
      .send(
        "parametro estado invalido o no  existente, deberia ser 0 o 1 o all"
      );
    return;
  }
  let filter: number | string = estado as string;
  if (estado == "0" || estado == "1") filter = parseInt(estado);
  const reservaCotizacionUsecase = new ReservaCotizacionUsecase();

  const result = await reservaCotizacionUsecase.list();
  res.status(200).send(result);
}

async function crearReservaCotizacion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let reservaCotizacionInput = req.body.reservaCotizacion;
  if (!reservaCotizacionInput) {
    res.status(400).send({
      status: 400,
      message: "reservaCotizacion not founded"
    });
    return;
  }

  const [reservaCotizacionreqBody, errors, status] =
    validateCreateReservaCotizacionBodyParam(reservaCotizacionInput);
  if (!reservaCotizacionreqBody) {
    res.status(400).send({
      status: status,
      message: errors
    });
    return;
  }
  const reservaCotizacionUsecase = new ReservaCotizacionUsecase();
  let dto: createReservaCotizacionDataDTO = {
    ServicioProducto: reservaCotizacionreqBody.ServicioProducto,
    NombreGrupo: reservaCotizacionreqBody.NombreGrupo,
    CodGrupo: reservaCotizacionreqBody.CodGrupo,
    NpasajerosAdult: reservaCotizacionreqBody.NpasajerosAdult,
    NpasajerosChild: reservaCotizacionreqBody.NpasajerosChild,
    NombrePrograma: reservaCotizacionreqBody.NombrePrograma,
    CodigoPrograma: reservaCotizacionreqBody.CodigoPrograma,
    Tipo: reservaCotizacionreqBody.Tipo,
    DuracionDias: reservaCotizacionreqBody.DuracionDias,
    DuracionNoche: reservaCotizacionreqBody.DuracionNoche,
    Localizacion: reservaCotizacionreqBody.Localizacion,
    Descripcion: reservaCotizacionreqBody.Descripcion,
    Itinerario: reservaCotizacionreqBody.Itinerario,
    Incluye: reservaCotizacionreqBody.Incluye,
    NoIncluye: reservaCotizacionreqBody.NoIncluye,
    RecomendacionesLlevar: reservaCotizacionreqBody.RecomendacionesLlevar,
    IdProgramaTuristico: reservaCotizacionreqBody.IdProgramaTuristico,
    FechaIN: reservaCotizacionreqBody.FechaIN,
    NumPaxTotal: reservaCotizacionreqBody.NumPaxTotal,
    IdClienteProspecto: reservaCotizacionreqBody.IdClienteProspecto,
    Idioma: reservaCotizacionreqBody.Idioma,
    Moneda: reservaCotizacionreqBody.Moneda,
    FechaOUT: reservaCotizacionreqBody.FechaOUT,
    VoucherLink: reservaCotizacionreqBody.VoucherLink,
    FechaEntregaVoucher: reservaCotizacionreqBody.FechaEntregaVoucher,
    PrecioTotal: reservaCotizacionreqBody.PrecioTotal
  };
  const host = req.headers.host || "";
  const result = await reservaCotizacionUsecase.create(dto, host);
  res.status(200).send(result);
}

async function actualizarReservaCotizacion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const estado = req.query.estado;

  if (estado != "0" && estado != "1" && estado != "all") {
    res.status(400).send("parametro estado invalido");
    return;
  }
  let filter: number | string = estado as string;
  if (estado == "0" || estado == "1") filter = parseInt(estado);
  const reservaCotizacionUsecase = new ReservaCotizacionUsecase();
  const result = await reservaCotizacionUsecase.list(filter as 0 | 1 | "all");
  res.status(200).send(result);
}

async function eliminarReservaCotizacion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const estado = req.query.estado;

  if (estado != "0" && estado != "1" && estado != "all") {
    res.status(400).send("parametro estado invalido");
    return;
  }
  let filter: number | string = estado as string;
  if (estado == "0" || estado == "1") filter = parseInt(estado);
  const reservaCotizacionUsecase = new ReservaCotizacionUsecase();
  const result = await reservaCotizacionUsecase.list(filter as 0 | 1 | "all");
  res.status(200).send(result);
}
