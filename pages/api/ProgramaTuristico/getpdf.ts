import { PdfProgramaTuristicoUsecase } from "@/src/application/usecases/pdf/generarProgramaTuristico.usecase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getpdf(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {
    query: { IdProgramaTuristico }
  } = req;
  const pdfGenerator = new PdfProgramaTuristicoUsecase();
  if (typeof IdProgramaTuristico != "string") {
    res.status(400).send("there is no IdProgramaTuristico");
    return;
  }
  const [pdf, err] = await pdfGenerator.generate(IdProgramaTuristico);
  if (err)
    res
      .status(400)
      .send("there is and error generating pdf - " + JSON.stringify(err));
  res.send(pdf);
}
