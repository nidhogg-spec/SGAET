//Package
import styles from "./CampoWeb.module.css";
import React from "react";
import { Language } from "@material-ui/icons";

//Componentes

const CampoWeb = (
  props = {
    Title: "Nombre del Proveedor",
    ModoEdicion: true,
    setDato: () => {},
    Dato: {},
    KeyDato: "nombre",
    Reiniciar: true,
  }
) => {
  const value = props.Dato[props.KeyDato] || '';
  if (props.ModoEdicion == true) {
    return (
      <div className={styles.divMadre}>
        <span>{props.Title}</span>
        <input
          value={value}
          onChange={(event) => {
            props.setDato({
              ...props.Dato,
             [props.KeyDato]: event.target.value
            })
            // let temp_dato = props.Dato;
            // temp_dato[props.KeyDato] = event.target.value;
            // props.setDato(temp_dato);
          }}
        />
      </div>
    );
  } else {
    return (
      <div className={styles.divMadre}>
        <span>{props.Title}</span>
        <input value={value} disabled />
        {value!=null & value!=""?
          <a href={`${value}`} target="_blank" title="Abrir web en otra pestaña">
            <Language/>
          </a> 
        :null
        }
              
      </div>
    );
  }
};

export default CampoWeb;
