import { useForm } from "react-hook-form";
import { useState } from "react";

// Estilos
import globalStyles from "@/globalStyles/modules/global.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import customStyle from "./ModalNuevoPeriodo.module.css";

// Componentes
import { Box, Fade, Modal } from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  AlertViewer,
  alertViewerData
} from "@/components/ComponentesReutilizables/AlertViewer/AlertViewer.component";

// Interfaces
import {
  actividadInterface,
  proveedorInterface,
  criterioInterface
} from "@/utils/interfaces/db";
import axios from "axios";
import LoadingComp from "@/components/Loading/Loading";
import Router from "next/router";
interface props {
  ListaProveedores: proveedorInterface[];
  ListaActividades: actividadInterface[];
  // ListaCriterios: criterioInterface;
}

export default function ModalNuevoPeriodo({
  ListaProveedores,
  ListaActividades
}: props) {
  const [AlertViewerData, setAlertViewerData] = useState<alertViewerData>({
    show: false,
    aletType: "error",
    message: ""
  });
  const [ShowModal, setShowModal] = useState(false);
  const [Loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    reset
  } = useForm({
    defaultValues: {
      PeriodoMatrizEva_name: ""
    }
  });
  const generarNuevoPeriodo = () => {
    setLoading(true);
    let actividadesActivas: any[] = [];
    let arrayEvaluacion: any[] = [];
    let objetoDatos = {};
    let objetoPeriodo = {};
    let { PeriodoMatrizEva_name } = getValues();

    if (PeriodoMatrizEva_name == "") {
      setAlertViewerData({
        aletType: "error",
        message: "No se ingreso un nombre para el nuevo periodo",
        show: true
      });
    }

    ListaActividades.map((y) => {
      if (y.estado == 1) {
        actividadesActivas.push(y);
      }
    });
    ListaProveedores.map((x) => {
      objetoDatos = {
        evaperiodo: actividadesActivas,
        IdProveedor: x.IdProveedor,
        periodo: PeriodoMatrizEva_name
      };
      arrayEvaluacion.push(objetoDatos);
    });
    axios
      .post("/api/proveedores/mep", {
        data: arrayEvaluacion,
        accion: "createmany"
      })
      .then((axiosres) => {
        // setAlertViewerData({
        //   aletType: "success",
        //   message: "Nuevo periodo creado correctamente",
        //   show: true
        // });
        setLoading(true);
        Router.reload();
      });
  };
  return (
    <>
      <button
        className={`${botones.button} ${botones.buttonGuardar} ${botones.button_border}`}
        type="button"
        onClick={() => {
          setShowModal(true);
        }}
      >
        Añadir nuevo periodo
      </button>
      <Modal
        open={ShowModal}
        onClose={() => {
          setShowModal(false);
        }}
        closeAfterTransition
      >
        <Fade in={ShowModal}>
          <Box className={customStyle.modal__MainContainer}>
            <LoadingComp Loading={Loading} />
            <AlertViewer
              alertViewerData={AlertViewerData}
              setData={setAlertViewerData}
              key="AlertViewer1"
            />
            <form action="" onSubmit={handleSubmit(generarNuevoPeriodo)}>
              <div>
                <div>
                  <h2>Generar nuevo periodo</h2>
                  <div className={`${customStyle.botones_container}`}>
                    <button
                      className={`${botones.button} ${botones.buttonGuardar}`}
                      type="submit"
                    >
                      Generar <Add />
                    </button>
                  </div>
                </div>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Nombre de nuevo periodo</label>
                  <input
                    type="text"
                    {...register("PeriodoMatrizEva_name", {
                      required: true
                    })}
                  />
                  <span className={`${globalStyles.global_error_message}`}>
                    {errors.PeriodoMatrizEva_name?.type == "required" &&
                      "El nombre de nuevo periodo es necesario"}
                  </span>
                </div>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
