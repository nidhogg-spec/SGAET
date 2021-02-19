//Package
import styles from "./AutoFormulario.module.css";
import React, { useEffect, useState } from "react";

//Componentes
import CampoTexto from "@/components/Formulario/CampoTexto/CampoTexto";
import CampoGranTexto from "@/components/Formulario/CampoGranTexto/CampoGranTexto";
import Selector from "@/components/Formulario/Selector/Selector";
import CampoNumero from "@/components/Formulario/CampoNumero/CampoNumero";
import CampoMoney from "@/components/Formulario/CampoMoney/CampoMoney";
import CampoFecha from "@/components/Formulario/CampoFecha/CampoFecha";
import BotonAnadir from "@/components/BotonAnadir/BotonAnadir";
import TablaSimple from "../Formulario/TablaSimple/TablaSimple";
import TablaRelacionMulti from "../Formulario/TablaRelacionMulti/TablaRelacionMulti";
import TablaProgramaServicio from "@/components/Formulario/CustomComponenteFormu/TablaProgramaServicio/TablaProgramaServicio";
import TablaServicioEscogido from "@/components/Formulario/CustomComponenteFormu/TablaServicioEscogido/TablaServicioEscogido";
import TablaProductoServicio from "@/components/Formulario/CustomComponenteFormu/TablaProductoServicio/TablaProductoServicio";

const AutoFormulario = ({
  Formulario = {
    title: "",
    secciones: [
      {
        subTitle: "",
        componentes: []
      }
    ]
  },
  // APIpath,
  Modo,
  DarDato = false,
  DarDatoFunction = () => {
    alert("Falta mandar DarDatoFunction");
  }
}) => {
  //   const [DataInicial, setDataInicial] = useState(Formulario);
  let ed;
  if (Modo == "creacion") ed = true;
  else ed = false;

  const [ModoEdicion, setModoEdicion] = useState(ed);
  // const [APIpath_i, setAPIpath_i] = useState(APIpath);
  // const [DarDato, setDarDato] = useState(false);
  const [ReinciarComponentes, setReinciarComponentes] = useState(false);

  //funciones
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
      case "fecha":
        return (
          <CampoFecha
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
      case "TablaServicioEscogido":
        return (
          <TablaServicioEscogido
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
      case "TablaProductoServicio":
        return (
          <TablaProductoServicio
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            DataProductosSeleccionados={compo.DataProductosSeleccionados}
            DataProductosTodos={compo.DataProductosTodos}
            TipoProveedor={compo.TipoProveedor}
            Reiniciar={ReinciarComponentes}
            columnas={compo.columnas}
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
    if (ReinciarComponentes == true) {
      setReinciarComponentes(false);
    }
  }, [ReinciarComponentes]);

  switch (Modo) {
    case "verEdicion":
      return (
        <div className={styles.Modal_content}>
          <span>{Formulario.title}</span>
          {/* <img
            src="/resources/save-black-18dp.svg"
            onClick={() => {
              setDarDato(true);
              // ReiniciarData()
            }}
          /> */}
          <img
            src="/resources/edit-black-18dp.svg"
            onClick={(event) => {
              if (ModoEdicion == false) {
                event.target.src = "/resources/close-black-18dp.svg";
                setModoEdicion(true);
              } else {
                event.target.src = "/resources/edit-black-18dp.svg";
                setReinciarComponentes(true);
                setModoEdicion(false);
              }
            }}
          />
          {Formulario.secciones.map((seccion) => {
            return (
              <div>
                <span>{seccion.subTitle}</span>
                <div>
                  {seccion.componentes.map((componente) => {
                    return GenerarComponente(componente);
                  })}
                </div>
              </div>
            );
          })}
        </div>
      );
      break;
    case "creacion":
      return (
        <>
          <div className={styles.FormuContent}>
            <span>{Formulario.title}</span>
            <button>
              <img
                src="/resources/save-black-18dp.svg"
                onClick={() => {
                  setDarDato(true);
                  // ReiniciarData();
                }}
              />
            </button>
            <button>
              <img
                src="/resources/edit-black-18dp.svg"
                onClick={(event) => {
                  if (ModoEdicion == false) {
                    event.target.src = "/resources/close-black-18dp.svg";
                    setModoEdicion(true);
                  } else {
                    event.target.src = "/resources/edit-black-18dp.svg";
                    setReinciarComponentes(true);
                    setModoEdicion(false);
                  }
                }}
              />
            </button>
            {Formulario.secciones.map((seccion) => {
              return (
                <div>
                  <span>{seccion.subTitle}</span>
                  <div>
                    {seccion.componentes.map((componente) => {
                      return GenerarComponente(componente);
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
      break;

    default:
      break;
  }
};

export default AutoFormulario;
