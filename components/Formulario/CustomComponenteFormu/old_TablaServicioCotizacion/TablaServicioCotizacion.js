//Package
import styles from "./TablaServicioCotizacion.module.css";
import React, { useEffect, useState } from "react";

//Componentes
import MaterialTable from "material-table";

const TablaServicioCotizacion = (
  props = {
    Title: "Nombre del Proveedor",
    ModoEdicion: true,
    DevolverDatoFunct: { RegistrarDato },
    DarDato: { DevolverDato },
    KeyDato: "nombre",
    Dato: [],
    Reiniciar: true,
    // columnas:[]
  }
) => {
  // Variables
  let editableacion = {};
  const [ModoEdicion, setModoEdicion] = useState(props.ModoEdicion);
  //Datos obtenidos de servicio en PromasTuristicos
  const [Data, setData] = useState([]);
  const [DataInit, setDataInit] = useState([]);
  //Datos q se guardaran en la cotizacion
  const [CotiServicio, setCotiServicio] = useState([]);
  const [CotiServicioInit, setCotiServicioInit] = useState([]);
  //Lista de servicios para añadir
  const [ServiciosInit, setServiciosInit] = useState([]);
  const [DataTableServicios, setDataTableServicios] = useState([]);
  //Funciones
  const ActualizacionDatos = () => {};
  //Hooks
  useEffect(async () => {
    let Datos = [];
    try {
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
          Datos = data.result;
          //   Datos.map((dt)=>{
          //     dt["Opcional"]=false
          //     dt["NumeroOpcion"]=0
          //     dt["Pregunta"]=""
          //     dt["Incluido"]=false
          //   })
          setServiciosInit(Datos);
        });
    } catch (error) {
      console.log("Error - Extraccion servicio - " + error);
    }
    setDataTableServicios(Datos);
    // try {
    //   if (Data != []) {
    //     let dt = [];
    //     Data.map((servicio) => {
    //       let dtCotSer = {};
    //       if (servicio["IdServicio?"]) {
    //         dtCotSer["IdServicio"] = servicio["IdServicio"];
    //         dtCotSer["NombreServicio"] = servicio["NombreServicio"];
    //         if (servicio["Opcional"]) {
    //           dtCotSer["NumeroOpcion"] = servicio["NumeroOpcion"];
    //           dtCotSer["Incluido"] = false;
    //           dtCotSer["Origen"] = "ProgramaTuristico";
    //         } else {
    //           dtCotSer["NumeroOpcion"] = null;
    //           dtCotSer["Incluido"] = True;
    //           dtCotSer["Origen"] = "ProgramaTuristico";
    //         }
    //         dt.push(dtCotSer);
    //       }
    //     });
    //     setCotiServicio(dt);
    //   } else {
    //     setCotiServicio([]);
    //   }
    // } catch (error) {
    //   console.log("Error - Extraccion DATA - " + error);
    // }
  }, []);
  useEffect(() => {
    // setData(props.Dato);
    // setDataInit(props.Dato);
    try {
      //   if (props.Dato != []) {
      //     let dt = [];
      //     console.log(props.Dato)
      //     props.Dato.map((servicio) => {
      //       let dtCotSer = {};
      //       if (servicio["IdServicio?"]) {
      //         dtCotSer["IdServicio"] = servicio["IdServicio"];
      //         dtCotSer["NombreServicio"] = servicio["NombreServicio"];
      //         if (servicio["Opcional"]) {
      //           dtCotSer["NumeroOpcion"] = servicio["NumeroOpcion"];
      //           dtCotSer["Incluido"] = false;
      //           dtCotSer["Origen"] = "ProgramaTuristico";
      //         } else {
      //           dtCotSer["NumeroOpcion"] = null;
      //           dtCotSer["Incluido"] = True;
      //           dtCotSer["Origen"] = "ProgramaTuristico";
      //         }
      //         dt.push(dtCotSer);
      //       }
      //     });
      //     setCotiServicio(dt);
      //   } else {
      //     setCotiServicio(Datos);
      //   }
    //   let ActuDataTableServicios = [...DataTableServicios];
    let ActuDataTableServicios = [...ServiciosInit];
      props.Dato.map((element) => {
        ActuDataTableServicios.splice(
          ActuDataTableServicios.find((value) => {
            return value["IdServicio"] == element["IdServicio"];
          }),
          1
        );
      });
      setDataTableServicios(ActuDataTableServicios);
      setCotiServicio(props.Dato);
    } catch (error) {
      console.log("Error - Extraccion DATA - " + error);
    }
  }, [props.Dato]);
  useEffect(() => {
    if (props.Reiniciar == true) {
      setData(DataInit);
    }
  }, [props.Reiniciar]);
  useEffect(() => {
    setModoEdicion(props.ModoEdicion);
  }, [props.ModoEdicion]);
  useEffect(() => {
    if (props.DarDato == true) {
        let servicios=[]
        CotiServicio.map((element)=>{
            servicios.push(element['IdServicio'])
        })
      props.DevolverDatoFunct(props.KeyDato, servicios);
    }
  }, [props.DarDato]);

  if (ModoEdicion == true) {
    return (
      <div>
        <span>{props.Title}</span>
        <button>Añadir</button>
        
        <MaterialTable
          title={props.Title}
          columns={[
            {
              field: "IdServicio",
              title: "Id",
              editable: "never",
              hidden: true,
            },
            { field: "NombreServicio", title: "Nombre", editable: "never" },
            { field: "NumeroOpcion", title: "Opcion", editable: "never" },
            { field: "Origen", title: "Origen", editable: "never" },
            {
              field: "Incluido", // Era IdProveedor, solo porciacaso :v
              title: "Cumple con el servicio?",
              type: "boolean",
              default: "false",
            },
          ]}
          data={CotiServicio}
          editable={{
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...CotiServicio];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  setCotiServicio([...dataDelete]);

                  resolve();
                }, 1000);
              }),
          }}
        />
        <div className={styles.MasServicios}>
          <MaterialTable
            title={"Servicios para añadir"}
            columns={[
              {
                field: "IdServicio",
                title: "Id",
                editable: "never",
                hidden: true,
              },
              { field: "NombreServicio", title: "Nombre", editable: "never" },
            ]}
            data={DataTableServicios}
            actions={[
              {
                icon: "add",
                tooltip: "Añadir Servicio a Cotizacion",
                onClick: (event, rowData) => {
                  let x = [...CotiServicio];
                  x.push({
                    IdServicio: rowData["IdServicio"],
                    NombreServicio: rowData["NombreServicio"],
                    Origen: "Añadido Manual",
                    Incluido: true,
                    NumeroOpcion: null,
                  });
                  setCotiServicio(x);
                  let ActuDataTableServicios = [...DataTableServicios];
                  ActuDataTableServicios.splice(
                    ActuDataTableServicios.findIndex((value) => {
                      return value["IdServicio"] == rowData["IdServicio"];
                    }),
                    1
                  );
                  setDataTableServicios(ActuDataTableServicios);
                },
              },
            ]}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.divMadre}>
        <MaterialTable
          title={props.Title}
          columns={props.columnas}
          data={Data}
        />
      </div>
    );
  }
};

export default TablaServicioCotizacion;
