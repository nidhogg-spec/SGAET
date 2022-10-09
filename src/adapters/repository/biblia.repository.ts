import { dbColeccionesFormato, bibliaInterface } from "@/utils/interfaces/db";
import { mongoBaseRepository } from "./mongo.base";

export class BibliaRepository extends mongoBaseRepository<bibliaInterface> {
  // public collection: string = dbColeccionesFormato.Biblia.coleccion;
  constructor() {
    super(dbColeccionesFormato.Biblia.coleccion);
  }
}
