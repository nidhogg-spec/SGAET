import { useState, useEffect } from "react";
import router, { useRouter } from "next/router";
import axios from "axios";
import customStyle from "@/globalStyles/LlenadoPasajeros.module.css";
import globalStyles from "@/globalStyles/modules/global.module.css";
import botones from "@/globalStyles/modules/boton.module.css";

import {
  pasajeroInterface,
  reservaCotizacionInterface,
  TipoAccion,
  TipoDocumento
} from "@/utils/interfaces/db";
import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { GetServerSideProps } from "next";

import AES from "crypto-js/aes";
import { enc } from "crypto-js";
import { useForm } from "react-hook-form";
import { generarLog } from "@/utils/functions/generarLog";
interface IProps {
  error: string | undefined;
  NumPasajeros: number;
  DatosPasajeros: pasajeroInterface[];
  IdReservaCotizcion: string;
  publicPage: true;
}
interface formPasajerosInterface {
  Nombres: string;
  Apellidos: string;
  TipoDocumento: string;
  NroDocumento: string;
  Sexo: string;
  FechaNacimiento: string;
  Celular: string;
  Email: string;
  Nacionalidad: string;
  UrlDocumentos: string;
  RegimenAlimenticioDescripcion: string;
  ProblemasMedicosDescripcion: string;
}
const keysDataPerPasajero = [
  "Nombres",
  "Apellidos",
  "TipoDocumento",
  "NroDocumento",
  "Sexo",
  "FechaNacimiento",
  "Celular",
  "Email",
  "Nacionalidad",
  "IdReservaCotizacion",
  "UrlDocumentos",
  "RegimenAlimenticioDescripcion",
  "RegimenAlimenticioEspecial",
  "ProblemasMedicos",
  "ProblemasMedicosDescripcion"
];

export default function LlenadoPasajeros({
  error,
  NumPasajeros,
  DatosPasajeros,
  IdReservaCotizcion,
  publicPage = true
}: IProps) {
  if (error) {
    return <p>Error: {error}</p>;
  }
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    reset
  } = useForm({
    mode: "onBlur"
  });

  const onSubmit = async (data: any) => {
    let formPasajerosData: formPasajerosInterface[] = [];
    for (let index = 0; index < NumPasajeros; index++) {
      formPasajerosData.push({
        Apellidos: data["Apellidos" + "_" + (index + 1)],
        Nombres: data["Nombres" + "_" + (index + 1)],
        TipoDocumento: data["TipoDocumento" + "_" + (index + 1)],
        NroDocumento: data["NroDocumento" + "_" + (index + 1)],
        Sexo: data["Sexo" + "_" + (index + 1)],
        FechaNacimiento: data["FechaNacimiento" + "_" + (index + 1)],
        Celular: data["Celular" + "_" + (index + 1)],
        Email: data["Email" + "_" + (index + 1)],
        Nacionalidad: data["Nacionalidad" + "_" + (index + 1)],
        UrlDocumentos: data["UrlDocumentos" + "_" + (index + 1)],
        RegimenAlimenticioDescripcion:
          data["RegimenAlimenticioDescripcion" + "_" + (index + 1)],
        ProblemasMedicosDescripcion:
          data["ProblemasMedicosDescripcion" + "_" + (index + 1)]
      });
    }
    const pasajeroList: pasajeroInterface[] = formPasajerosData.map(
      (pasajero: formPasajerosInterface, index): pasajeroInterface => {
        return {
          Apellidos: pasajero.Apellidos,
          Nombres: pasajero.Nombres,
          TipoDocumento: pasajero.TipoDocumento as any,
          NroDocumento: pasajero.NroDocumento,
          Sexo: pasajero.Sexo,
          FechaNacimiento: pasajero.FechaNacimiento,
          Celular: pasajero.Celular,
          Email: pasajero.Email,
          Nacionalidad: pasajero.Nacionalidad,
          UrlDocumentos: [pasajero.UrlDocumentos],
          RegimenAlimenticioDescripcion: pasajero.RegimenAlimenticioDescripcion,
          ProblemasMedicosDescripcion: pasajero.ProblemasMedicosDescripcion,
          IdReservaCotizacion: IdReservaCotizcion,
          NumPasajero: index + 1,
          RegimenAlimenticioEspecial:
            pasajero.RegimenAlimenticioDescripcion == "NO_ESPECIFICO",
          ProblemasMedicos: pasajero.ProblemasMedicosDescripcion != "",
          Estado: 1
        };
      }
    );
    await axios.put("/api/pasajero/" + IdReservaCotizcion, {
      Pasajero: pasajeroList
    });
    generarLog(
      TipoAccion.UPDATE,
      "actualizacion de reserva - lista de pasajeros"
    );
    router.reload();
  };

  useEffect(() => {
    let defaultList: any = {};
    if (DatosPasajeros.length != 0) {
      DatosPasajeros.forEach((DatosPasajero: pasajeroInterface, index) => {
        defaultList["Nombres_" + DatosPasajero.NumPasajero] =
          DatosPasajero.Nombres || "";
        defaultList["Apellidos_" + DatosPasajero.NumPasajero] =
          DatosPasajero.Apellidos || "";
        defaultList["TipoDocumento_" + DatosPasajero.NumPasajero] =
          DatosPasajero.TipoDocumento || "DNI";
        defaultList["NroDocumento_" + DatosPasajero.NumPasajero] =
          DatosPasajero.NroDocumento || "";
        defaultList["Sexo_" + DatosPasajero.NumPasajero] =
          DatosPasajero.Sexo || "FEMENINO";
        defaultList["FechaNacimiento_" + DatosPasajero.NumPasajero] =
          DatosPasajero.FechaNacimiento || "";
        defaultList["Celular_" + DatosPasajero.NumPasajero] =
          DatosPasajero.Celular || "";
        defaultList["Email_" + DatosPasajero.NumPasajero] =
          DatosPasajero.Email || "";
        defaultList["Nacionalidad_" + DatosPasajero.NumPasajero] =
          DatosPasajero.Nacionalidad || "Peruana";
        defaultList["UrlDocumentos_" + DatosPasajero.NumPasajero] =
          DatosPasajero.UrlDocumentos || "";
        defaultList[
          "RegimenAlimenticioDescripcion_" + DatosPasajero.NumPasajero
        ] = DatosPasajero.RegimenAlimenticioDescripcion || "NO_ESPECIFICO";
        defaultList[
          "ProblemasMedicosDescripcion_" + DatosPasajero.NumPasajero
        ] = DatosPasajero.ProblemasMedicosDescripcion || "";
      });
      reset(defaultList);
    }
  }, []);
  return (
    <div className={`${customStyle.MainContainer}`}>
      <h1>Datos de Pasajeros</h1>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        {DatosPasajeros.map((DataPasajero, index) => {
          return (
            <div key={"Formulario_" + index}>
              <div className={globalStyles.title_and_buttons_container}>
                <h2 className={customStyle.title}>Pasajero {index + 1}</h2>
              </div>
              {/* ----------------------------- Nombres ------------------------------------- */}
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Nombres</label>
                <input
                  type="text"
                  {...register("Nombres_" + (index + 1), { required: true })}
                />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors["Nombres_" + (index + 1)]?.type == "required" &&
                    "Los nombres son obligatorio"}
                </span>
              </div>
              {/* ----------------------------- Apellidos ------------------------------------- */}
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Apellidos</label>
                <input
                  type="text"
                  {...register("Apellidos_" + (index + 1), { required: true })}
                />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors["Apellidos_" + (index + 1)]?.type == "required" &&
                    "Los apellidos son obligatorio"}
                </span>
              </div>
              {/* ----------------------------- TipoDocumento ------------------------------------- */}
              <div className={`${globalStyles.global_textInput_container}`}>
                <label htmlFor="">Tipo de Documento</label>
                <select
                  {...register("TipoDocumento_" + (index + 1), {
                    required: true
                  })}
                >
                  <option key={"DNI"} value={"DNI"}>
                    {"DNI"}
                  </option>
                  <option key={"RUC"} value={"RUC"}>
                    {"RUC"}
                  </option>
                  <option key={"PASAPORTE"} value={"PASAPORTE"}>
                    {"PASAPORTE"}
                  </option>
                  <option
                    key={"CARNET_EXTRANJERIA"}
                    value={"CARNET_EXTRANJERIA"}
                  >
                    {"CARNET EXTRANJERIA"}
                  </option>
                  <option
                    key={"CEDULA_DIPLOMATICA"}
                    value={"CEDULA_DIPLOMATICA"}
                  >
                    {"CEDULA DIPLOMATICA"}
                  </option>
                  <option key={"OTRO"} value={"OTRO"}>
                    {"OTRO"}
                  </option>
                </select>
                <span className={`${globalStyles.global_error_message}`}>
                  {errors["TipoDocumento_" + (index + 1)]?.type == "required" &&
                    "Los Tipo de Documento es obligatorio"}
                </span>
              </div>
              {/* ----------------------------- NroDocumento ------------------------------------- */}
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Numero de Documento</label>
                <input
                  type="text"
                  {...register("NroDocumento_" + (index + 1), {
                    required: true,
                    pattern: /^[a-zA-Z0-9_]+$/,
                    validate: (value) => {
                      switch (getValues("TipoDocumento_" + (index + 1))) {
                        case "DNI":
                          return value && value.length === 8;
                        case "RUC":
                          return value && value.length === 11;
                        case "PASAPORTE":
                          return value && value.length === 12;
                        case "CARNET_EXTRANJERIA":
                          return value && value.length === 12;
                        case "CEDULA_DIPLOMATICA":
                          return value && value.length === 12;
                        case "OTRO":
                          return value && true;
                        default:
                          return false;
                      }
                    }
                  })}
                />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors["NroDocumento_" + (index + 1)]?.type == "required" &&
                    "El numero de documento es obligatorio"}
                  {errors["NroDocumento_" + (index + 1)]?.type == "pattern" &&
                    "El numero de documento no es valido"}
                  {errors["NroDocumento_" + (index + 1)]?.type == "validate" &&
                    "La longitud del numero de documento no es valida"}
                </span>
              </div>
              {/* ----------------------------- Sexo ------------------------------------- */}
              <div className={`${globalStyles.global_textInput_container}`}>
                <label htmlFor="">Sexo</label>
                <select
                  {...register("Sexo_" + (index + 1), { required: true })}
                >
                  <option key={"MASCULINO"} value={"MASCULINO"}>
                    {"Masculino"}
                  </option>
                  <option key={"FEMENINO"} value={"FEMENINO"}>
                    {"Femenino"}
                  </option>
                  <option key={"OTRO"} value={"OTRO"}>
                    {"Otro"}
                  </option>
                </select>
                <span className={`${globalStyles.global_error_message}`}>
                  {errors["Sexo_" + (index + 1)]?.type == "required" &&
                    "El sexo es obligatorio"}
                </span>
              </div>
              {/* ----------------------------- FechaNacimiento ------------------------------------- */}
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  {...register("FechaNacimiento_" + (index + 1), {
                    required: true
                  })}
                />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors["FechaNacimiento_" + (index + 1)]?.type ==
                    "required" && "El FechaNacimiento es obligatorio"}
                </span>
              </div>
              {/* ----------------------------- Celular ------------------------------------- */}
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Celular</label>
                <input
                  type="text"
                  {...register("Celular_" + (index + 1), {
                    pattern: /^[0-9_ +-]+$/
                  })}
                />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors["Celular_" + (index + 1)]?.type == "pattern" &&
                    "El Celular solo pude contener numeros"}
                </span>
              </div>
              {/* ----------------------------- Email ------------------------------------- */}
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Email</label>
                <input type="text" {...register("Email_" + (index + 1), {})} />
                <span className={`${globalStyles.global_error_message}`}></span>
              </div>
              {/* ----------------------------- Nacionalidad ------------------------------------- */}
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Nacionalidad</label>
                <input
                  type="text"
                  {...register("Nacionalidad_" + (index + 1), {})}
                />
                <span className={`${globalStyles.global_error_message}`}></span>
              </div>
              {/* ----------------------------- UrlDocumentos ------------------------------------- */}
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>UrlDocumentos</label>
                <input
                  type="text"
                  {...register("UrlDocumentos_" + (index + 1), {})}
                />
                <span className={`${globalStyles.global_error_message}`}></span>
              </div>
              {/* ----------------------------- RegimenAlimenticioDescripcion ------------------------------------- */}
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Regimen Alimenticio</label>
                <select
                  {...register("RegimenAlimenticioDescripcion_" + (index + 1), {
                    required: true
                  })}
                >
                  <option key={"NO_ESPECIFICO"} value={"NO_ESPECIFICO"}>
                    {"No Especifico"}
                  </option>
                  <option key={"VEGANO"} value={"VEGANO"}>
                    {"Vegano"}
                  </option>
                  <option key={"VEGETARIANO"} value={"VEGETARIANO"}>
                    {"Vegetariano"}
                  </option>
                  <option key={"CARNIVORO"} value={"CARNIVORO"}>
                    {"Carnivoro"}
                  </option>
                  <option key={"OTRO"} value={"OTRO"}>
                    {"Otro"}
                  </option>
                </select>
                <span className={`${globalStyles.global_error_message}`}>
                  {errors["RegimenAlimenticioDescripcion_" + (index + 1)]
                    ?.type == "required" &&
                    "El RegimenAlimenticioDescripcion es obligatorio"}
                </span>
              </div>
              {/* ----------------------------- ProblemasMedicosDescripcion ------------------------------------- */}
              <div className={`${globalStyles.global_textArea_container}`}>
                <label>Problemas Medicos</label>
                <textarea
                  id=""
                  cols={30}
                  rows={10}
                  {...register(
                    "ProblemasMedicosDescripcion_" + (index + 1),
                    {}
                  )}
                ></textarea>
                <span className={`${globalStyles.global_error_message}`}></span>
              </div>
            </div>
          );
        })}
        <div
          className={`${customStyle.botones_container} ${customStyle.botones_container_final}`}
        >
          <button
            className={`${botones.button} ${botones.buttonGuardar}`}
            type="submit"
          >
            Guardar
          </button>
        </div>
      </form>
      {/* {item.map((x,index)=>
                <ListaPasajeros
                    NumPasajeros={index+1}
                    setData={setDatoHijo}
                />
            )} */}
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query
}) => {
  let error = null;
  let NumPasajeros = null;
  let DatosPasajeros: pasajeroInterface[] = [];
  const secretKey = process.env.SECRET_KEY as string;
  let idUrl = query.llenadoPasajeros as string;

  if (idUrl == undefined) router.push("/");
  if (idUrl?.slice(0, 3) == "RC0") {
    idUrl = query.llenadoPasajeros as string;
  } else {
    idUrl = AES.decrypt(decodeURIComponent(idUrl), secretKey).toString(
      enc.Utf8
    );
  }

  if (idUrl?.slice(0, 3) == "RC0") {
    await connectToDatabase().then(async (connectedObject) => {
      const collectionReservaCotizacion =
        connectedObject.db.collection<reservaCotizacionInterface>(
          "ReservaCotizacion"
        );
      const reservaCotizacion = await collectionReservaCotizacion.findOne({
        IdReservaCotizacion: idUrl
      });
      if (reservaCotizacion == null)
        error = "No se encontro data de la reserva";

      NumPasajeros =
        parseInt(reservaCotizacion?.NpasajerosAdult.toString() ?? "0") +
        parseInt(reservaCotizacion?.NpasajerosChild.toString() ?? "0");

      if (NumPasajeros == null || NumPasajeros <= 0)
        error = "Error interno con el numero de pasajeros";

      const pasajeros = reservaCotizacion?.ListaPasajeros ?? [];

      if (pasajeros.length == 0) {
        for (let index = 0; index < NumPasajeros; index++) {
          DatosPasajeros.push({
            IdReservaCotizacion: idUrl,
            Nombres: "",
            Apellidos: "",
            TipoDocumento: TipoDocumento.DNI,
            NroDocumento: "",
            Sexo: "FEMENINO",
            FechaNacimiento: "",
            Celular: "",
            Email: "",
            Nacionalidad: "",
            UrlDocumentos: [],
            RegimenAlimenticioDescripcion: "NO_ESPECIFICO",
            RegimenAlimenticioEspecial: false,
            ProblemasMedicos: false,
            ProblemasMedicosDescripcion: "",
            NumPasajero: index + 1,
            Estado: 1
          });
        }
      } else {
        DatosPasajeros = pasajeros;
      }
    });
  } else {
    error = "Error en la URL";
  }

  return {
    props: {
      error: error,
      NumPasajeros: NumPasajeros,
      DatosPasajeros: DatosPasajeros,
      IdReservaCotizcion: idUrl,
      publicPage: true
    }
  };
};
