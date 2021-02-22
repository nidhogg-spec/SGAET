//Package
import styles from "./AutoModal_v2.module.css";
import React, { useContext, useEffect, useState } from "react";

//Componentes
import CampoTexto from "@/components/Formulario/CampoTexto/CampoTexto";
import CampoGranTexto from "@/components/Formulario/CampoGranTexto/CampoGranTexto";
import Selector from "@/components/Formulario/Selector/Selector";
import CampoNumero from "@/components/Formulario/CampoNumero/CampoNumero";
import CampoMoney from "@/components/Formulario/CampoMoney/CampoMoney";
import BotonAnadir from "@/components/BotonAnadir/BotonAnadir";
import TablaSimple from "../Formulario/TablaSimple/TablaSimple";
import TablaRelacionMulti from "../Formulario/TablaRelacionMulti/TablaRelacionMulti";
import TablaProgramaServicio from "@/components/Formulario/CustomComponenteFormu/TablaProgramaServicio/TablaProgramaServicio";
import TablaProgramaServicio_v2 from "@/components/Formulario/CustomComponenteFormu/TablaProgramaServicio_v2/TablaProgramaServicio_v2";

const AutoModal = ({
  Formulario = {
    id: "",
    title: "",
    secciones: [
      {
        subTitle: "",
        componentes: []
      }
    ]
  },
  ModalDisplay,
  IdDato = ""
  // APIpath,
  // ReiniciarData,
  // Display, //Solo en modoVerEdicions
  // MostrarModal=()=>{} //Solo en modoVerEdicions
}) => {
  const [[Display, setDisplay], [ModalData, setModalData]] = useContext(
    ModalDisplay
  );

  const [ModoEdicion, setModoEdicion] = useState(false);
  const [DarDato, setDarDato] = useState(false);
  const [ReinciarComponentes, setReinciarComponentes] = useState(false);

  let DataNuevaEdit = {};
  //funciones
  const DarDatoFunction = (keyDato, Dato) => {
    DataNuevaEdit[keyDato] = Dato;
  };
  const GenerarComponente = (compo) => {
    // console.log(compo.tipo);
    switch (compo.tipo) {
      case "texto":
        return (
          <CampoTexto
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            Reiniciar={ReinciarComponentes}
          />
        );
        break;
      case "granTexto":
        return (
          <CampoGranTexto
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            Reiniciar={ReinciarComponentes}
          />
        );
        break;
      case "selector":
        return (
          <Selector
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            SelectOptions={compo.SelectOptions}
            Reiniciar={ReinciarComponentes}
          />
        );
        break;
      case "numero":
        return (
          <CampoNumero
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            InputStep={compo.InputStep}
            Reiniciar={ReinciarComponentes}
          />
        );
        break;
      case "money":
        return (
          <CampoMoney
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            Reiniciar={ReinciarComponentes}
          />
        );
        break;
      case "tablaSimple":
        return (
          <TablaSimple
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            Reiniciar={ReinciarComponentes}
            columnas={compo.columnas}
          />
        );
        break;
      case "tablaRelacionMulti":
        return (
          <TablaRelacionMulti
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            Reiniciar={ReinciarComponentes}
            columnas={compo.columnas}
            DatoTabla={compo.DatoTabla} // Datos de la coleccion relacionada
          />
        );
        break;
      case "CustomTablaProgramaServicio":
        return (
          <TablaProgramaServicio
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            Reiniciar={ReinciarComponentes}
            columnas={compo.columnas}
            APIpathGeneral={compo.APIpathGeneral}
          />
        );
        break;
      case "TablaProgramaServicio_v2":
        return (
          <TablaProgramaServicio_v2
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            ListaServiciosProductos={compo.ListaServiciosProductos}
            Reiniciar={ReinciarComponentes}
          />
        );
        break;
      default:
        return <p>Error al leer el componente</p>;
        break;
    }
  };

  //Hooks
  useEffect(() => {
    if (Object.keys(ModalData).length == 0) {
      setModoEdicion(true);
    }
  }, [ModalData]);
  useEffect(() => {
    if (ReinciarComponentes == true) {
      setReinciarComponentes(false);
    }
  }, [ReinciarComponentes]);

  useEffect(() => {
    if (DarDato == true) {
      console.log("Esta en modo verEdicion");
      setDarDato(false);
      DataNuevaEdit[IdDato] = Formulario.id;
      setModalData(DataNuevaEdit);
      console.log(DataNuevaEdit);
      setDisplay(false);
      setModoEdicion(false);
    }
  }, [DarDato]);

  useEffect(() => {
    let modal = document.getElementById("MiModalVerEdicion");
    // setDisplay(Display)
    if (Display == true) {
      modal.style.display = "block";
    } else {
      modal.style.display = "none";
    }
  }, [Display]);
  return (
    <div
      id="MiModalVerEdicion"
      className={styles.Modal}
      onClick={(event) => {
        let modal = document.getElementById("MiModalVerEdicion");
        if (event.target == modal) {
          if (confirm("Esta seguro que quiere cerrar?")) {
            setDisplay(false);
          }
        }
      }}
    >
      <div className={styles.Modal_content}>
        <h1>{Formulario.title}</h1>
        {ModoEdicion ? (
          <>
            <button>
              <img
                src="/resources/save-black-18dp.svg"
                onClick={() => {
                  setDarDato(true);
                  // ReiniciarData()
                }}
              />
            </button>
            <button>
              <img
                src="/resources/close-black-18dp.svg"
                onClick={(event) => {
                  setReinciarComponentes(true);
                  setModoEdicion(false);
                }}
              />
            </button>
          </>
        ) : (
          <>
            <button>
              <img
                src="/resources/edit-black-18dp.svg"
                onClick={(event) => {
                  setModoEdicion(true);
                }}
              />
            </button>
          </>
        )}
        {Formulario.secciones.map((seccion) => {
          return (
            <div>
              <h2>{seccion.subTitle}</h2>
              <div>
                {seccion.componentes.map((componente) => {
                  return GenerarComponente(componente);
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AutoModal;
