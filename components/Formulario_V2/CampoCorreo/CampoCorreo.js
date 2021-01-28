//Package
import styles from "./CampoCorreo.module.css";
import React from "react";

//Componentes

const CampoCorreo = (
  props = {
    Title: "Nombre del Proveedor",
    ModoEdicion: true,
    setDato: () => {},
    Dato: {},
    KeyDato: "nombre",
    Reiniciar: true,
  }
) => {
  const value = props.Dato[props.KeyDato];
  if (props.ModoEdicion == true) {
    return (
      <div>
        <span>{props.Title}</span>
        <input
          value={value}
          type="email"
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
      </div>
    );
  }
};

export default CampoCorreo;