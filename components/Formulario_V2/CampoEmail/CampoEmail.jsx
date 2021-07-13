//Package
import styles from "./CampoEmail.module.css";
import React from "react";
import { Send } from "@material-ui/icons";

//Componentes

const CampoEmail = (
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
      <div>
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
          <a href={`mailto:${value}`}>
            <Send/>
          </a> 
        :null
        }
              
      </div>
    );
  }
};

export default CampoEmail;
