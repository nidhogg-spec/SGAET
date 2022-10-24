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
  reservaCotizacionInterface,
  TipoAccion
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
import { Currency, Idiomas } from "@/utils/dominio";
import {
  formInterface,
  generarCotizacionParte4
} from "@/utils/functions/generarCotizacionParte4";
import { generarLog } from "@/utils/functions/generarLog";

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
  } = useForm<formInterface>({
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
      IdReservaCotizacion: "",
      Idioma: Idiomas.Español as string,
      Moneda: Currency.Soles as string
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

  const finalizarGuardar = async (data: formInterface) => {
    try {
      setLoading(true);
      const [reservaCotizacion, err] = await generarCotizacionParte4(
        data,
        Cotizacion
      );
      const res = await axios.post(`/api/v2/reservaCotizacion`, {
        reservaCotizacion: reservaCotizacion
      });
      generarLog(TipoAccion.CREATE, "nueva cotizacion creada");
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
        IdReservaCotizacion: Cotizacion["IdReservaCotizacion"],
        Idioma: Cotizacion["Idioma"] ?? Idiomas.Español,
        Moneda: Cotizacion["Moneda"] ?? Currency.Dolares
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
          <form action="" onSubmit={handleSubmit(finalizarGuardar)}>
            <div className={customStyle.Fase4_titulo}>
              <h2>Paso 4: Revision de datos de cotizacion</h2>
              <div className={`${customStyle.botones_container}`}>
                <button
                  className={`${botones.button} ${botones.GenerickButton} ${botones.button_border}`}
                  type="submit"
                  // onClick={finalizarGuardar}
                >
                  Finalizar y guardar
                </button>
              </div>
              <div className={customStyle.formContainer}>
                <h3>
                  Programa Turistico seleccionado: {Cotizacion.NombrePrograma}
                </h3>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Nombre de grupo de nueva reserva</label>
                  <input
                    type="text"
                    {...register("NombreGrupo", {
                      required: true
                    })}
                  />
                  <span className={`${globalStyles.global_error_message}`}>
                    {errors.NombreGrupo?.type == "required" &&
                      "El nombre de grupo es necesario"}
                  </span>
                </div>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Codigo custom de Grupo</label>
                  <input
                    type="text"
                    {...register("CodGrupo", {
                      required: true
                    })}
                  />
                  <span className={`${globalStyles.global_error_message}`}>
                    {errors.CodGrupo?.type == "required" &&
                      "El codigo de grupo es necesario"}
                  </span>
                </div>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Idioma</label>
                  <select {...register("Idioma")}>
                    {Object.values(Idiomas).map((idioma) => {
                      return (
                        <option key={idioma} value={idioma}>
                          {idioma}
                        </option>
                      );
                    })}
                  </select>
                  <span className={`${globalStyles.global_error_message}`}>
                    {errors.Idioma?.type == "required" &&
                      "El idioma es necesario"}
                  </span>
                </div>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Tipo de moneda</label>
                  <select {...register("Moneda")}>
                    {Object.values(Currency).map((current) => {
                      return (
                        <option key={current} value={current}>
                          {current}
                        </option>
                      );
                    })}
                  </select>
                  <span className={`${globalStyles.global_error_message}`}>
                    {errors.Moneda?.type == "required" &&
                      "La moneda es necesario"}
                  </span>
                </div>
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
                  <span
                    className={`${globalStyles.global_error_message}`}
                  ></span>
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
                  />
                </div>
                <div className={`${globalStyles.global_table_container}`}>
                  <span>No incluye</span>
                  <MaterialTable
                    title={""}
                    columns={columnasNoIncluye}
                    data={Cotizacion.NoIncluye}
                  />
                </div>
                <div className={`${globalStyles.global_table_container}`}>
                  <span>Recomendaciones para llevar</span>
                  <MaterialTable
                    title={""}
                    columns={columnasRecomendacionesLlevar}
                    data={Cotizacion.RecomendacionesLlevar}
                  />
                </div>
              </div>
            </div>
          </form>
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
