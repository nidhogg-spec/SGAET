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
      NroPasajeros: 1,
      Nombre: "",
      Codigo: ""
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

  const siguienteFase = () => {
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
  };
  return (
    <>
      <LoadingComp Loading={Loading} />
      {fase == 2 && (
        <>
          <AlertViewer
            alertViewerData={AlertViewerData}
            setData={setAlertViewerData}
          />
          <div className={customStyle.Fase2_titulo}>
            <h2>Paso 2: Seleccione un programa turistico</h2>
            <div className={`${customStyle.botones_container}`}>
              <button
                className={`${botones.button} ${botones.GenerickButton} ${botones.button_border}`}
                onClick={siguienteFase}
              >
                Siguiente paso →
              </button>
            </div>
          </div>
          <div className={customStyle.Formulario_Fase2}>
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
                      const numeroPasajeros = getValues("NroPasajeros");
                      if (!numeroPasajeros || numeroPasajeros <= 0) {
                        setAlertViewerData({
                          aletType: "error",
                          message: "Ingrese un numero de pasajeros valido",
                          show: true
                        });
                        return;
                      }
                      CotizacionTemp.current = generarCotizacion(
                        rowData as programaTuristicoInterface,
                        getValues("NroPasajeros"),
                        ClienteProspecto
                      );
                      reset({
                        NroPasajeros: numeroPasajeros,
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
        </>
      )}
    </>
  );
}
