import { generarIdNuevo } from "@/utils/API/generarId";
import {
  dbColeccionesFormato,
  reservaCotizacionInterface,
  TipoDocumento
} from "@/utils/interfaces/db";
import { ReservaCotizacionRepository } from "../../adapters/repository/reservaCotizacion.repository";
import { createReservaCotizacionDataDTO } from "./dto/reseervaCotizacion.dto";
import { AES, enc } from "crypto-js";
export class ReservaCotizacionUsecase {
  reservaCotizacionRepository: ReservaCotizacionRepository;
  coleccion: { prefijo: string; coleccion: string; keyId: string };
  constructor() {
    this.reservaCotizacionRepository = new ReservaCotizacionRepository();
    this.coleccion = dbColeccionesFormato.ReservaCotizacion;
  }

  async create(newReserCoti: createReservaCotizacionDataDTO, host: string) {
    const newId = await generarIdNuevo(this.coleccion);

    const servicios = newReserCoti.ServicioProducto.map((servi) => {
      return {
        ...servi,
        IdReservaCotizacion: newId
      };
    });
    const listaPasajeros: reservaCotizacionInterface["ListaPasajeros"] = [];

    for (let i = 0; i < newReserCoti.NumPaxTotal; i++) {
      listaPasajeros.push({
        Nombres: "",
        Apellidos: "",
        TipoDocumento: TipoDocumento.PASAPORTE,
        NroDocumento: "",
        Sexo: "",
        FechaNacimiento: "",
        Celular: "",
        Email: "",
        Nacionalidad: "",
        IdReservaCotizacion: "",
        UrlDocumentos: [],
        RegimenAlimenticioDescripcion: "",
        RegimenAlimenticioEspecial: false,
        ProblemasMedicos: false,
        ProblemasMedicosDescripcion: "",
        NumPasajero: i,
        Estado: 1
      });
    }

    // Generacion de url de lennado dew pasajeros encriptado
    const secretKey = process.env.SECRET_KEY as string;
    const idUrl = encodeURIComponent(AES.encrypt(newId, secretKey).toString());

    let reservaCotizacion: reservaCotizacionInterface = {
      ...newReserCoti,
      Estado: 0,
      IdReservaCotizacion: newId,
      ServicioProducto: servicios,
      ListaPasajeros: listaPasajeros,
      URLLlenadoPasajeros: host + "/LlenadoPasajeros/" + idUrl
    };
    const result = await this.reservaCotizacionRepository.insertOne(
      reservaCotizacion
    );
    return result;
  }

  async list(estado: 0 | 1 | number[] | "all" = 1) {
    const res = await this.reservaCotizacionRepository.find(estado);
    return res;
  }
}
