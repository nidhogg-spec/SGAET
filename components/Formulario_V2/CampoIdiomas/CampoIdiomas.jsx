//Package
import styles from "./CampoIdiomas.module.css";
import React, { useEffect, useState } from "react";

//Componentes

const CampoIdiomas = (
  props = {
    Title: "Nombre del Proveedor",
    ModoEdicion: true,
    setDato: () => {},
    Dato: {},
    KeyDato: "nombre",
    Reiniciar: true,
  }
) => {
  const value = props.Dato[props.KeyDato] || [
    {idioma:"Aleman",checked:false},
    {idioma:"Chino mandarin",checked:false},
    {idioma:"Español",checked:false},
    {idioma:"Francés",checked:false},
    {idioma:"Inglés",checked:false},
    {idioma:"Portugués",checked:false},
    {idioma:"Ruso",checked:false},
  ];
  if (props.ModoEdicion == true) {
    return (
      <div className={styles.formulario__idioma__containar}>
        <span>{props.Title}</span>
        {value.map((item, index) => {
          return (
            <div key={index} className={styles.formulario__idioma__checkboxContainer}>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => {
                  value[index].checked = e.target.checked;
                  props.setDato({
                    ...props.Dato,
                   [props.KeyDato]: value
                  })
                }}
              />
              <label htmlFor={index}>{item.idioma}</label>
            </div>
          );
        })}
        {/* <input
          checked={value}
          type={'checkbox'}
          onChange={(event) => {
            props.setDato({
              ...props.Dato,
             [props.KeyDato]: event.target.checked
            })
            // let temp_dato = props.Dato;
            // temp_dato[props.KeyDato] = event.target.value;
            // props.setDato(temp_dato);
          }}
        /> */}
      </div>
    );
  } else {
    return (
      <div className={styles.formulario__idioma__containar}>
        <span>{props.Title}</span>
        {value.map((item, index) => {
          if(item.checked){
            return (
              <div key={index} className={styles.formulario__idioma__checkboxContainer}>
                <label htmlFor={index}>{item.idioma}</label>
              </div>
            );
          }          
        })}
        {/* <input checked={value} type={'checkbox'} disabled /> */}
      </div>
    );
  }
};

export default CampoIdiomas;