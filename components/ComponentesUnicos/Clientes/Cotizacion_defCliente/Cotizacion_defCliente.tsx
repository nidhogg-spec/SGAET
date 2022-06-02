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
import customStyle from "./Cotizacion_defCliente.module.css";
import { clienteProspectoInterface } from "@/utils/interfaces/db";
import LoadingComp from "@/components/Loading/Loading";

import { programaTuristicoInterface } from "@/utils/interfaces/db";
import { useRouter } from "next/router";

interface props {
  open: boolean;
  setOpen: Function;
  fase: number;
  setFase: Function;
  clienteProspecto: clienteProspectoInterface;
  setClienteProspecto: (cliente: clienteProspectoInterface) => {};
}
export default function Cotizacion_defCliente({
  fase,
  setFase,
  clienteProspecto,
  setClienteProspecto
}: props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openSiguientePaso, setOpenSiguientePaso] = useState(false);
  const [Link_ultimoIngresado, setLink_ultimoIngresado] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues
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
  const [ListaClientes, setListaClientes] = useState<
    clienteProspectoInterface[]
  >([] as clienteProspectoInterface[]);

  useEffect(() => {
    axios
      .get(`/api/cliente/clientes`)
      .then((res) => {
        setListaClientes(res.data.ListaClientes);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
        accion: "create",
        data: clientePropecto_nuevo
      })
      .then((result) => {
        if (
          result.data?.data["IdClienteProspecto"] == undefined ||
          result.data?.data["IdClienteProspecto"] == ""
        ) {
          throw new Error("No se genero Id de prgrama turistico correctamente");
        }
        setClienteProspecto(result.data.data);
        axios
          .get(`/api/cliente/clientes`)
          .then((res) => {
            setListaClientes(res.data.ListaClientes);
          })
          .catch((err) => {
            console.log(err);
          });
        setLoading(false);
        setOpenSiguientePaso(true);
      });
  };
  const siguienteFase = () => {
    console.log(clienteProspecto);
    if (clienteProspecto.NombreCompleto) {
      setFase(2);
    } else {
      alert("Debe seleccionar un cliente");
    }
  };
  return (
    <>
      <LoadingComp Loading={Loading} />
      <Dialog
        open={openSiguientePaso}
        onClose={() => {
          setOpenSiguientePaso(false);
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent>
          <div className={customStyle.postRegistro__container}>
            <h4>Cliente/Prospecto nuevo registrado. ¿Continuar?</h4>
            <button
              onClick={() => {
                setOpenSiguientePaso(false);
              }}
              className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}
            >
              Continuar
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
                <button
                  className={`${botones.button} ${botones.buttonGuardar}`}
                  type="submit"
                >
                  Guardar
                </button>
              </div>
              <div>
                <h2>Datos del Cliente/Prospecto</h2>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Nombre del cliente</label>
                  <input
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
                  <select {...register("TipoCliente")}>
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
                  <select {...register("TipoDocumento")}>
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
          </Box>
        </Fade>
      </Modal>
      {fase == 1 && (
        <>
          <div className={customStyle.Formulario_Fase1}>
            <div className={customStyle.Fase1_titulo}>
              <h2>Paso 1: Define al cliente</h2>
              <div className={`${customStyle.botones_container}`}>
                <button
                  className={`${botones.button} ${botones.buttonGuardar}`}
                  onClick={siguienteFase}
                >
                  Siguiente paso
                </button>
                <button
                  className={`${botones.button} ${botones.buttonGuardar}`}
                  onClick={() => setOpen(true)}
                >
                  Nuevo Cliente
                </button>
              </div>
            </div>

            <div className={`${globalStyles.global_textInput_container}`}>
              <label>Nombre del cliente</label>
              <input
                type="text"
                disabled
                value={clienteProspecto.NombreCompleto}
              />
            </div>
            <div className={`${globalStyles.global_textInput_container}`}>
              <label>Tipo de Documento</label>
              <input
                type="text"
                disabled
                value={clienteProspecto.TipoDocumento}
              />
            </div>
            <div className={`${globalStyles.global_textInput_container}`}>
              <label>Numero de Documento</label>
              <input
                type="text"
                disabled
                value={clienteProspecto.NroDocumento}
              />
            </div>
            <MaterialTable
              title="Seleccione un cliente corporativo"
              columns={[
                {
                  title: "Nombre Completo",
                  field: "NombreCompleto"
                },
                {
                  title: "Tipo Documento",
                  field: "TipoDocumento"
                },
                {
                  title: "Numero de Documento",
                  field: "NroDocumento"
                },
                { title: "Tipo de Cliente", field: "TipoCliente" },
                { title: "Celular", field: "Celular" }
              ]}
              data={ListaClientes}
              actions={[
                {
                  icon: "check",
                  tooltip: "Seleccione Cliente",
                  onClick: (event, rowData: any) => {
                    setClienteProspecto(rowData);
                  }
                }
              ]}
            />
          </div>
          <div
            className={`${customStyle.botones_container} ${customStyle.botones_container_final}`}
          >
            <button
              className={`${botones.button} ${botones.buttonGuardar}`}
              onClick={siguienteFase}
            >
              Siguiente paso
            </button>
          </div>
        </>
      )}
    </>
  );
}
