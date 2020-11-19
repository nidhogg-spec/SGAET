//Package
import styles from "./Selector.module.css";
import React, { useEffect, useState } from "react";

const Selector = (props) => {
  //Los siguientes datos deberian de estar en props para su correcto funcionamiento:
  //    Title
  //    ModoEdicion  bool
  //    Dato
  //    DevolverDatoFunct={RegistrarDato}
  //    DarDato={DevolverDato}
  //    KeyDato - Dato como el cual se guardar
  //    SelectOptions = [value, texto]
  //---------------------------------------------------------------------------------
  const [ModoEdicion, setModoEdicion] = useState(props.ModoEdicion);
  const [Dato, setDato] = useState(props.Dato);

  //hooks
  useEffect(() => {
    setDato(props.Dato);
  }, [props.Dato]);

  useEffect(() => {
    setModoEdicion(props.ModoEdicion);
  }, [props.ModoEdicion]);

  useEffect(() => {
    if (props.DarDato == true) {
      props.DevolverDatoFunct(props.KeyDato, Dato);
    }
  }, [props.DarDato]);
  useEffect(() => {
      console.log(Dato)
  }, [Dato]);

  // Definir JSX

  if (ModoEdicion == true) {
    return (
      <div>
        <span>{props.Title}</span>
        <select
          onChange={(event) => {
            setDato(event.target.value)
          }}
          value={Dato}
        >
          {props.SelectOptions.map(SelectOption => {
              return <option value={SelectOption.value}>{SelectOption.texto}</option>
          })}
        </select>
      </div>
    );
  } else {
    return (
      <div className={styles.divMadre}>
        <span>{props.Title}</span>
        <span>{Dato}</span>
      </div>
    );
  }
};

export default Selector;
