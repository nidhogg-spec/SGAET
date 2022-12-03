import React, { useState, useEffect, useContext } from "react";
import { Table, Dialog, DialogContent } from "@mui/material";
import MaterialTable from "material-table";
import axios from "axios";
import { useForm } from "react-hook-form";
import _ from "lodash";

// Estilos
import globalStyles from "@/globalStyles/modules/global.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import customStyle from "./ModalProgramTuris_Editar_Servicios.module.css";
import { servicioEscogidoInterface } from "@/utils/interfaces/db";
import LoadingComp from "@/components/Loading/Loading";

import { programaTuristicoInterface } from "@/utils/interfaces/db";
import { useRouter } from "next/router";
import TablaProgramaServicio_v2 from "@/components/Formulario/CustomComponenteFormu/TablaProgramaServicio_v2/TablaProgramaServicio_v2";
import TablaProgramaServicio_v3 from "../TablaProgramaServicio_v3/TablaProgramaServicio_v3";
interface props {
  open: boolean;
  setOpen: Function;
  ListaServiciosProductos: never[];
  ListaServiciosEscojidos: ServicioProducto_Interface[];
  programaTuristico: programaTuristicoInterface;
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

export default function ModalProgramTuris_Editar_Servicios({
  open,
  setOpen,
  ListaServiciosProductos,
  ListaServiciosEscojidos,
  programaTuristico
}: props) {
  const router = useRouter();
  const [openSiguientePaso, setOpenSiguientePaso] = useState(false);
  const [Link_ultimoIngresado, setLink_ultimoIngresado] = useState("");
  const {
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: "onBlur"
  });
  const [Loading, setLoading] = useState(false);
  const [ServicioProducto, setServicioProducto] = useState<
    ServicioProducto_Interface[]
  >([]);
  const [InitServicioProducto, setInitServicioProducto] = useState<
    ServicioProducto_Interface[]
  >([]);
  const [Controlador_DevolverDatos, setControlador_DevolverDatos] =
    useState(false);

  useEffect(() => {
    setInitServicioProducto(_.cloneDeep(ListaServiciosEscojidos));
    setServicioProducto(_.cloneDeep(ListaServiciosEscojidos));
  }, [ListaServiciosEscojidos]);

  const handleClose = () => {
    setOpen(false);
  };
  const onSubmit = (data: any) => {
    const temp_ServicioProducto = _.cloneDeep(ServicioProducto);
    setServicioProducto([]);
    let edicion_prograTuristico = {
      ServicioProducto: _.cloneDeep(temp_ServicioProducto)
    };
    const init_programaTuristico = {
      ServicioProducto: _.cloneDeep(InitServicioProducto)
    };

    if (
      JSON.stringify(edicion_prograTuristico) ===
      JSON.stringify(init_programaTuristico)
    ) {
      alert("No se han realizado cambios");
      router.reload();
      return;
    }
    //@ts-ignore
    // console.log(edicion_prograTuristico);

    axios
      .put(`/api/ProgramaTuristico/CRUD`, {
        ProgramaTuristico: edicion_prograTuristico,
        IdProgramaTuristico: programaTuristico["IdProgramaTuristico"]
      })
      .then((result) => {
        setOpenSiguientePaso(true);
      });
  };

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
              Programa Turistico editado registrado. ¿Cual es su siguiente paso?
            </h4>
            <button
              onClick={() => {
                router.reload();
              }}
              className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}
            >
              Continuar
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
              <h2>Servicios/Productos base del Programa Turistico</h2>
              <TablaProgramaServicio_v3
                Title={""}
                ModoEdicion={true}
                CotiServicio={ServicioProducto}
                setCotiServicio={setServicioProducto}
                // KeyDato={"ServicioProducto"}
                ListaServiciosProductos={ServicioProducto}
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
