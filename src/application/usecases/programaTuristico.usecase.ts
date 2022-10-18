import { ProgramaTuristicoRepository } from "@/src/adapters/repository/programaTuristico.repository";
import { dbColeccionesFormato } from "@/utils/interfaces/db";

export class ProgramaTuristicoUsecase {
  reservaCotizacionRepository: ProgramaTuristicoRepository;
  coleccion: { prefijo: string; coleccion: string; keyId: string };
  constructor() {
    this.reservaCotizacionRepository = new ProgramaTuristicoRepository();
    this.coleccion = dbColeccionesFormato.ReservaCotizacion;
  }
  async listOne(id: string) {
    return await this.reservaCotizacionRepository.findWithFilters({
      IdProgramaTuristico: id
    });
  }
}
