//Package
import styles from "./TablaRelacionMulti.module.css";
import React, { useEffect, useState } from "react";

//Componentes
import MaterialTable from "material-table";

const TablaRelacionMulti = (
  props = {
    Title: "Nombre del Proveedor",
    ModoEdicion: true,
    DevolverDatoFunct,
    DarDato: { DevolverDato },
    KeyDato: "KeyDatoGeneral",
    Dato: [],
    DatoTabla: [], // Datos completos de la collecion
    Reiniciar: true,
    columnas: [],
    // coleccion:""//nombre de la coleccion con el cual conectar
  }
) => {
  const [ModoEdicion, setModoEdicion] = useState(props.ModoEdicion);
  const [Data, setData] = useState(props.Dato);
  const [DatosTablaCompleto, setDatosTablaCompleto] = useState(props.DatoTabla||[]);
  useEffect(() => {
    setData(props.Dato);
    // DatosTablaCompleto.map((dt) => {
        
    //     if (props.Dato.includes(dt[props.KeyDato])) {
    //       dt[props.KeyDato + "?"] = true;
    //     } else {
    //       dt[props.KeyDato + "?"] = false;
    //     }
    //   });
  }, [props.Dato]);
  useEffect(() => {
    console.log(Data)
    DatosTablaCompleto.map((dt) => {
        
      if (Data.includes(dt[props.KeyDato])) {
        dt[props.KeyDato + "?"] = true;
      } else {
        dt[props.KeyDato + "?"] = false;
      }
    });
  }, [Data]);

  useEffect(() => {
    if (props.Reiniciar == true) {
      setData(props.Dato);
    }
  }, [props.Reiniciar]);
  useEffect(() => {
    setModoEdicion(props.ModoEdicion);
  }, [props.ModoEdicion]);

  useEffect(() => {
    if (props.DarDato == true) {
      console.log(Data);
      props.DevolverDatoFunct(props.KeyDato, Data);
    }
  }, [props.DarDato]);

  //custom useeffect
  useEffect(() => {
    setDatosTablaCompleto(props.DatoTabla);
  }, [props.DatoTabla]);
  // useEffect(() => {
  //     if(ModoEdicion==false){
  //         DatosTablaCompleto=props.DatoTabla.filter(dt=>{
  //             Data.includes(dt[props.KeyDato])
  //         })
  //     }
  // }, [Data]);


//   useEffect(() => {
//     if (ModoEdicion == true) {
//       // DatosTablaCompleto=props.DatoTabla
//     } else {
//       // DatosTablaCompleto=props.DatoTabla.filter(dt=>{
//       //     Data.includes(dt[props.KeyDato])
//       // })
//     }
//   }, [ModoEdicion]);

  if (ModoEdicion == true) {
    return (
      <div>
        <span>{props.Title}</span>
        <MaterialTable
          title={props.Title}
          columns={props.columnas}
          data={DatosTablaCompleto}
          editable={{
            onBulkUpdate: (rows) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("Esto es dentro del la tabla")
                  console.log(rows);
                  let x = [];
                  Object.entries(rows).map((y) => {
                    x.push(y[1]["newData"][props.KeyDato]);
                  });
                  setData(x);
                  x = DatosTablaCompleto;
                  Object.entries(rows).map((y) => {
                    const index = y[1].oldData.tableData.id;
                    x[index] = y[1].newData;
                  });
                  setDatosTablaCompleto(x);
                  resolve();
                }, 1000);
              }),
          }}
        />
      </div>
    );
  } else {
    return (
      <div className={styles.divMadre}>
        <MaterialTable
          title={props.Title}
          columns={props.columnas}
          data={DatosTablaCompleto}
        />
      </div>
    );
  }
};

export default TablaRelacionMulti;
