import {
  dbColeccionesFormato,
  systemLogInterface,
  TipoDocumento
} from "@/utils/interfaces/db";
import { SystemLogRepository } from "@/src/adapters/repository/log.repository";
export class SystemLogUsecase {
  systemLogRepository: SystemLogRepository;
  coleccion: { prefijo: string; coleccion: string; keyId: string };
  constructor() {
    this.systemLogRepository = new SystemLogRepository();
    this.coleccion = dbColeccionesFormato.SystemLog;
  }

  async create(newLog: systemLogInterface) {
    const result = await this.systemLogRepository.insertOne(newLog);
    return result;
  }

  async list() {
    const res = await this.systemLogRepository.findWithFilters(
      {},
      {
        _id: 0
      }
    );
    return res;
  }
}
