import axios from "axios";
import { TipoAccion, userInterface } from "../interfaces/db";

export function generarLog(Accion: TipoAccion, Descripcion: string) {
  try {
    axios.post("/api/v2/systemLogs", {
      systemLog: {
        Accion: Accion,
        Descripcion: Descripcion
      }
    });
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
    return;
  }
}
