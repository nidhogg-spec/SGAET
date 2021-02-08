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
    DataProductosSeleccionados: [],
    DataProductosTodos: [],
    TipoProveedor: "otro",
    Reiniciar: true,
    columnas: [],
  }
) => {
  // Variables
  let editableacion = {};
  const [ModoEdicion, setModoEdicion] = useState(props.ModoEdicion);
  //Datos obtenidos de servicio en PromasTuristicos
  const [Data, setData] = useState([]);
  const [DataInit, setDataInit] = useState([]);
  //Datos q se guardaran en la cotizacion
  const [DataProductosSeleccionados, setDataProductosSeleccionados] = useState(
    props.DataProductosSeleccionados
  );
  const [
    DataProductosSeleccionadosInit,
    setDataProductosSeleccionadosInit,
  ] = useState(props.DataProductosSeleccionados);
  //Lista de servicios para añadir
  const [DataProductosTodosInit, setDataProductosTodosInit] = useState(props.DataProductosSeleccionados);
  const [DataProductosTodos, setDataProductosTodos] = useState([]);
  //Funciones
  const ActualizacionDatos = () => {};
  //Hooks
  useEffect(async () => {}, []);
  useEffect(() => {
    setDataProductosSeleccionados(props.DataProductosSeleccionados)
    setDataProductosSeleccionadosInit(props.DataProductosSeleccionados)
  }, [props.DataProductosSeleccionados]);
  useEffect(() => {
    if (props.Reiniciar == true) {
      setDataProductosSeleccionados(DataProductosSeleccionadosInit)
    }
  }, [props.Reiniciar]);
  useEffect(() => {
    setModoEdicion(props.ModoEdicion);
  }, [props.ModoEdicion]);
  useEffect(() => {
    if(props.DarDato==true){
      props.DevolverDatoFunct(props.KeyDato,DataProductosSeleccionados)
    }
  }, [props.DarDato]);

  // if (ModoEdicion == true) {
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

      <MaterialTable
        title={props.Title}
        columns={[
          {
            field: "IdProductoServicio",
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
          {
            field: "NombreProducto",
            title: "Nombre del Producto",
            editable: "never",
          },
          {
            field: "DescripcionProducto",
            title: "Descripcion",
            editable: "never",
          },
          { field: "Precio", title: "Precio" },
          { field: "Costo", title: "Costo" },
        ]}
        data={DataProductosSeleccionados}
        editable={{
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...DataProductosSeleccionados];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setDataProductosSeleccionados([...dataDelete]);
                setDataProductosSeleccionadosInit([...dataDelete]);
                resolve();
              }, 1000);
            }),
            onRowUpdate:(newData,oldData)=>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...DataProductosSeleccionados];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setDataProductosSeleccionados([...dataDelete]);

                resolve();
              }, 1000);
            }),
        }}
      />
      <div className={styles.MasServicios}>
        <MaterialTable
          title={"Productos/Servicios para añadir"}
          columns={props.columnas}
          data={props.DataProductosTodos}
          actions={[
            {
              icon: "add",
              tooltip: "Añadir Servicio a Cotizacion",
              onClick: (event, rowData) => {
                let x = [...DataProductosSeleccionados];
                switch (props.TipoProveedor.toLowerCase()) {
                  case "hotel":
                    x.push({
                      //Segun esquema de columnas
                      // IdProductoServicio: rowData["NombreServicio"],
                      IdProductoOriginal: rowData["IdProductoHotel"],
                      NombreProducto: rowData["tipoHabitacion"],
                      DescripcionProducto: rowData["descripcionHabitacion"],
                      Precio: rowData["precioPubli"],
                      Costo: rowData["precioConfi"],
                    });
                    break;
                  case "restaurante":
                    x.push({
                      //Segun esquema de columnas
                      // IdProductoServicio: rowData["NombreServicio"],
                      IdProductoOriginal: rowData["IdProveedor"],
                      NombreProducto: rowData["nombreServicio"],
                      DescripcionProducto: rowData["descripcionServicio"],
                      Precio: rowData["precioDolares"],
                      Costo: null,
                    });
                    break;
                  case "transporteterrestre":
                    x.push({
                      //Segun esquema de columnas
                      // IdProductoServicio: rowData["NombreServicio"],
                      IdProductoOriginal: rowData["IdProductoTransporte"],
                      NombreProducto: rowData["servicio"],
                      DescripcionProducto:
                        rowData["servicio"] +
                        " - " +
                        rowData["tipvehiculo"] +
                        " - " +
                        rowData["horario"],
                      Precio: null,
                      Costo: rowData["PrecioSoles"],
                    });
                    break;
                  case "guia":
                    x.push({
                      //Segun esquema de columnas
                      // IdProductoServicio: rowData["NombreServicio"],
                      IdProductoOriginal: rowData["IdProductoGuia"],
                      NombreProducto: rowData["tipoHabitacion"],
                      DescripcionProducto: rowData["descripcionHabitacion"],
                      Precio: rowData["precioPubli"],
                      Costo: rowData["precioConfi"],
                    });
                    break;
                  case "agencia":
                    x.push({
                      //Segun esquema de columnas
                      // IdProductoServicio: rowData["NombreServicio"],
                      IdProductoOriginal: rowData["IdProductoAgencia"],
                      NombreProducto: rowData["servicio"],
                      DescripcionProducto:
                        rowData["codServicio"] +
                        " - " +
                        rowData["duracion"] +
                        " horas - " +
                        rowData["observacion"],
                      Precio: rowData["precioPubli"],
                      Costo: rowData["precioConfi"],
                    });
                    break;
                  case "transporteferroviario":
                    x.push({
                      //Segun esquema de columnas
                      // IdProductoServicio: rowData["NombreServicio"],
                      IdProductoOriginal: rowData["IdProductoTransFerroviario"],
                      NombreProducto:
                        rowData["ruta"] + " - " + rowData["horario"],
                      DescripcionProducto:
                        rowData["ruta"] +
                        " - " +
                        rowData["horario"] +
                        " - " +
                        rowData["tipoTren"],
                      Precio: null,
                      Costo: rowData["precioAdulto"],
                    });
                    break;
                  case "otro":
                    x.push({
                      //Segun esquema de columnas
                      // IdProductoServicio: rowData["NombreServicio"],
                      IdProductoOriginal: rowData["IdProductoOtro"],
                      NombreProducto: rowData["servicio"],
                      DescripcionProducto: rowData["codServicio"],
                      Precio: rowData["precioPubli"],
                      Costo: rowData["precioConfi"],
                    });
                    break;
                }
                setDataProductosSeleccionados(x);
                
                let ActuDataProductosTodos = [...DataProductosTodos];
                ActuDataProductosTodos.splice(
                  ActuDataProductosTodos.findIndex((value) => {
                    return value["IdServicio"] == rowData["IdServicio"];
                  }),
                  1
                );
                setDataProductosTodos(ActuDataProductosTodos);
              },
            },
          ]}
        />
      </div>
    </div>
  );
  // } else {
  //   return (
  //     <div className={styles.divMadre}>
  //       <MaterialTable
  //         title={props.Title}
  //         columns={props.columnas}
  //         data={Data}
  //       />
  //     </div>
  //   );
  // }
};

export default TablaProductoServicio;
