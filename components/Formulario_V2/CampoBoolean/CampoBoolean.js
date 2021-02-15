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
  const value = props.Dato[props.KeyDato] || false;
  if (props.ModoEdicion == true) {
    return (
      <div>
        <span>{props.Title}</span>
        <input
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
        />
      </div>
    );
  } else {
    return (
      <div className={styles.divMadre}>
        <span>{props.Title}</span>
        <input checked={value} type={'checkbox'} disabled />
      </div>
    );
  }
};

export default CampoBoolean;

// const CampoBoolean = (
//   props = {
//     Title: "Nombre del Proveedor",
//     ModoEdicion: true,
//     setDato: () => {},
//     Dato: {},
//     KeyDato: "nombre",
//     Reiniciar: true,
//   }
// ) => {
//   const value = props.Dato[props.KeyDato] || false;
//   if (props.ModoEdicion == true) {
//     return (
//       <div>
//         <span>{props.Title}</span>
//         <input
//           checked={value}
//           type={'checkbox'}
//           onClick={(event) => {
//             props.setDato({
//               ...props.Dato,
//              [props.KeyDato]: event.target.checked
//             })
//             // let temp_dato = props.Dato;
//             // temp_dato[props.KeyDato] = event.target.value;
//             // props.setDato(temp_dato);
//           }}
//         />
//       </div>
//     );
//   } else {
//     return (
//       <div className={styles.divMadre}>
//         <span>{props.Title}</span>
//         <input checked={value} type={'checkbox'} disabled />
//       </div>
//     );
//   }
// };
// function MemoCodicional(prevProps, nextProps) {
//   return prevProps.Title === nextProps.Title &&
//   prevProps.KeyDato === nextProps.KeyDato &&
//   prevProps.ModoEdicion === nextProps.ModoEdicion &&
//   prevProps.Dato[prevProps.KeyDato] === nextProps.Dato[nextProps.KeyDato];
// }
// export default React.memo(CampoBoolean,MemoCodicional);
