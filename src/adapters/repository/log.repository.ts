import {
  dbColeccionesFormato,
  systemLogInterface
} from "@/utils/interfaces/db";
import { mongoBaseRepository } from "./mongo.base";

export class SystemLogRepository extends mongoBaseRepository<systemLogInterface> {
  // public collection: string = dbColeccionesFormato.SystemLog.coleccion;
  constructor() {
    super(dbColeccionesFormato.SystemLog.coleccion);
  }
}
