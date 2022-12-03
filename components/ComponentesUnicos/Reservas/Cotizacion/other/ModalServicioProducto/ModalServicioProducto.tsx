// Paquetes
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as uuid from "uuid";
import moment from "moment";
import _ from "lodash";

// Interfaces
import { reservaCotizacionInterface } from "@/utils/interfaces/db";
import { listarServiciosHttp } from "@/utils/interfaces/API/cotizacion/listarServicio.interface";
interface props {
  Cotizacion: reservaCotizacionInterface;
  setCotizacion: React.Dispatch<
    React.SetStateAction<reservaCotizacionInterface | undefined>
  >;
  ListaTodosServicios: listarServiciosHttp[];
  setListaTodosServicios: React.Dispatch<
    React.SetStateAction<listarServiciosHttp[]>
  >;
}

// Componentes
import {
  AlertViewer,
  alertViewerData
} from "@/components/ComponentesReutilizables/AlertViewer/AlertViewer.component";
import { Box, Fade, Modal } from "@mui/material";
import MaterialTable, { Column } from "material-table";
import { Edit } from "@mui/icons-material";
import LoadingComp from "@/components/Loading/Loading";

// Estilos
import globalStyles from "@/globalStyles/modules/global.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import customStyle from "./ModalServicioProducto.module.css";

export default function ModalServicioProducto({
  Cotizacion,
  setCotizacion,
  ListaTodosServicios,
  setListaTodosServicios
}: props) {
  const [Show1, setShow1] = useState(false);
  const [Show2, setShow2] = useState(false);
  const [AlertViewerData, setAlertViewerData] = useState<alertViewerData>({
    show: false,
    aletType: "error",
    message: ""
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    reset
  } = useForm({
    defaultValues: {
      IdServicioEscogido: "",
      Cantidad: 1,
      NombreServicio: "",
      Dia: 1,
      PrecioConfiUnitario: 0,
      PrecioCotiUnitario: 0
    }
  });

  // const upateData = (data) => {
  // };

  return (
    <>
      <AlertViewer
        alertViewerData={AlertViewerData}
        setData={setAlertViewerData}
      />
      <button
        className={`${botones.button} ${botones.GenerickButton} ${botones.button_border}`}
        onClick={() => {
          setShow2(true);
        }}
      >
        Anadir mas servicio
      </button>
      <button
        className={`${botones.button} ${botones.GenerickButton} ${botones.button_border}`}
        onClick={() => {
          setShow1(true);
        }}
      >
        Editar servicios
      </button>
      <Modal
        open={Show1}
        onClose={() => {
          setShow1(false);
        }}
        closeAfterTransition
      >
        <Fade in={Show1}>
          <Box className={globalStyles.modal__MainContainer}>
            <form
              action=""
              onSubmit={handleSubmit((data) => {
                let tempServicioProductoIndex =
                  Cotizacion.ServicioProducto.findIndex(
                    (servi) =>
                      data.IdServicioEscogido == servi.IdServicioEscogido
                  );
                if (
                  tempServicioProductoIndex &&
                  tempServicioProductoIndex == -1
                ) {
                  setAlertViewerData({
                    show: true,
                    aletType: "error",
                    message: "Error - No existe IdServicioEscogido valido"
                  });
                  return;
                }
                let tempServicioProducto = {
                  ...Cotizacion.ServicioProducto[tempServicioProductoIndex]
                };
                tempServicioProducto = _.cloneDeep(tempServicioProducto);
                tempServicioProducto = {
                  ...tempServicioProducto,
                  Cantidad: data.Cantidad,
                  Dia: data.Dia,
                  PrecioConfiUnitario: data.PrecioConfiUnitario,
                  PrecioCotiUnitario: data.PrecioCotiUnitario,
                  PrecioConfiTotal: data.PrecioConfiUnitario * data.Cantidad,
                  PrecioCotiTotal: data.PrecioCotiUnitario * data.Cantidad,
                  FechaReserva: Cotizacion.FechaIN
                    ? moment(Cotizacion.FechaIN)
                        .add(data.Dia - 1, "days")
                        .format("DD/MM/YYYY")
                    : ""
                };
                let tempCotizacion = { ...Cotizacion };
                tempCotizacion.ServicioProducto[tempServicioProductoIndex] = {
                  ...tempServicioProducto
                };
                setCotizacion({
                  ...tempCotizacion
                });
              })}
            >
              <div>
                <div>
                  <h2>Editar servicios de cotizacion </h2>
                  <div className={`${customStyle.botones_container}`}>
                    <button
                      className={`${botones.button} ${botones.buttonGuardar}`}
                      type="submit"
                    >
                      Actualizar
                    </button>
                  </div>
                </div>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Nombre de servicio</label>
                  <input
                    type="text"
                    {...register("NombreServicio", {
                      required: true
                    })}
                    disabled
                  />
                  <span className={`${globalStyles.global_error_message}`}>
                    {errors.NombreServicio?.type == "required" &&
                      "El numero de servicio es necesario"}
                  </span>
                </div>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Cantidad</label>
                  <input
                    type="number"
                    {...register("Cantidad", { required: true })}
                    min={1}
                  ></input>
                  <span className={`${globalStyles.global_error_message}`}>
                    {errors.Cantidad?.type == "required" &&
                      "La cantidad es obligatoria"}
                  </span>
                </div>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Dia</label>
                  <input
                    type="number"
                    {...register("Dia", { required: true })}
                    min={1}
                  ></input>
                  <span className={`${globalStyles.global_error_message}`}>
                    {errors.Dia?.type == "required" &&
                      "La cantidad es obligatoria"}
                  </span>
                </div>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Precio Cotizacion Unitario</label>
                  <input
                    type="number"
                    {...register("PrecioCotiUnitario", { required: true })}
                    min={1}
                  ></input>
                  <span className={`${globalStyles.global_error_message}`}>
                    {errors.PrecioCotiUnitario?.type == "required" &&
                      "El Precio Cotizacion Unitario es obligatoria"}
                  </span>
                </div>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Precio Confidencial Unitario</label>
                  <input
                    type="number"
                    {...register("PrecioConfiUnitario", { required: true })}
                    min={1}
                  ></input>
                  <span className={`${globalStyles.global_error_message}`}>
                    {errors.PrecioConfiUnitario?.type == "required" &&
                      "El Precio Confidencial Unitario es obligatoria"}
                  </span>
                </div>
                <div className={`${globalStyles.global_table_container}`}>
                  <MaterialTable
                    title={"Lista de Servicios"}
                    columns={columnasServicioProducto}
                    data={Cotizacion.ServicioProducto}
                    editable={{
                      onRowDelete: (oldData) =>
                        new Promise((resolve, reject) => {
                          setTimeout(() => {
                            const tempListaServicio = [
                              ...Cotizacion.ServicioProducto
                            ];
                            const selected = tempListaServicio.findIndex(
                              (servi) =>
                                oldData.IdServicioEscogido ==
                                servi.IdServicioEscogido
                            );
                            tempListaServicio.splice(selected, 1);
                            setCotizacion({
                              ...Cotizacion,
                              ServicioProducto: [...tempListaServicio]
                            });
                            resolve(true);
                          }, 1000);
                        })
                    }}
                    actions={[
                      {
                        icon: "edit",
                        tooltip: "Seleccionar servicio para edicion",
                        onClick: (event, rowData) => {
                          let divWithScroll = document.getElementsByClassName(
                            globalStyles.modal__MainContainer
                          );
                          //@ts-ignore
                          divWithScroll[0].scrollTop = 0;
                          reset({
                            IdServicioEscogido: rowData["IdServicioEscogido"],
                            Cantidad: rowData["Cantidad"],
                            Dia: rowData["Dia"],
                            NombreServicio: rowData["NombreServicio"],
                            PrecioConfiUnitario: rowData["PrecioConfiUnitario"],
                            PrecioCotiUnitario: rowData["PrecioCotiUnitario"]
                          });
                        }
                      }
                    ]}
                  />
                </div>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
      <Modal
        open={Show2}
        onClose={() => {
          setShow2(false);
        }}
        closeAfterTransition
      >
        <Fade in={Show2}>
          <Box className={globalStyles.modal__MainContainer}>
            <div>
              <h2>Aumentar mas servicio a reserva</h2>
              <p>
                La tabla de la izquierda contiene todos los servicios que
                actualmente se encuentra en la cotizacion. La tabla de la
                derecha contiene todos los servicios disponibles dentro del
                sistema. Puedes hacer click en el boton "+" para aumentarlo a
                laos servicios que se consideraran para la cotizacion. Estos
                datos se pueden alterar en el siguiente modal.
              </p>
              <div
                className={`${globalStyles.global_table_container} ${customStyle.containerDosTablas}`}
              >
                <MaterialTable
                  title={""}
                  columns={columnasServicioProductoMini}
                  data={Cotizacion.ServicioProducto}
                  style={{
                    width: "30%"
                  }}
                />
                <span
                  style={{
                    justifySelf: "center",
                    textAlign: "center",
                    alignSelf: "center",
                    width: "5%"
                  }}
                >
                  {"<="}
                </span>
                <MaterialTable
                  title={"Servicios para añadir"}
                  columns={columnasTodosServicios}
                  data={ListaTodosServicios}
                  style={{
                    width: "65%"
                  }}
                  actions={[
                    {
                      icon: "edit",
                      tooltip: "Añadir Servicio a Cotizacion",
                      onClick: (event, rowData) => {
                        let NewListaServicioProducto = [
                          ...Cotizacion.ServicioProducto
                        ];
                        NewListaServicioProducto.push({
                          IdServicioProducto: rowData["IdServicioProducto"],
                          TipoServicio: rowData["TipoServicio"],
                          PrecioConfiUnitario: rowData["Costo"],
                          NombreServicio: rowData["Nombre"],
                          Dia: 1,
                          Cantidad: 1,
                          PrecioCotiUnitario: rowData["Precio"],
                          IGV: rowData["IGV"],
                          PrecioCotiTotal: rowData["Precio"],
                          PrecioConfiTotal: rowData["Costo"],
                          Currency: rowData["Currency"],
                          PrecioPublicado: rowData["PrecioPublicado"],
                          IdProveedor: rowData["IdProveedor"],
                          Estado: 1,
                          FechaReserva: moment(Cotizacion.FechaIN).format(
                            "YYYY-MM-DD"
                          ),
                          IdReservaCotizacion: "",
                          IdServicioEscogido: uuid.v1(),
                          FechaLimitePago: ""
                        });
                        setCotizacion({
                          ...Cotizacion,
                          ServicioProducto: [...NewListaServicioProducto]
                        });
                      }
                    }
                  ]}
                />
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

const columnasTodosServicios: Column<any>[] = [
  {
    field: "IdServicioProducto",
    title: "IdServicioProducto",
    editable: "never",
    hidden: true
  },
  {
    field: "TipoServicio",
    title: "Tipo de Servicio",
    editable: "never"
  },
  { field: "Nombre", title: "Nombre", editable: "never" },
  { title: "Nombre del Proveedor", field: "NombreProveedor" },
  { title: "Puntaje del Proveedor", field: "PuntajeProveedor" },
  { field: "Descripcion", title: "Descripcion", editable: "never" },
  {
    field: "Currency",
    title: "Moneda",
    editable: "never",
    lookup: { Dolar: "Dolares", Sol: "Nuevos Soles" }
  },
  {
    field: "Precio",
    title: "Precio Cotizacion",
    editable: "never",
    type: "numeric"
  },
  {
    field: "Costo",
    title: "Precio Confidencial",
    editable: "never",
    type: "numeric"
  },
  {
    field: "PrecioPublicado",
    title: "Precio Publicado",
    editable: "never",
    type: "numeric"
  }
];

const columnasServicioProducto: Column<any>[] = [
  {
    field: "IdServicioProducto",
    title: "IdServicioProducto",
    editable: "never",
    hidden: true
  },
  {
    field: "PrecioConfiUnitario",
    title: "Precio Confidencial Unitario",
    editable: "never",
    type: "numeric",
    hidden: true
  },
  { field: "NombreServicio", title: "Nombre", editable: "never" },
  {
    field: "TipoServicio",
    title: "Tipo del Servicio",
    editable: "never"
  },
  { field: "Dia", title: "Dia", editable: "always", type: "numeric" },
  {
    field: "FechaReserva",
    title: "Fecha de Reserva",
    editable: "never",
    type: "date"
  },
  {
    field: "Cantidad",
    title: "Cantidad",
    editable: "always",
    type: "numeric"
  },
  {
    field: "Currency",
    title: "Moneda",
    editable: "never",
    lookup: { Dolar: "Dolares", Sol: "Nuevos Soles" }
  },
  {
    field: "PrecioCotiUnitario",
    title: "Precio Cotizacion Unitario",
    editable: "always",
    type: "numeric"
  },
  {
    field: "PrecioConfiUnitario",
    title: "Precio Confidencial Unitario",
    editable: "never",
    type: "numeric"
  },
  {
    field: "IGV",
    title: "IGV incluido?",
    editable: "always",
    type: "boolean"
  },
  {
    field: "PrecioCotiTotal",
    title: "Precio Cotizacion Total",
    editable: "never",
    type: "numeric"
  },
  {
    field: "PrecioConfiTotal",
    title: "Precio Confidencial Total",
    editable: "never",
    type: "numeric"
  }
];

const columnasServicioProductoMini: Column<any>[] = [
  {
    field: "IdServicioProducto",
    title: "IdServicioProducto",
    editable: "never",
    hidden: true
  },
  { field: "NombreServicio", title: "Nombre", editable: "never" },
  {
    field: "TipoServicio",
    title: "Tipo del Servicio",
    editable: "never"
  },
  { field: "Dia", title: "Dia", editable: "always", type: "numeric" },
  {
    field: "FechaReserva",
    title: "Fecha de Reserva",
    editable: "never",
    type: "date"
  },
  {
    field: "Cantidad",
    title: "Cantidad",
    editable: "always",
    type: "numeric"
  }
];
