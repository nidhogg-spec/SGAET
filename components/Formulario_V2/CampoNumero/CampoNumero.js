//Package
import styles from "./CampoNumero.module.css";
import React, { useEffect, useState } from "react";

//Componentes

const CampoNumero = (
  props = {
    Title: "Nombre del Proveedor",
    ModoEdicion: true,
    setDato: () => {},
    Dato: {},
    KeyDato: "nombre",
    Reiniciar: true,
    InputStep: "1",
  }
) => {
  const value = props.Dato[props.KeyDato] || 0;
  if (props.ModoEdicion == true) {
    return (
      <div>
        <span>{props.Title}</span>
        <input
          value={value}
          type="number"
          min="0"
          step={props.InputStep || "1"}
          onChange={(event) => {
            props.setDato({
              ...props.Dato,
             [props.KeyDato]: event.target.value
            })
          }}
        />
      </div>
    );
  } else {
    return (
      <div className={styles.divMadre}>
        <span>{props.Title}</span>
        <input
          value={value}
          type="number"
          min="0"
          step={props.InputStep || "1"}
          disabled
        />
      </div>
    );
  }
};

export default CampoNumero;
