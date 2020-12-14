//Package
import styles from "./TablaProductoServicio.module.css";
import React, { useEffect, useState } from "react";

//Componentes
import MaterialTable from "material-table";

const TablaProductoServicio = (
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
    
  }, []);
  useEffect(() => {
    
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
    
  }, [props.DarDato]);

  if (ModoEdicion == true) {
    /* Esquema de datos de los productos de un servicio
      - IdProductoServicio
      - IdProductoOriginal
      - NombreProducto
      - DescripcionProducto
      - Precio
      - Costo
    */
    return (
      <div>
        <h1>{props.Title}</h1>
        <button>Añadir</button>
        
        <MaterialTable
          title={props.Title}
          columns={[
            {
              field: "Id",
              title: "IdProductoServicio",
              editable: "never",
              hidden: true,
            },
            {
              field: "IdProductoOriginal",
              title: "IdProductoOriginal",
              editable: "never",
              hidden: true,
            },
            { field: "NombreProducto", title: "Nombre del Producto", editable: "never" },
            { field: "DescripcionProducto", title: "Descripcion", editable: "never" },
            { field: "Precio", title: "Precio"},
            { field: "Costo", title: "Costo"},
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

export default TablaProductoServicio;
