//Package
import styles from "./Selector.module.css";
import React, { useEffect, useState } from "react";

const Selector = (
  props = {
    Title: "Nombre del Proveedor",
    ModoEdicion: true,
    setDato: () => {},
    Dato: {},
    KeyDato: "nombre",
    Reiniciar: true,
    SelectOptions: [],
  }
) => {
  //Los siguientes datos deberian de estar en props para su correcto funcionamiento:
  //    Title
  //    ModoEdicion  bool
  //    Dato
  //    DevolverDatoFunct={RegistrarDato}
  //    DarDato={DevolverDato}
  //    KeyDato - Dato como el cual se guardar
  //    SelectOptions = [value, texto]
  //---------------------------------------------------------------------------------
  const value = props.Dato[props.KeyDato] || '';
  if (props.ModoEdicion == true) {
    return (
      <div>
        <span>{props.Title}</span>
        <select
          onChange={(event) => {
            props.setDato({
              ...props.Dato,
              [props.KeyDato]: event.target.value,
            });
          }}
          value={value}
        >
          {props.SelectOptions.map((SelectOption, index) => {
            return (
              <Option
                key={index.toString()}
                value={SelectOption.value}
                texto={SelectOption.texto}
              ></Option>
            );
          })}
        </select>
      </div>
    );
  } else {
    return (
      <div className={styles.divMadre}>
        <span>{props.Title}</span>
        <select value={value} disabled>
          {props.SelectOptions.map((SelectOption, index) => {
            return (
              <Option
                key={index.toString()}
                value={SelectOption.value}
                texto={SelectOption.texto}
              ></Option>
            );
          })}
        </select>
      </div>
    );
  }
};
const Option = ({ value, texto }) => {
  return <option value={value}>{texto}</option>;
};

export default Selector;
