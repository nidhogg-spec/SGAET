// Paquetes
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { generarCotizacion } from "@/utils/functions/generarCotizacion";

// Interfaces
import {
  clienteProspectoInterface,
  ordenServicioInterface,
  programaTuristicoInterface,
  reservaCotizacionInterface
} from "@/utils/interfaces/db";
interface props {
  fase: number;
  setFase: Function;
  Cotizacion: reservaCotizacionInterface;
  setCotizacion: React.Dispatch<
    React.SetStateAction<reservaCotizacionInterface | undefined>
  >;
  ClienteProspecto: clienteProspectoInterface | undefined;
}

// Componentes
import {
  AlertViewer,
  alertViewerData
} from "../../../ComponentesReutilizables/AlertViewer/AlertViewer.component";
import MaterialTable, { Column } from "material-table";
import LoadingComp from "@/components/Loading/Loading";

// Estilos
import globalStyles from "@/globalStyles/modules/global.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import customStyle from "./Fase_2.module.css";
import { listarServiciosHttp } from "@/utils/interfaces/API/cotizacion/listarServicio.interface";
import TablaServicioCotizacion from "./other/TablaServicioCotizacion/TablaServicioCotizacion";
import moment from "moment";

//---------------------------------------------------------------------------------------

export default function Fase3({
  fase,
  setFase,
  Cotizacion,
  setCotizacion,
  ClienteProspecto
}: props) {
  const [Loading, setLoading] = useState(false);
  const [AlertViewerData, setAlertViewerData] = useState<alertViewerData>({
    show: false,
    aletType: "error",
    message: ""
  });
  const [ListaServicios, setListaServicios] = useState<listarServiciosHttp[]>(
    []
  );

  useEffect(() => {
    axios
      .get<listarServiciosHttp[]>("/api/Cotizacion/ObtenerTodosServicios")
      .then((res) => setListaServicios(res.data));
  }, []);

  const finalizarGuardar = () => {
    // axios
    //   .get(`/api/ProgramaTuristico/CRUD`)
    //   .then((res) => {
    //     setListaProgramasTuristicos(res.data.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    console.log("Finalizando y guardando");
  };

  return (
    <>
      {fase == 3 && (
        <>
          <LoadingComp Loading={Loading} />
          <AlertViewer
            alertViewerData={AlertViewerData}
            setData={setAlertViewerData}
          />
          <div className={customStyle.Fase3_titulo}>
            <h2>Paso 3: Revision de datos de cotizacion</h2>
            <div className={`${customStyle.botones_container}`}>
              <button
                className={`${botones.button} ${botones.GenerickButton} ${botones.button_border}`}
                onClick={finalizarGuardar}
              >
                Finalizar y guardar
              </button>
            </div>
            <div className={customStyle.formContainer}>
              <h3>Programa Turistico seleccionado: {Cotizacion.NombrePrograma}</h3>
              <p>{Cotizacion.Descripcion}</p>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Duracion Dias</label>
                <input
                  type="number"
                  // {...register("Cantidad", { required: true })}
                ></input>
                <span className={`${globalStyles.global_error_message}`}>
                  {/* {errors.Cantidad?.type == "required" &&
                    "La cantidad es obligatoria"} */}
                </span>
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Duracion Noches</label>
                <input
                  type="number"
                  // {...register("Cantidad", { required: true })}
                ></input>
                <span className={`${globalStyles.global_error_message}`}>
                  {/* {errors.Cantidad?.type == "required" &&
                    "La cantidad es obligatoria"} */}
                </span>
              </div>
              <div className={`${globalStyles.global_textArea_container}`}>
                <label>Descripcion del Programa turistico</label>
                <textarea
                  id=""
                  cols={30}
                  rows={10}
                  // {...register("Descripcion", { required: true })}
                ></textarea>
                <span className={`${globalStyles.global_error_message}`}>
                  {/* {errors.Descripcion?.type == "required" &&
                    "El localizacion es obligatorio"} */}
                </span>
              </div>
              <TablaServicioCotizacion
                FechaIn={moment()}
                ListaServicioProductoSeleccionados={[]}
                ListaServicios={[]}
                SetListaServicioProductoSeleccionados={() => {}}
              />
              <div className={`${globalStyles.global_table_container}`}>
                <span>Itinierario</span>
                <MaterialTable
                  title={""}
                  columns={columnasItinerario}
                  data={[]}
                  editable={{
                    onRowAdd: (newData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          // setData([...Data, newData]);
                          // resolve();
                        }, 1000);
                      }),
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          // const dataUpdate = [...Data];
                          // const index = oldData.tableData.id;
                          // dataUpdate[index] = newData;
                          // setData([...dataUpdate]);
                          // resolve();
                        }, 1000);
                      }),
                    onRowDelete: (oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          // const dataDelete = [...Data];
                          // const index = oldData.tableData.id;
                          // dataDelete.splice(index, 1);
                          // setData([...dataDelete]);
                          // resolve();
                        }, 1000);
                      })
                  }}
                />
              </div>
              <div className={`${globalStyles.global_textArea_container}`}>
                <label>Descripcion de Itinerario</label>
                <textarea
                  id=""
                  cols={30}
                  rows={10}
                  // {...register("Descripcion", { required: true })}
                ></textarea>
                <span className={`${globalStyles.global_error_message}`}>
                  {/* {errors.Descripcion?.type == "required" &&
                    "El localizacion es obligatorio"} */}
                </span>
              </div>
              <div className={`${globalStyles.global_table_container}`}>
                <span>Incluye</span>
                <MaterialTable
                  title={""}
                  columns={columnasIncluye}
                  data={[]}
                  editable={{
                    onRowAdd: (newData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          // setData([...Data, newData]);
                          // resolve();
                        }, 1000);
                      }),
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          // const dataUpdate = [...Data];
                          // const index = oldData.tableData.id;
                          // dataUpdate[index] = newData;
                          // setData([...dataUpdate]);
                          // resolve();
                        }, 1000);
                      }),
                    onRowDelete: (oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          // const dataDelete = [...Data];
                          // const index = oldData.tableData.id;
                          // dataDelete.splice(index, 1);
                          // setData([...dataDelete]);
                          // resolve();
                        }, 1000);
                      })
                  }}
                />
              </div>
              <div className={`${globalStyles.global_table_container}`}>
                <span>No incluye</span>
                <MaterialTable
                  title={""}
                  columns={columnasNoIncluye}
                  data={[]}
                  editable={{
                    onRowAdd: (newData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          // setData([...Data, newData]);
                          // resolve();
                        }, 1000);
                      }),
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          // const dataUpdate = [...Data];
                          // const index = oldData.tableData.id;
                          // dataUpdate[index] = newData;
                          // setData([...dataUpdate]);
                          // resolve();
                        }, 1000);
                      }),
                    onRowDelete: (oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          // const dataDelete = [...Data];
                          // const index = oldData.tableData.id;
                          // dataDelete.splice(index, 1);
                          // setData([...dataDelete]);
                          // resolve();
                        }, 1000);
                      })
                  }}
                />
              </div>
              <div className={`${globalStyles.global_table_container}`}>
                <span>Recomendaciones para llevar</span>
                <MaterialTable
                  title={""}
                  columns={columnasRecomendacionesLlevar}
                  data={[]}
                  editable={{
                    onRowAdd: (newData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          // setData([...Data, newData]);
                          // resolve();
                        }, 1000);
                      }),
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          // const dataUpdate = [...Data];
                          // const index = oldData.tableData.id;
                          // dataUpdate[index] = newData;
                          // setData([...dataUpdate]);
                          // resolve();
                        }, 1000);
                      }),
                    onRowDelete: (oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          // const dataDelete = [...Data];
                          // const index = oldData.tableData.id;
                          // dataDelete.splice(index, 1);
                          // setData([...dataDelete]);
                          // resolve();
                        }, 1000);
                      })
                  }}
                />
              </div>
              <div className={`${customStyle.botones_container}`}>
                <button
                  className={`${botones.button} ${botones.buttonGuardar}`}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

const columnasItinerario: Column<any>[] = [
  {
    field: "Dia",
    title: "Dia",
    type: "numeric"
  },
  {
    field: "Hora Inicio",
    title: "HoraInicio",
    type: "time"
  },
  { field: "Hora Fin", title: "HoraFin", type: "time" },
  { field: "Actividad", title: "Actividad" }
];
const columnasIncluye: Column<any>[] = [
  { field: "Actividad", title: "Actividad" }
];
const columnasNoIncluye: Column<any>[] = [
  { field: "Actividad", title: "Actividad" }
];
const columnasRecomendacionesLlevar: Column<any>[] = [
  { field: "Recomendacion", title: "Recomendacion" }
];
