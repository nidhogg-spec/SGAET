//Package
import styles from "./CampoMoney.module.css";
import React, { useEffect, useState } from "react";

//Componentes

const CampoMoney = (
  props = {
    Title: "Nombre del Proveedor",
    ModoEdicion: true,
    setDato: () => {},
    Dato: {},
    KeyDato: "nombre",
    Reiniciar: true,
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
          min="0.00"
          step="0.01"
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
        <input
          value={value}
          type="number"
          min="0.00"
          step="0.01"
          disabled
        />
      </div>
    );
  }
};

export default CampoMoney;
