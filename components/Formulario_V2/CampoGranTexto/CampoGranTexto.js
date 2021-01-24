//Package
import styles from "./CampoGranTexto.module.css";
import React, { useEffect, useState } from "react";

//Componentes

const CampoGranTexto = (
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
        <textarea
          value={value}
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
        <textarea value={value} disabled />
      </div>
    );
  }
};

export default CampoGranTexto;
