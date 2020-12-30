//Package
import styles from "./TablaProgramaServicio.module.css";
import React, { useEffect, useState } from "react";

//Componentes
import MaterialTable from "material-table";

const TablaProgramaServicio = (
  props = {
    Title: "Nombre del Proveedor",
    ModoEdicion: true,
    DevolverDatoFunct: () => {
      console.log("Te olvidades de una function devolver dato, brother");
    },
    DarDato: false,
    KeyDato: "KeyDatoGeneral",
    Dato: [],
    Reiniciar,
    APIpathGeneral,
    columnas,
  }
) => {
  const [ModoEdicion, setModoEdicion] = useState(props.ModoEdicion);
  const [Data, setData] = useState(props.Dato);
  const [DataTabla, setDataTabla] = useState([]);
  const [Columns, setColumns] = useState(props.columnas);
  const [DataTablaInit, setDataTablaInit] = useState([]);
  useEffect(() => {
    console.log(DataTabla);
  }, [DataTabla]);
  // hooks
  useEffect(async () => {
    await fetch(props.APIpathGeneral, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coleccion: "Servicio",
        accion: "FindAll",
        projection: {
          _id: 0,
          IdServicio: 1,
          NombreServicio: 1,
        },
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        let Datos = data.result;
        Datos.map((dt) => {
          dt["Opcional"] = false;
          dt["NumeroOpcion"] = 0;
          dt["Pregunta"] = "";
          dt["IdServicio?"] = false;
        });
        setDataTabla(Datos);
        setDataTablaInit(Datos);
      });
  }, []);
  useEffect(() => {
    console.log("Estoy en props Dato");
    let DatosIniciales = DataTabla;
    props.Dato.map((dt) => {
      let index = DatosIniciales.indexOf(dt["IdServicio"]);
      DatosIniciales[index] = dt;
    });
    setDataTabla(DatosIniciales);
  }, [props.Dato]);
  useEffect(() => {
    if (props.DarDato) {
      props.DevolverDatoFunct(props.KeyDato, Data);
    }
  }, [props.DarDato]);
  useEffect(() => {
    if (props.Reiniciar == true) {
      setData(props.Dato);
      setDataTabla(DataTablaInit);
    }
  }, [props.Reiniciar]);

  if (ModoEdicion == true) {
    return (
      <div>
        <span>{props.Title}</span>
        <MaterialTable
          title={props.Title}
          // columns={Columns}
          // data={DataTabla}
          columns={Columns}
          data={DataTabla}
          editable={{
            onBulkUpdate: (rows) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  let dtPrueba = [...Data];
                  let x = [...DataTabla];
                  Object.entries(rows).map((row) => {
                    const index = row[1].newData.tableData.id;
                    x[index] = row[1].newData;
                    if (x[index]["IdServicio?"]) {
                      let i = dtPrueba.findIndex((Element, number, obj) => {
                        Element["IdServicio"] == x[index]["IdServicio"];
                      });
                      if (i == -1) {
                        dtPrueba.push(x[index]);
                      } else {
                        dtPrueba[i] = x[index];
                      }
                    } else {
                      let i = dtPrueba.findIndex(x[index]["IdServicio"]);
                      if (i != -1) {
                        dtPrueba.splice(i, 1);
                      }
                    }
                  });
                  setData([...dtPrueba]);
                  setDataTabla([...x]);
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
        <MaterialTable title={props.Title} columns={Columns} data={[]} />
      </div>
    );
  }
};

export default TablaProgramaServicio;
