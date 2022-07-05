import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Dialog,
  DialogContent,
  Modal,
  Box,
  Fade,
  Backdrop
} from "@material-ui/core";
import MaterialTable from "material-table";
import axios from "axios";
import { useForm } from "react-hook-form";

// Estilos
import globalStyles from "@/globalStyles/modules/global.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import customStyle from "./ModalClientes_Leer.module.css";
import { clienteProspectoInterface } from "@/utils/interfaces/db";
import LoadingComp from "@/components/Loading/Loading";

import { programaTuristicoInterface } from "@/utils/interfaces/db";
import { useRouter } from "next/router";

interface props {
  open: boolean;
  setOpen: Function;
  ClienteProspecto: clienteProspectoInterface;
  Actualizando: boolean;
  setActualizando: Function;
}

export default function ModalProgramTuris_Nuevo({
  open,
  setOpen,
  ClienteProspecto,
  Actualizando,
  setActualizando
}: props) {
  const router = useRouter();
  const [openSiguientePaso, setOpenSiguientePaso] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    reset
  } = useForm({
    defaultValues: {
      NombreCompleto: "",
      TipoCliente: "Directo",
      Estado: "Prospecto",
      TipoDocumento: "DNI",
      NroDocumento: "",
      IdClienteProspecto: "",
      Celular: "",
      Email: ""
    },
    mode: "onBlur"
  });
  const [Loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const onSubmit = (data: any) => {
    let clientePropecto_nuevo: clienteProspectoInterface = {
      NombreCompleto: data.NombreCompleto,
      TipoCliente: data.TipoCliente,
      Estado: data.Estado,
      TipoDocumento: data.TipoDocumento,
      NroDocumento: data.NroDocumento,
      IdClienteProspecto: "",
      Celular: data.Celular,
      Email: data.Email
    };
    //@ts-ignore
    delete clientePropecto_nuevo.IdClienteProspecto;
    console.log(clientePropecto_nuevo);
    setOpen(false);
    setLoading(true);
    axios
      .post(`/api/cliente/clientes`, {
        accion: "update",
        data: clientePropecto_nuevo,
        IdClienteProspecto: ClienteProspecto.IdClienteProspecto
      })
      .then((result) => {
        if (
          result.data?.data["IdClienteProspecto"] == undefined ||
          result.data?.data["IdClienteProspecto"] == ""
        ) {
          router.reload();
          throw new Error("No se genero Id de prgrama turistico correctamente");
        }
        setLoading(false);
        setOpenSiguientePaso(true);
      });
  };
  useEffect(() => {
    reset({
      NombreCompleto: ClienteProspecto.NombreCompleto || "",
      TipoCliente: ClienteProspecto.TipoCliente || "",
      Estado: ClienteProspecto.Estado || "",
      TipoDocumento: ClienteProspecto.TipoDocumento || "",
      NroDocumento: ClienteProspecto.NroDocumento || "",
      IdClienteProspecto: ClienteProspecto.IdClienteProspecto || "",
      Celular: ClienteProspecto.Celular || "",
      Email: ClienteProspecto.Email || ""
    });
  }, [ClienteProspecto]);

  return (
    <>
      <LoadingComp Loading={Loading} />
      <Dialog
        open={openSiguientePaso}
        onClose={() => {
          router.reload();
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent>
          <div className={customStyle.postRegistro__container}>
            <h4>Cliente nuevo registrado. ¿Cual es su siguiente paso?</h4>
            <button
              onClick={() => {
                router.reload();
              }}
              className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}
            >
              Seguir en Lista de programas turisticos
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <Box className={globalStyles.modal__MainContainer}>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <div className={globalStyles.title_and_buttons_container}>
                <h1 className={customStyle.title}>Nuevo Cliente/Prospecto</h1>
              </div>
              <div className={`${customStyle.botones_container}`}>
                {!Actualizando && (
                  <button
                    className={`${botones.button} ${botones.buttonGuardar}`}
                    type="button"
                    onClick={() => {
                      setActualizando(true);
                    }}
                  >
                    Actualizar
                  </button>
                )}
              </div>
              <div>
                <h2>Datos del Cliente/Prospecto</h2>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Nombre del cliente</label>
                  <input
                    disabled={!Actualizando}
                    type="text"
                    {...register("NombreCompleto", { required: true })}
                  />
                  <span className={`${globalStyles.global_error_message}`}>
                    {errors.NombreCompleto?.type == "required" &&
                      "El Nombre del cliente es obligatorio"}
                  </span>
                </div>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label htmlFor="">Tipo de Cliente</label>
                  <select {...register("TipoCliente")} disabled={!Actualizando}>
                    <option key={"Corporativo"} value={"Corporativo"}>
                      {"Corporativo"}
                    </option>
                    <option key={"Directo"} value={"Directo"}>
                      {"Directo"}
                    </option>
                    <option key={"Otro"} value={"Otro"}>
                      {"Otro"}
                    </option>
                  </select>
                  <span
                    className={`${globalStyles.global_error_message}`}
                  ></span>
                </div>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label htmlFor="">Tipo de Documento</label>
                  <select
                    {...register("TipoDocumento")}
                    disabled={!Actualizando}
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
                  <span
                    className={`${globalStyles.global_error_message}`}
                  ></span>
                </div>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Numero de Documento</label>
                  <input
                    disabled={!Actualizando}
                    type="text"
                    {...register("NroDocumento", {
                      required: true,
                      pattern: /^[a-zA-Z0-9_]+$/,
                      validate: (value) => {
                        switch (getValues("TipoDocumento")) {
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
                    {errors.NroDocumento?.type == "required" &&
                      "El numero de documento del cliente es obligatorio"}
                    {errors.NroDocumento?.type == "pattern" &&
                      "El numero de documento no es valido"}
                    {errors.NroDocumento?.type == "validate" &&
                      "La longitud del numero de documento no es valida"}
                  </span>
                </div>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Celular</label>
                  <input
                    disabled={!Actualizando}
                    type="text"
                    {...register("Celular", {
                      pattern: /(\+\d{1,3}[- ]?)?\d{9}$/
                    })}
                  />
                  <span className={`${globalStyles.global_error_message}`}>
                    {errors.Celular?.type == "pattern" &&
                      "El numero de celular no es valido"}
                  </span>
                </div>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Email</label>
                  <input
                    disabled={!Actualizando}
                    type="text"
                    {...register("Email", {
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
                    })}
                  />
                  <span className={`${globalStyles.global_error_message}`}>
                    {errors.Email?.type == "pattern" && "El email no es valido"}
                  </span>
                </div>
              </div>
              {Actualizando && (
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
              )}
            </form>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

function formatear_programaTuristico_database(
  form_data: any,
  itinerario: any[],
  Incluye: any[],
  NoIncluye: any[],
  RecomendacionesLlevar: any[],
  ServicioProducto: any[]
): programaTuristicoInterface {
  itinerario.map((data) => {
    delete data.tableData;
  });
  Incluye.map((data) => {
    delete data.tableData;
  });
  NoIncluye.map((data) => {
    delete data.tableData;
  });
  RecomendacionesLlevar.map((data) => {
    delete data.tableData;
  });
  ServicioProducto.map((data) => {
    delete data.tableData;
  });
  return {
    NombrePrograma: form_data.NombrePrograma,
    Estado: 1,
    CodigoPrograma: form_data.CodigoPrograma,
    Tipo: form_data.Tipo,
    DuracionDias: form_data.DuracionDias,
    DuracionNoche: form_data.DuracionNoche,
    Localizacion: form_data.Localizacion,
    Descripcion: form_data.Descripcion,
    Itinerario: [...itinerario],
    ItinerarioDescripcion: form_data.ItinerarioDescripcion,
    Incluye: [...Incluye],
    NoIncluye: [...NoIncluye],
    RecomendacionesLlevar: [...RecomendacionesLlevar],
    ServicioProducto: [...ServicioProducto],
    IdProgramaTuristico: ""
  };
}