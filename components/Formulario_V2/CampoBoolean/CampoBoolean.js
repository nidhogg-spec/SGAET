//Package
import styles from "./CampoBoolean.module.css";
import React, { useEffect, useState } from "react";

//Componentes

const CampoBoolean = (
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
          type={'checkbox'}
          onClick={(event) => {
            props.setDato({
              ...props.Dato,
             [props.KeyDato]: event.target.checked
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
        <input value={value} type={'checkbox'} disabled />
      </div>
    );
  }
};

export default CampoBoolean;
