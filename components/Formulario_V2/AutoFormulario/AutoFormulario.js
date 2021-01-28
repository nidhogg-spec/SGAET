//Package
import styles from "./AutoFormulario.module.css";
import React, { useEffect, useState } from "react";

//Componentes
import CampoTexto from "../CampoTexto/CampoTexto";
import CampoGranTexto from "../CampoGranTexto/CampoGranTexto";
import Selector from "../Selector/Selector";
import CampoNumero from "../CampoNumero/CampoNumero";
import CampoMoney from "../CampoMoney/CampoMoney";
import CampoFecha from "../CampoFecha/CampoFecha";
import CampoCorreo from "../CampoCorreo/CampoCorreo";
import TablaSimple from "../TablaSimple/TablaSimple";
import CampoBoolean from '../CampoBoolean/CampoBoolean'
const AutoFormulario = (
  props = {
    Formulario: {
      title: "",
      secciones: [
        {
          subTitle: "",
          componentes: [],
        },
      ],
    },
    ModoEdicion,
    Dato,
    setDato: () => {},
  }
) => {
  const GenerarComponente = (compo,key) => {
    switch (compo.tipo) {
      case "texto":
        return (
          <CampoTexto
            Title={compo.Title}
            ModoEdicion={props.ModoEdicion}
            setDato={props.setDato}
            KeyDato={compo.KeyDato}
            Dato={props.Dato}
            key={'AD'+key}
          />
        );
        break;
      case "fecha":
        return (
          <CampoFecha
            Title={compo.Title}
            ModoEdicion={props.ModoEdicion}
            setDato={props.setDato}
            KeyDato={compo.KeyDato}
            Dato={props.Dato}
            key={'AD'+key}
          />
        );
        break;
      case "correo":
      return (
        <CampoCorreo
          Title={compo.Title}
          ModoEdicion={props.ModoEdicion}
          setDato={props.setDato}
          KeyDato={compo.KeyDato}
          Dato={props.Dato}
          key={'AD'+key}
        />
      );
      break;
      case "granTexto":
        return (
          <CampoGranTexto
            Title={compo.Title}
            ModoEdicion={props.ModoEdicion}
            setDato={props.setDato}
            KeyDato={compo.KeyDato}
            Dato={props.Dato}
            key={'AD'+key}
          />
        );
        break;
      case "selector":
        return (
          <Selector
            Title={compo.Title}
            ModoEdicion={props.ModoEdicion}
            setDato={props.setDato}
            KeyDato={compo.KeyDato}
            Dato={props.Dato}
            SelectOptions={compo.SelectOptions}
            key={'AD'+key}
          />
        );
        break;
      case "numero":
        return (
          <CampoNumero
            Title={compo.Title}
            ModoEdicion={props.ModoEdicion}
            setDato={props.setDato}
            KeyDato={compo.KeyDato}
            Dato={props.Dato}
            InputStep={compo.InputStep}
            key={'AD'+key}
          />
        );
        break;
      case "money":
        return (
          <CampoMoney
            Title={compo.Title}
            ModoEdicion={props.ModoEdicion}
            setDato={props.setDato}
            KeyDato={compo.KeyDato}
            Dato={props.Dato}
            key={'AD'+key}
          />
        );
        break;
      case "tablaSimple":
        return (
          <TablaSimple
            Title={compo.Title}
            ModoEdicion={props.ModoEdicion}
            setDato={props.setDato}
            KeyDato={compo.KeyDato}
            Dato={props.Dato}
            columnas={compo.columnas}
            key={'AD'+key}
          />
        );
        break;
        case "boolean":
        return (
          <CampoBoolean
            Title={compo.Title}
            ModoEdicion={props.ModoEdicion}
            setDato={props.setDato}
            KeyDato={compo.KeyDato}
            Dato={props.Dato}
            key={'AD'+key}
          />
        );
        break;
      default:
        return <p>Error al leer el componente</p>;
        break;
    }
  };
  return (
    <div className={styles.Modal_content}>
      {/* <h2>{props.Formulario.title}</h2> */}
      {props.Formulario.secciones.map((seccion,SeccionesIndex) => {
        return (
          <div key={'Seccion_' + SeccionesIndex}>
            <h3>{seccion.subTitle}</h3>
            <div>
              {seccion.componentes.map((componente,index) => {
                return GenerarComponente(componente,index);
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AutoFormulario;
