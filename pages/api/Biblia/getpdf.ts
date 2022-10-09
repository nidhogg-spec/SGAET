import { PdfBibliaUsecase } from "@/src/application/usecases/pdf/generarBiblia.usecase";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const {
    query: { IdReservaCotizacion }
  } = req;

  const pdfGenerator = new PdfBibliaUsecase();
  if (typeof IdReservaCotizacion != "string") {
    res.status(400).send("there is no IdReservaCotizacion");
    return;
  }
  const [pdf, err] = await pdfGenerator.generate(IdReservaCotizacion);
  if (err)
    res
      .status(400)
      .send("there is and error generating pdf - " + JSON.stringify(err));
  res.send(pdf);
};
