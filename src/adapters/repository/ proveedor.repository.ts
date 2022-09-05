import {
  dbColeccionesFormato,
  proveedorInterface
} from "@/utils/interfaces/db";
import { mongoBaseRepository } from "./mongo.base";

export class ReservaCotizacionRepository extends mongoBaseRepository<proveedorInterface> {
  constructor() {
    super(dbColeccionesFormato.Proveedor.coleccion);
  }
}
