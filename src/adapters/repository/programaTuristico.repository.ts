import {
  dbColeccionesFormato,
  programaTuristicoInterface
} from "@/utils/interfaces/db";
import { mongoBaseRepository } from "./mongo.base";

export class ProgramaTuristicoRepository extends mongoBaseRepository<programaTuristicoInterface> {
  // public collection: string = dbColeccionesFormato.ProgramaTuristico.coleccion;
  constructor() {
    super(dbColeccionesFormato.ProgramaTuristico.coleccion);
  }
}
