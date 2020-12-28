//Package
import styles from "./TablaProgramaServicio_v2.module.css";
import React, { useEffect, useState } from "react";

//Componentes
import MaterialTable from "material-table";

const TablaProgramaServicio_v2 = (
  props = {
    Title: "Nombre del Proveedor",
    ModoEdicion: true,
    DevolverDatoFunct: { RegistrarDato },
    DarDato: { DevolverDato },
    KeyDato: "nombre",
    Dato: [],
    ListaServiciosProductos: [],
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
  // useEffect(async () => {
  //   let Datos = [];
  //   try {
  //     await fetch(props.APIpathGeneral, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         coleccion: "Servicio",
  //         accion: "FindAll",
  //         projection: {
  //           _id: 0,
  //           IdServicio: 1,
  //           NombreServicio: 1,
  //         },
  //       }),
  //     })
  //       .then((r) => r.json())
  //       .then((data) => {
  //         Datos = data.result;
  //         setServiciosInit(Datos);
  //       });
  //   } catch (error) {
  //     console.log("Error - Extraccion servicio - " + error);
  //   }
  //   setDataTableServicios(Datos);
  // }, []);
  useEffect(() => {
    try {
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
      let servicios = [];
      CotiServicio.map((element) => {
        servicios.push(element["IdServicio"]);
      });
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
              field: "IdServicioProducto",
              title: "IdServicioProducto",
              editable: "never",
              hidden: true,
            },
            {
              field: "CostoUnitario",
              title: "Costo Unitario",
              editable: "never",
              type: "numeric",
              hidden: true,
            },
            { field: "NombreServicio", title: "Nombre", editable: "never" },
            {
              field: "Cantidad",
              title: "Cantidad",
              editable: "always",
              type: "numeric",
            },
            {
              field: "PrecioUnitario",
              title: "Precio Unitario",
              editable: "never",
              type: "numeric",
            },
            {
              field: "IGV",
              title: "IGV incluido?",
              editable: "always",
              type: "boolean",
            },
            {
              field: "PrecioTotal",
              title: "Precio Total",
              editable: "never",
              type: "numeric",
            },
            {
              field: "CostoTotal",
              title: "Costo Total",
              editable: "never",
              type: "numeric",
            },
          ]}
          data={CotiServicio}
          editable={{
            onBulkUpdate: (cambios) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  // if (typeof(cambios) === 'object') {
                  //   cambios = [cambios]
                  // } 
                  Object.entries(cambios).map((cambio) => {
                    let temp_CotiServicio = [...CotiServicio];
                    let temp_newData = cambio[1]["newData"]
                    let id = temp_newData["tableData"]["id"];
                    
                    temp_CotiServicio[id]["Cantidad"] =
                      temp_newData["Cantidad"];
                    temp_CotiServicio[id]["IGV"] = temp_newData["IGV"];
                    if (temp_CotiServicio[id]["IGV"]) {
                      temp_CotiServicio[id]["PrecioTotal"] =temp_newData["Cantidad"] *temp_newData["PrecioUnitario"] *1.18;
                      temp_CotiServicio[id]["CostoTotal"] =temp_newData["Cantidad"] *temp_newData["CostoUnitario"] *1.18;
                    } else {
                      (temp_CotiServicio[id]["PrecioTotal"] = temp_newData["Cantidad"] * temp_newData["PrecioUnitario"]);
                      temp_CotiServicio[id]["CostoTotal"] =temp_newData["Cantidad"] * temp_newData["CostoUnitario"];
                    }
                    console.log(temp_CotiServicio);
                    setCotiServicio(temp_CotiServicio);
                    resolve();
                  });
                }, 1000);
              }),
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
                field: "IdServicioProducto",
                title: "IdServicioProducto",
                editable: "never",
                hidden: true,
              },
              {
                field: "TipoServicio",
                title: "Tipo de Servicio",
                editable: "never",
              },
              { field: "Nombre", title: "Nombre", editable: "never" },
              { title: "Nombre del Proveedor", field: "NombreProveedor" },
              { title: "Puntaje del Proveedor", field: "PuntajeProveedor" },
              { field: "Descripcion", title: "Descripcion", editable: "never" },
              { field: "Precio", title: "Precio", editable: "never" },
              { field: "Costo", title: "Costo", editable: "never" },
            ]}
            data={props.ListaServiciosProductos}
            actions={[
              {
                icon: "add",
                tooltip: "Añadir Servicio a Cotizacion",
                onClick: (event, rowData) => {
                  let x = [...CotiServicio];
                  x.push({
                    IdServicioProducto: rowData["IdServicioProducto"],
                    CostoUnitario: rowData["Costo"],
                    NombreServicio: rowData["Nombre"],
                    Cantidad: 1,
                    PrecioUnitario: rowData["Precio"],
                    IGV: false,
                    PrecioTotal: rowData["Precio"],
                    CostoTotal: rowData["Costo"],
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

export default TablaProgramaServicio_v2;
