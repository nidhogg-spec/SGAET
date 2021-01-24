//Package
import styles from "./CampoFecha.module.css";
import React, { useEffect, useState } from "react";

//Componentes

const CampoFecha = (
  props = {
    Title: "Nombre del Proveedor",
    ModoEdicion: true,
    setDato: () => {},
    Dato: {},
    KeyDato: "nombre",
    Reiniciar: true,
  }
) => {
  const value =props.Dato[props.KeyDato] || '';
  if (props.ModoEdicion == true) {
    return (
      <div>
        <span>{props.Title}</span>
        <input
          value={value}
          type={"date"}
          onChange={(event) => {
            props.setDato({
              ...props.Dato,
              [props.KeyDato]: event.target.value,
            });
          }}
        />
      </div>
    );
  } else {
    return (
      <div className={styles.divMadre}>
        <span>{props.Title}</span>
        <input value={value} type={"date"} disabled />
      </div>
    );
  }
};

export default CampoFecha;
