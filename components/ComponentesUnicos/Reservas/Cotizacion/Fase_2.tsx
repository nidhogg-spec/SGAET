// Paquetes
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { generarCotizacion } from "@/utils/functions/generarCotizacion";

// Interfaces
import {
  clienteProspectoInterface,
  programaTuristicoInterface,
  reservaCotizacionInterface
} from "@/utils/interfaces/db";
interface props {
  fase: number;
  setFase: Function;
  Cotizacion: reservaCotizacionInterface | undefined;
  setCotizacion: React.Dispatch<
    React.SetStateAction<reservaCotizacionInterface | undefined>
  >;
  ClienteProspecto: clienteProspectoInterface | undefined;
}

// Estilos
import globalStyles from "@/globalStyles/modules/global.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import customStyle from "./Fase_2.module.css";

// Componentes
import {
  AlertViewer,
  alertViewerData
} from "../../../ComponentesReutilizables/AlertViewer/AlertViewer.component";
import MaterialTable from "material-table";
import LoadingComp from "@/components/Loading/Loading";
import moment from "moment";

export default function Fase2({
  fase,
  setFase,
  Cotizacion,
  setCotizacion,
  ClienteProspecto
}: props) {
  const CotizacionTemp = useRef<reservaCotizacionInterface | undefined>(
    undefined
  );
  const ProgramaTuristicoSelect = useRef<
    programaTuristicoInterface | undefined
  >(undefined);
  const [Loading, setLoading] = useState(false);
  const [AlertViewerData, setAlertViewerData] = useState<alertViewerData>({
    show: false,
    aletType: "error",
    message: ""
  });
  const [ListaProgramasTuristicos, setListaProgramasTuristicos] = useState<
    programaTuristicoInterface[]
  >([]);
  const [ProgramaTuristicoSelected, setProgramaTuristicoSelected] =
    useState<programaTuristicoInterface>();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    reset
  } = useForm({
    defaultValues: {
      // NombreGrupo: "",
      // CodGrupo: "",
      NroPasajeros: 1,
      Nombre: "",
      Codigo: "",
      FechaIN: moment().format("YYYY-MM-DD")
    },
    mode: "onBlur"
  });

  useEffect(() => {
    axios
      .get(`/api/ProgramaTuristico/CRUD`)
      .then((res) => {
        setListaProgramasTuristicos(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <LoadingComp Loading={Loading} />
      {fase == 2 && (
        <>
          <AlertViewer
            alertViewerData={AlertViewerData}
            setData={setAlertViewerData}
          />
          <form
            action=""
            onSubmit={handleSubmit((data) => {
              const NombreGrupo = "";
              const CodGrupo = "";
              const numeroPasajeros = data.NroPasajeros;
              const FechaIN = data.FechaIN;
              if (!numeroPasajeros || numeroPasajeros <= 0) {
                setAlertViewerData({
                  aletType: "error",
                  message: "Ingrese un numero de pasajeros valido",
                  show: true
                });
                return;
              }
              if (!moment(FechaIN).isValid()) {
                setAlertViewerData({
                  aletType: "error",
                  message: "Fecha de inicio no valido",
                  show: true
                });
                return;
              }
              if (!ProgramaTuristicoSelect.current) {
                setAlertViewerData({
                  aletType: "error",
                  message: "No se selecciono un Programa Turistico",
                  show: true
                });
                return;
              }
              if (!ClienteProspecto) {
                setAlertViewerData({
                  aletType: "error",
                  message: "Error - reinicie el proceso, por favor",
                  show: true
                });
                return;
              }

              CotizacionTemp.current = generarCotizacion(
                NombreGrupo,
                CodGrupo,
                ProgramaTuristicoSelect.current,
                numeroPasajeros,
                ClienteProspecto,
                FechaIN
              );
              if (CotizacionTemp.current) {
                setCotizacion(CotizacionTemp.current);
                setFase(3);
              } else {
                setAlertViewerData({
                  show: true,
                  aletType: "error",
                  message: "Seleccione un Programa Turistico"
                });
              }
            })}
          >
            <div className={customStyle.Fase2_titulo}>
              <h2>Paso 2: Seleccione un programa turistico</h2>
              <div className={`${customStyle.botones_container}`}>
                <button
                  className={`${botones.button} ${botones.GenerickButton} ${botones.button_border}`}
                  type="submit"
                >
                  Siguiente paso →
                </button>
              </div>
            </div>
            <div className={customStyle.Formulario_Fase2}>
              {/* <div className={`${globalStyles.global_textInput_container}`}>
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
              </div> */}
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Numero de pasajeros</label>
                <input
                  type="number"
                  min={1}
                  {...register("NroPasajeros", { required: true })}
                />
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Nombre del programa</label>
                <input
                  type="text"
                  {...register("Nombre", { required: true })}
                  disabled
                />
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Codigo del programa</label>
                <input
                  type="text"
                  {...register("Codigo", { required: true })}
                  disabled
                />
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Fecha de Inicio</label>
                <input
                  type="date"
                  {...register("FechaIN", { required: true })}
                />
              </div>
              <MaterialTable
                title="Seleccione un programa turistico"
                columns={[
                  {
                    title: "Nombre de programa turistico",
                    field: "NombrePrograma"
                  },
                  {
                    title: "Codigo",
                    field: "CodigoPrograma"
                  },
                  {
                    title: "Tipo",
                    field: "Tipo"
                  },
                  { title: "Localizacion", field: "Localizacion" }
                ]}
                data={ListaProgramasTuristicos}
                actions={[
                  {
                    icon: "check",
                    tooltip: "Seleccione Cliente",
                    onClick: (event, rowData) => {
                      if (ClienteProspecto) {
                        ProgramaTuristicoSelect.current =
                          rowData as programaTuristicoInterface;
                        const numeroPasajeros = getValues("NroPasajeros");
                        reset({
                          NroPasajeros: numeroPasajeros ? numeroPasajeros : 1,
                          Codigo: (rowData as programaTuristicoInterface)
                            .CodigoPrograma,
                          Nombre: (rowData as programaTuristicoInterface)
                            .NombrePrograma
                        });
                      } else {
                        alert("Error - se debio seleccionar un cliente");
                      }

                      // setProgramaTuristicoSeleccionado(rowData);
                    }
                  }
                ]}
              />
            </div>
          </form>
        </>
      )}
    </>
  );
}
