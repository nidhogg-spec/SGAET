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
import customStyle from "./Fase_4.module.css";
import { listarServiciosHttp } from "@/utils/interfaces/API/cotizacion/listarServicio.interface";
import TablaServicioCotizacion from "./other/TablaServicioCotizacion/TablaServicioCotizacion";
import moment from "moment";
import Router from "next/router";
import { createReservaCotizacionBodyParam } from "@/utils/interfaces/API/reservaCotizacion.interface";

//---------------------------------------------------------------------------------------

export default function Fase4({
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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    reset
  } = useForm({
    defaultValues: {
      NombreGrupo: "",
      CodGrupo: "",
      NpasajerosAdult: 0,
      NpasajerosChild: 0,
      NombrePrograma: "",
      CodigoPrograma: "",
      Tipo: "",
      DuracionDias: 0,
      DuracionNoche: 0,
      Localizacion: "",
      Descripcion: "",
      IdProgramaTuristico: "",
      FechaIN: "",
      NumPaxTotal: 0,
      IdClienteProspecto: "",
      IdReservaCotizacion: ""
    }
  });

  // const [ListaServicios, setListaServicios] = useState<listarServiciosHttp[]>(
  //   []
  // );

  // useEffect(() => {
  //   axios
  //     .get<listarServiciosHttp[]>("/api/Cotizacion/ObtenerTodosServicios")
  //     .then((res) => setListaServicios(res.data));
  // }, []);

  const finalizarGuardar = async () => {
    try {
      setLoading(true);
      let tempCotizacion: createReservaCotizacionBodyParam = {
        ServicioProducto: Cotizacion.ServicioProducto.map((servi) => {
          return {
            FechaLimitePago: servi.FechaLimitePago ?? "",
            IdServicioProducto: servi.IdServicioProducto,
            TipoServicio: servi.TipoServicio,
            NombreServicio: servi.NombreServicio,
            Dia: parseInt(servi.Dia.toString()),
            Cantidad: parseInt(servi.Cantidad.toString()),
            IGV: servi.IGV,
            PrecioCotiUnitario: parseInt(servi.PrecioCotiUnitario.toString()),
            PrecioCotiTotal: parseInt(servi.PrecioCotiTotal.toString()),
            PrecioConfiUnitario: parseInt(servi.PrecioConfiUnitario.toString()),
            PrecioConfiTotal: parseInt(servi.PrecioConfiTotal.toString()),
            Currency: servi.Currency,
            PrecioPublicado: parseInt(servi.PrecioPublicado.toString()),
            FechaReserva: servi.FechaReserva,
            IdServicioEscogido: servi.IdServicioEscogido,
            Estado: parseInt(servi.Estado.toString()),
            IdProveedor: servi.IdProveedor
          };
        }),
        NombreGrupo: Cotizacion.NombreGrupo,
        CodGrupo: Cotizacion.CodGrupo,
        NpasajerosAdult: parseInt(Cotizacion.NpasajerosAdult.toString()),
        NpasajerosChild: parseInt(Cotizacion.NpasajerosChild.toString()),
        NombrePrograma: Cotizacion.NombrePrograma,
        CodigoPrograma: Cotizacion.CodigoPrograma,
        Tipo: Cotizacion.Tipo.toString(),
        DuracionDias: parseInt(Cotizacion.DuracionDias.toString()),
        DuracionNoche: parseInt(Cotizacion.DuracionNoche.toString()),
        Localizacion: Cotizacion.Localizacion,
        Descripcion: Cotizacion.Descripcion,
        IdProgramaTuristico: Cotizacion.IdProgramaTuristico,
        FechaIN: Cotizacion.FechaIN,
        NumPaxTotal: parseInt(Cotizacion.NumPaxTotal.toString()),
        IdClienteProspecto: Cotizacion.IdClienteProspecto,
        Itinerario: [...Cotizacion.Itinerario],
        Incluye: [...Cotizacion.Incluye],
        NoIncluye: [...Cotizacion.NoIncluye],
        RecomendacionesLlevar: [...Cotizacion.RecomendacionesLlevar]
      };
      const res = await axios.post(`/api/v2/reservaCotizacion`, {
        reservaCotizacion: tempCotizacion
      });
      if (res.status != 200) {
        setLoading(false);
        setAlertViewerData({
          aletType: "error",
          message: JSON.stringify(res.data),
          show: true
        });
        return;
      }
      Router.push("/");
    } catch (error) {
      setLoading(false);
      setAlertViewerData({
        aletType: "error",
        message: JSON.stringify(error),
        show: true
      });
    }
  };

  useEffect(() => {
    if (Cotizacion) {
      reset({
        NombreGrupo: Cotizacion["NombreGrupo"],
        CodGrupo: Cotizacion["CodGrupo"],
        NpasajerosAdult: Cotizacion["NpasajerosAdult"],
        NpasajerosChild: Cotizacion["NpasajerosChild"],
        NombrePrograma: Cotizacion["NombrePrograma"],
        CodigoPrograma: Cotizacion["CodigoPrograma"],
        Tipo: Cotizacion["Tipo"],
        DuracionDias: Cotizacion["DuracionDias"],
        DuracionNoche: Cotizacion["DuracionNoche"],
        Localizacion: Cotizacion["Localizacion"],
        Descripcion: Cotizacion["Descripcion"],
        IdProgramaTuristico: Cotizacion["IdProgramaTuristico"],
        FechaIN: Cotizacion["FechaIN"],
        NumPaxTotal: Cotizacion["NumPaxTotal"],
        IdClienteProspecto: Cotizacion["IdClienteProspecto"],
        IdReservaCotizacion: Cotizacion["IdReservaCotizacion"]
      });
    }
  }, [Cotizacion]);

  return (
    <>
      {fase == 4 && (
        <>
          <LoadingComp Loading={Loading} />
          <AlertViewer
            alertViewerData={AlertViewerData}
            setData={setAlertViewerData}
          />
          <div className={customStyle.Fase4_titulo}>
            <h2>Paso 4: Revision de datos de cotizacion</h2>
            <div className={`${customStyle.botones_container}`}>
              <button
                className={`${botones.button} ${botones.GenerickButton} ${botones.button_border}`}
                onClick={finalizarGuardar}
              >
                Finalizar y guardar
              </button>
            </div>
            <div className={customStyle.formContainer}>
              <h3>
                Programa Turistico seleccionado: {Cotizacion.NombrePrograma}
              </h3>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Duracion Dias</label>
                <input
                  type="number"
                  {...register("DuracionDias", { required: true })}
                  disabled
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
                  {...register("DuracionNoche", { required: true })}
                  disabled
                ></input>
                <span className={`${globalStyles.global_error_message}`}></span>
              </div>
              <div className={`${globalStyles.global_textArea_container}`}>
                <label>Descripcion del Programa turistico</label>
                <textarea
                  id=""
                  cols={30}
                  rows={10}
                  {...register("Descripcion", { required: true })}
                ></textarea>
                <span className={`${globalStyles.global_error_message}`}>
                  {/* {errors.Descripcion?.type == "required" &&
                    "El localizacion es obligatorio"} */}
                </span>
              </div>
              <div className={`${globalStyles.global_table_container}`}>
                <span>Servicios</span>
                <MaterialTable
                  title={""}
                  columns={columnasServicioProducto}
                  data={Cotizacion.ServicioProducto}
                />
              </div>
              {/* <TablaServicioCotizacion
                FechaIn={moment()}
                ListaServicioProductoSeleccionados={[]}
                ListaServicios={[]}
                SetListaServicioProductoSeleccionados={() => {}}
              /> */}

              <div className={`${globalStyles.global_table_container}`}>
                <span>Itinierario</span>
                <MaterialTable
                  title={""}
                  columns={columnasItinerario}
                  data={Cotizacion.Itinerario}

                  // editable={{
                  //   onRowAdd: (newData) =>
                  //     new Promise((resolve, reject) => {
                  //       setTimeout(() => {
                  //         // setData([...Data, newData]);
                  //         // resolve();
                  //       }, 1000);
                  //     }),
                  //   onRowUpdate: (newData, oldData) =>
                  //     new Promise((resolve, reject) => {
                  //       setTimeout(() => {
                  //         // const dataUpdate = [...Data];
                  //         // const index = oldData.tableData.id;
                  //         // dataUpdate[index] = newData;
                  //         // setData([...dataUpdate]);
                  //         // resolve();
                  //       }, 1000);
                  //     }),
                  //   onRowDelete: (oldData) =>
                  //     new Promise((resolve, reject) => {
                  //       setTimeout(() => {
                  //         // const dataDelete = [...Data];
                  //         // const index = oldData.tableData.id;
                  //         // dataDelete.splice(index, 1);
                  //         // setData([...dataDelete]);
                  //         // resolve();
                  //       }, 1000);
                  //     })
                  // }}
                />
              </div>
              {/* <div className={`${globalStyles.global_textArea_container}`}>
                <label>Descripcion de Itinerario</label>
                <textarea
                  id=""
                  cols={30}
                  rows={10}
                  {...register("Descripcion", { required: true })}
                ></textarea>
                <span className={`${globalStyles.global_error_message}`}>
                </span>
              </div> */}
              <div className={`${globalStyles.global_table_container}`}>
                <span>Incluye</span>
                <MaterialTable
                  title={""}
                  columns={columnasIncluye}
                  data={Cotizacion.Incluye}
                  // editable={{
                  //   onRowAdd: (newData) =>
                  //     new Promise((resolve, reject) => {
                  //       setTimeout(() => {
                  //         // setData([...Data, newData]);
                  //         // resolve();
                  //       }, 1000);
                  //     }),
                  //   onRowUpdate: (newData, oldData) =>
                  //     new Promise((resolve, reject) => {
                  //       setTimeout(() => {
                  //         // const dataUpdate = [...Data];
                  //         // const index = oldData.tableData.id;
                  //         // dataUpdate[index] = newData;
                  //         // setData([...dataUpdate]);
                  //         // resolve();
                  //       }, 1000);
                  //     }),
                  //   onRowDelete: (oldData) =>
                  //     new Promise((resolve, reject) => {
                  //       setTimeout(() => {
                  //         // const dataDelete = [...Data];
                  //         // const index = oldData.tableData.id;
                  //         // dataDelete.splice(index, 1);
                  //         // setData([...dataDelete]);
                  //         // resolve();
                  //       }, 1000);
                  //     })
                  // }}
                />
              </div>
              <div className={`${globalStyles.global_table_container}`}>
                <span>No incluye</span>
                <MaterialTable
                  title={""}
                  columns={columnasNoIncluye}
                  data={Cotizacion.NoIncluye}
                  // editable={{
                  //   onRowAdd: (newData) =>
                  //     new Promise((resolve, reject) => {
                  //       setTimeout(() => {
                  //         // setData([...Data, newData]);
                  //         // resolve();
                  //       }, 1000);
                  //     }),
                  //   onRowUpdate: (newData, oldData) =>
                  //     new Promise((resolve, reject) => {
                  //       setTimeout(() => {
                  //         // const dataUpdate = [...Data];
                  //         // const index = oldData.tableData.id;
                  //         // dataUpdate[index] = newData;
                  //         // setData([...dataUpdate]);
                  //         // resolve();
                  //       }, 1000);
                  //     }),
                  //   onRowDelete: (oldData) =>
                  //     new Promise((resolve, reject) => {
                  //       setTimeout(() => {
                  //         // const dataDelete = [...Data];
                  //         // const index = oldData.tableData.id;
                  //         // dataDelete.splice(index, 1);
                  //         // setData([...dataDelete]);
                  //         // resolve();
                  //       }, 1000);
                  //     })
                  // }}
                />
              </div>
              <div className={`${globalStyles.global_table_container}`}>
                <span>Recomendaciones para llevar</span>
                <MaterialTable
                  title={""}
                  columns={columnasRecomendacionesLlevar}
                  data={[]}
                  // editable={{
                  //   onRowAdd: (newData) =>
                  //     new Promise((resolve, reject) => {
                  //       setTimeout(() => {
                  //         // setData([...Data, newData]);
                  //         // resolve();
                  //       }, 1000);
                  //     }),
                  //   onRowUpdate: (newData, oldData) =>
                  //     new Promise((resolve, reject) => {
                  //       setTimeout(() => {
                  //         // const dataUpdate = [...Data];
                  //         // const index = oldData.tableData.id;
                  //         // dataUpdate[index] = newData;
                  //         // setData([...dataUpdate]);
                  //         // resolve();
                  //       }, 1000);
                  //     }),
                  //   onRowDelete: (oldData) =>
                  //     new Promise((resolve, reject) => {
                  //       setTimeout(() => {
                  //         // const dataDelete = [...Data];
                  //         // const index = oldData.tableData.id;
                  //         // dataDelete.splice(index, 1);
                  //         // setData([...dataDelete]);
                  //         // resolve();
                  //       }, 1000);
                  //     })
                  // }}
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

const columnasServicioProducto: Column<any>[] = [
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
