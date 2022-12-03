import React, { useState, useEffect, useContext } from "react";
import { Table, Dialog, DialogContent } from "@mui/material";
import MaterialTable from "material-table";
import axios from "axios";
import { useForm } from "react-hook-form";

// Estilos
import globalStyles from "@/globalStyles/modules/global.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import customStyle from "./ModalProgramTuris_Nuevo.module.css";
import {
  reservaCotizacionInterface,
  servicioEscogidoInterface
} from "@/utils/interfaces/db";
import LoadingComp from "@/components/Loading/Loading";

import { programaTuristicoInterface } from "@/utils/interfaces/db";
import { useRouter } from "next/router";
import TablaProgramaServicio_v2 from "@/components/Formulario/CustomComponenteFormu/TablaProgramaServicio_v2/TablaProgramaServicio_v2";
import TablaProgramaServicio_v3 from "../TablaProgramaServicio_v3/TablaProgramaServicio_v3";
interface props {
  open: boolean;
  setOpen: Function;
  ListaServiciosProductos: never[];
  dataToReset: programaTuristicoInterface | null;
}
interface Itinerario_Interface {
  Dia: number;
  "Hora Inicio": string;
  "Hora Fin": string;
  Actividad: string;
  tableData?: {
    id: number;
  };
}
interface Incluye_Interface {
  Actividad: string;
  tableData?: {
    id: number;
  };
}
interface NoIncluye_Interface {
  Actividad: string;
  tableData?: {
    id: number;
  };
}
interface RecomendacionesLlevar_Interface {
  Recomendacion: string;
  tableData?: {
    id: number;
  };
}
interface ServicioProducto_Interface {
  IdServicioProducto: string;
  TipoServicio: string;
  PrecioConfiUnitario: number;
  NombreServicio: string;
  Dia: number;
  Cantidad: number;
  PrecioCotiUnitario: number;
  IGV: boolean;
  PrecioCotiTotal: number;
  PrecioConfiTotal: number;
  Currency: "Dolar" | "Soles" | string;
  PrecioPublicado: number;
  tableData?: {
    id: number;
  };
}

export default function ModalProgramTuris_Nuevo({
  open,
  setOpen,
  ListaServiciosProductos,
  dataToReset
}: props) {
  const router = useRouter();
  const [openSiguientePaso, setOpenSiguientePaso] = useState(false);
  const [Link_ultimoIngresado, setLink_ultimoIngresado] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    reset
  } = useForm({
    defaultValues: {
      NombrePrograma: "",
      CodigoPrograma: "",
      Tipo: "",
      DuracionDias: 1,
      DuracionNoche: 0,
      Localizacion: "",
      Descripcion: "",
      Itinerario: [],
      ItinerarioDescripcion: "",
      Incluye: [],
      NoIncluye: [],
      RecomendacionesLlevar: [],
      ServicioProducto: [],
      IdProgramaTuristico: ""
    },
    mode: "onBlur"
  });
  const [Loading, setLoading] = useState(false);
  const [itinerario, setItinerario] = useState<Itinerario_Interface[]>([]);
  const [Incluye, setIncluye] = useState<Incluye_Interface[]>([]);
  const [NoIncluye, setNoIncluye] = useState<NoIncluye_Interface[]>([]);
  const [RecomendacionesLlevar, setRecomendacionesLlevar] = useState<
    RecomendacionesLlevar_Interface[]
  >([]);
  const [ServicioProducto, setServicioProducto] = useState<
    ServicioProducto_Interface[]
  >([]);
  const [Controlador_DevolverDatos, setControlador_DevolverDatos] =
    useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const onSubmit = (data: any) => {
    // setControlador_DevolverDatos(true);
    // await setTimeout(() => {} , 1000);

    const temp_itinerario = [...itinerario];
    const temp_Incluye = [...Incluye];
    const temp_NoIncluye = [...NoIncluye];
    const temp_RecomendacionesLlevar = [...RecomendacionesLlevar];
    const temp_ServicioProducto = [...ServicioProducto];
    setItinerario([]);
    setIncluye([]);
    setNoIncluye([]);
    setRecomendacionesLlevar([]);
    setServicioProducto([]);
    let nuevo_prograTuristico = formatear_programaTuristico_database(
      data,
      temp_itinerario,
      temp_Incluye,
      temp_NoIncluye,
      temp_RecomendacionesLlevar,
      temp_ServicioProducto
    );
    //@ts-ignore
    delete nuevo_prograTuristico.IdProgramaTuristico;
    console.log(nuevo_prograTuristico);
    axios
      .post(`/api/ProgramaTuristico/CRUD`, {
        ProgramaTuristico: nuevo_prograTuristico
      })
      .then((result) => {
        if (
          result.data?.data["IdProgramaTuristico"] == undefined ||
          result.data?.data["IdProgramaTuristico"] == ""
        ) {
          throw new Error("No se genero Id de prgrama turistico correctamente");
        }
        setLink_ultimoIngresado(
          `/ProgramaTuristico/${result.data?.data["IdProgramaTuristico"]}`
        );
        setOpenSiguientePaso(true);
      });
  };

  useEffect(() => {
    reset({
      NombrePrograma: dataToReset?.NombrePrograma,
      CodigoPrograma: dataToReset?.CodigoPrograma,
      Tipo: dataToReset?.Tipo,
      DuracionDias: parseInt((dataToReset?.DuracionDias ?? "0").toString()),
      DuracionNoche: parseInt((dataToReset?.DuracionNoche ?? "0").toString()),
      Localizacion: dataToReset?.Localizacion,
      Descripcion: dataToReset?.Descripcion,
      Itinerario: dataToReset?.Itinerario as any[],
      Incluye: dataToReset?.Incluye as any[],
      NoIncluye: dataToReset?.NoIncluye as any[],
      RecomendacionesLlevar: dataToReset?.RecomendacionesLlevar as any[],
      ServicioProducto: dataToReset?.ServicioProducto as any[],
      IdProgramaTuristico: dataToReset?.IdProgramaTuristico
    });
    setItinerario(dataToReset?.Itinerario ?? []);
    setIncluye(dataToReset?.Incluye ?? []);
    setNoIncluye(dataToReset?.NoIncluye ?? []);
    setRecomendacionesLlevar(dataToReset?.RecomendacionesLlevar ?? []);
    setServicioProducto(dataToReset?.ServicioProducto ?? []);
  }, [dataToReset]);

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
            <h4>
              Programa Turistico nuevo registrado. ¿Cual es su siguiente paso?
            </h4>
            <button
              onClick={() => {
                if (Link_ultimoIngresado !== "") {
                  router.push(Link_ultimoIngresado);
                } else {
                  router.reload();
                }
              }}
              className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}
            >
              Ver nuevo Programa Turistico
            </button>
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
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogContent>
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className={globalStyles.title_and_buttons_container}>
              <h1 className={customStyle.title}>Nuevo Programa Turistico</h1>
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
              <h2>Datos del programa turistico</h2>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Nombre del programa turistico</label>
                <input
                  type="text"
                  {...register("NombrePrograma", { required: true })}
                />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors.NombrePrograma?.type == "required" &&
                    "El Nombre del programa turistico es obligatorio"}
                </span>
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Codigo extra del programa turistico</label>
                <input
                  type="text"
                  {...register("CodigoPrograma", { required: true })}
                />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors.CodigoPrograma?.type == "required" &&
                    "El codigo del programa turistico es obligatorio"}
                </span>
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Tipo de experiencia</label>
                <input type="text" {...register("Tipo", { required: true })} />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors.Tipo?.type == "required" &&
                    "El tipo de experiencia es obligatorio"}
                </span>
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Duracion Dias</label>
                <input type="number" {...register("DuracionDias")} min={1} />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors.DuracionDias?.type == "required" &&
                    "El duracion dias es obligatorio"}
                </span>
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Duracion Noches</label>
                <input
                  type="number"
                  {...register("DuracionNoche", {
                    validate: (value: number) => {
                      const DuracionDias = parseInt(
                        getValues("DuracionDias").toString()
                      );
                      const val_int = parseInt(value.toString());
                      console.log(`${typeof value}  ${typeof DuracionDias}`);
                      return (
                        DuracionDias == val_int - 1 ||
                        DuracionDias == val_int ||
                        DuracionDias == val_int + 1
                      );
                    }
                  })}
                  min={0}
                />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors.DuracionNoche?.type == "required" &&
                    "El duracion noches es obligatorio"}
                  {errors.DuracionNoche?.type == "validate" &&
                    "El numero de noches solo puede ser mas o menos uno el numero de dias"}
                </span>
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Localizacion</label>
                <input
                  type="text"
                  {...register("Localizacion", { required: true })}
                />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors.Localizacion?.type == "required" &&
                    "El localizacion es obligatorio"}
                </span>
              </div>
              <div className={`${globalStyles.global_textArea_container}`}>
                <label>Descripcion</label>
                <textarea
                  id=""
                  cols={30}
                  rows={10}
                  {...register("Descripcion", { required: true })}
                ></textarea>
                <span className={`${globalStyles.global_error_message}`}>
                  {errors.Descripcion?.type == "required" &&
                    "El localizacion es obligatorio"}
                </span>
              </div>
              <h2>Itinerario</h2>
              <MaterialTable
                title=""
                columns={[
                  {
                    field: "Dia",
                    title: "Dia",
                    initialEditValue: 1,
                    type: "numeric"
                  },
                  {
                    field: "Hora Inicio",
                    title: "Hora de Inicio",
                    initialEditValue: "00:00"
                  },
                  {
                    field: "Hora Fin",
                    title: "Hora de Fin",
                    initialEditValue: "00:00"
                  },
                  { field: "Actividad", title: "Actividad" }
                ]}
                data={itinerario}
                editable={{
                  onRowAdd: (newData) =>
                    new Promise<void>((resolve, reject) => {
                      setTimeout(() => {
                        if (!newData.Actividad || newData.Actividad == "") {
                          alert("El itinerario necesita una actividad");
                          reject();
                          return;
                        }
                        //@ts-ignore
                        setItinerario([...itinerario, newData]);
                        resolve();
                      }, 1000);
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise<void>((resolve, reject) => {
                      setTimeout(() => {
                        const dataUpdate: any = [...itinerario];
                        const index = newData.tableData?.id;
                        dataUpdate[index as number] = newData;
                        //@ts-ignore
                        setItinerario([...dataUpdate]);

                        resolve();
                      }, 1000);
                    }),
                  onRowDelete: (oldData: any) =>
                    new Promise<void>((resolve, reject) => {
                      setTimeout(() => {
                        const dataDelete = [...itinerario];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        setItinerario([...dataDelete]);

                        resolve();
                      }, 1000);
                    })
                }}
              />
              <div className={`${globalStyles.global_textArea_container}`}>
                <label>Descripcion de Itinerario</label>
                <textarea
                  id=""
                  cols={30}
                  rows={10}
                  {...register("ItinerarioDescripcion")}
                ></textarea>
                <span className={`${globalStyles.global_error_message}`}></span>
              </div>
              <h2>Incluye</h2>
              <MaterialTable
                title=""
                columns={[{ field: "Actividad", title: "Actividad" }]}
                data={Incluye}
                editable={{
                  onRowAdd: (newData) =>
                    new Promise<void>((resolve, reject) => {
                      setTimeout(() => {
                        //@ts-ignore
                        setIncluye([...Incluye, newData]);
                        resolve();
                      }, 1000);
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise<void>((resolve, reject) => {
                      setTimeout(() => {
                        const dataUpdate: any = [...Incluye];
                        const index = newData.tableData?.id;
                        dataUpdate[index as number] = newData;
                        //@ts-ignore
                        setIncluye([...dataUpdate]);

                        resolve();
                      }, 1000);
                    }),
                  onRowDelete: (oldData: any) =>
                    new Promise<void>((resolve, reject) => {
                      setTimeout(() => {
                        const dataDelete = [...Incluye];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        setIncluye([...dataDelete]);

                        resolve();
                      }, 1000);
                    })
                }}
              />
              <h2>No Incluye</h2>
              <MaterialTable
                title=""
                columns={[{ field: "Actividad", title: "Actividad" }]}
                data={NoIncluye}
                editable={{
                  onRowAdd: (newData) =>
                    new Promise<void>((resolve, reject) => {
                      setTimeout(() => {
                        //@ts-ignore
                        setNoIncluye([...NoIncluye, newData]);
                        resolve();
                      }, 1000);
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise<void>((resolve, reject) => {
                      setTimeout(() => {
                        const dataUpdate: any = [...NoIncluye];
                        const index = newData.tableData?.id;
                        dataUpdate[index as number] = newData;
                        //@ts-ignore
                        setNoIncluye([...dataUpdate]);

                        resolve();
                      }, 1000);
                    }),
                  onRowDelete: (oldData: any) =>
                    new Promise<void>((resolve, reject) => {
                      setTimeout(() => {
                        const dataDelete = [...NoIncluye];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        setNoIncluye([...dataDelete]);

                        resolve();
                      }, 1000);
                    })
                }}
              />
              <h2>Recomendaciones para llevar</h2>
              <MaterialTable
                title=""
                columns={[{ field: "Recomendacion", title: "Recomendacion" }]}
                data={RecomendacionesLlevar}
                editable={{
                  onRowAdd: (newData) =>
                    new Promise<void>((resolve, reject) => {
                      setTimeout(() => {
                        //@ts-ignore
                        setRecomendacionesLlevar([
                          ...RecomendacionesLlevar,
                          newData
                        ]);
                        resolve();
                      }, 1000);
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise<void>((resolve, reject) => {
                      setTimeout(() => {
                        const dataUpdate: any = [...RecomendacionesLlevar];
                        const index = newData.tableData?.id;
                        dataUpdate[index as number] = newData;
                        //@ts-ignore
                        setRecomendacionesLlevar([...dataUpdate]);

                        resolve();
                      }, 1000);
                    }),
                  onRowDelete: (oldData: any) =>
                    new Promise<void>((resolve, reject) => {
                      setTimeout(() => {
                        const dataDelete = [...RecomendacionesLlevar];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        setRecomendacionesLlevar([...dataDelete]);

                        resolve();
                      }, 1000);
                    })
                }}
              />
              <h2>Servicios/Productos base del Programa Turistico</h2>
              <TablaProgramaServicio_v3
                Title={""}
                ModoEdicion={true}
                CotiServicio={ServicioProducto}
                setCotiServicio={setServicioProducto}
                // KeyDato={"ServicioProducto"}
                ListaServiciosProductos={ListaServiciosProductos}
                Reiniciar={false}
              />
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
        </DialogContent>
      </Dialog>
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
