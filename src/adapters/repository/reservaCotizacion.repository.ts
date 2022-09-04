import { myMongoDB } from "@/src/infraestructure/mongoDb/mongoDb";
import {
  dbColeccionesFormato,
  reservaCotizacionInterface
} from "@/utils/interfaces/db";
import { mongoBaseRepository } from "./mongo.base";

export class ReservaCotizacionRepository extends mongoBaseRepository<reservaCotizacionInterface> {
  // public collection: string = dbColeccionesFormato.ReservaCotizacion.coleccion;
  constructor() {
    super(dbColeccionesFormato.ReservaCotizacion.coleccion);
  }
}
