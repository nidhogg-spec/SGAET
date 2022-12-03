import { PdfReservaCotizacionUsecase } from "@/src/application/usecases/pdf/generarReservaCotizacion.usecase";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const {
    query: { IdReservaCotizacion }
  } = req;
  const pdfGenerator = new PdfReservaCotizacionUsecase();
  if (typeof IdReservaCotizacion != "string") {
    res.status(400).send("there is no IdReservaCotizacion");
    return;
  }
  const [pdf, err] = await pdfGenerator.generate(IdReservaCotizacion);
  if (err)
    res
      .status(400)
      .send("there is and error generating pdf - " + JSON.stringify(err));
  res.status(200).setHeader("Content-Type", "application/pdf").send(pdf);
};
