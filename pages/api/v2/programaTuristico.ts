import { createReservaCotizacionDataDTO } from "@/src/application/usecases/dto/reseervaCotizacion.dto";
import { ProgramaTuristicoUsecase } from "@/src/application/usecases/programaTuristico.usecase";
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
      await obtenerProgramaTuristico(req, res);
      return;
      break;
  }
}

async function obtenerProgramaTuristico(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const idProgramaTuristico = req.query.idProgramaTuristico;
  if (typeof idProgramaTuristico != "string") {
    res.status(400).send("idProgramaTuristico should be a one string");
    return;
  }
  const programaTuristicoUsecase = new ProgramaTuristicoUsecase();
  const result = await programaTuristicoUsecase.listOne(idProgramaTuristico);
  res.status(200).send(result);
}
