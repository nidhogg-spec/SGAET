//Package
import styles from "./TablaSimple.module.css";
import React, { useEffect, useState } from "react";

//Componentes
import MaterialTable from "material-table";

const TablaSimple = (
  props = {
    Title: "Nombre del Proveedor",
    ModoEdicion: true,
    setDato: () => {},
    Dato: {},
    KeyDato: "nombre",
    Reiniciar: true,
    columnas: [],
  }
) => {
  const value = props.Dato[props.KeyDato] || [];
  // const [Data, setData] = useState(props.Dato[props.KeyDato]);
  // useEffect(() => {
  //   props.setDato({
  //     ...props.Dato,
  //    [props.KeyDato]: event.target.value
  //   })
  // }, [Data]);
  if (props.ModoEdicion == true) {
    return (
      <div>
        <span>{props.Title}</span>
        <MaterialTable
          title={props.Title}
          columns={props.columnas}
          data={value}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  // let temp_dato = props.Dato;
                  // if (props.Dato[props.KeyDato] == undefined || props.Dato[props.KeyDato]==null) {
                  //   temp_dato[props.KeyDato]=[];
                  // }
                  // temp_dato[props.KeyDato] = [...props.Dato[props.KeyDato], newData];
                  // props.setDato(temp_dato);
                  // resolve();
                  setData([...Data, newData]);

                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  // const dataUpdate = [...props.Dato[props.KeyDato]];
                  // const index = oldData.tableData.id;
                  // dataUpdate[index] = newData;
                  // let temp_dato = props.Dato;
                  // temp_dato[props.KeyDato] = [...dataUpdate];
                  // props.setDato(temp_dato);
                  const dataUpdate = [...Data];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  setData([...dataUpdate]);
                  resolve();
                }, 1000);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  // const dataDelete = [...props.Dato[props.KeyDato]];
                  // const index = oldData.tableData.id;
                  // dataDelete.splice(index, 1);
                  // let temp_dato = props.Dato;
                  // temp_dato[props.KeyDato] = [...dataDelete];
                  // props.setDato(temp_dato);
                  const dataDelete = [...Data];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  setData([...dataDelete]);
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
          data={value}
        />
      </div>
    );
  }
};

export default TablaSimple;
