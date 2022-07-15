// Objetivo: Inicializar la configuración de la aplicación

import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import InitConfiguration from "@/utils/init_config";

export default function (req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      res.status(200);
      InitConfiguration();
      break;
    default:
      res.status(500).json({
        message: "Error - metodo HTTP incorrecto"
      });
      break;
  }
}
