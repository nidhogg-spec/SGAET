//Package
import styles from "./TablaServicioCotizacion.module.css";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import deepEqual from "fast-deep-equal";
//Componentes
import MaterialTable from "material-table";
const TablaServicioCotizacion = (
  props = {
    Title: "Nombre del Proveedor",
    Dato: [],
    setDato:()=>{},
    ListaServiciosProductos: [],
    Reiniciar: true,
    FechaIN,
  }
) => {
  // -------------------------------Variables---------------------------------
  //Datos q se guardaran en la cotizacion
  const [CotiServicio, setCotiServicio] = useState([]);
  const [CurrencyTotal, setCurrencyTotal] = useState("Dolar");
  const [MontoTotal, setMontoTotal] = useState(0);
  const [CambioDolar, setCambioDolar] = useState(0);
  const NotAgain = useRef(true);

  //------------------------------------Hooks-----------------------------------------
  useEffect(() => {
    if(props.Dato!= undefined)
      if (!deepEqual(CotiServicio,props.Dato)) {
        props.setDato(CotiServicio);
      }
  }, [CotiServicio]);
  useEffect(() => {
    if(props.Dato!= undefined)
      if (!deepEqual(CotiServicio,props.Dato)) {
        setCotiServicio(props.Dato)
      }
  }, [props.Dato]);

  useLayoutEffect(() => {
    if (NotAgain.current) {
      NotAgain.current = false;
      return;
    }

    let temp_MontoTotal = 0;

    switch (CurrencyTotal) {
      case "Dolar":
        props.Dato.map((uni_CotiServi) => {
          switch (uni_CotiServi["Currency"] || "Dolar") {
            case "Dolar":
              temp_MontoTotal += parseFloat(uni_CotiServi["PrecioCotiTotal"]);
              break;
            case "Sol":
              temp_MontoTotal +=
                parseFloat(uni_CotiServi["PrecioCotiTotal"]) / CambioDolar;
              break;
          }
        });
        break;
      case "Sol":
        props.Dato.map((uni_CotiServi) => {
          switch (uni_CotiServi["Currency"]) {
            case "Dolar":
              temp_MontoTotal +=
                parseFloat(uni_CotiServi["PrecioCotiTotal"]) * CambioDolar;
              break;
            case "Sol":
              temp_MontoTotal += parseFloat(uni_CotiServi["PrecioCotiTotal"]);
              break;
          }
        });
        break;
    }
    NotAgain.current = true;
    setMontoTotal(temp_MontoTotal);
    Actulizar_fechas();
  }, [CotiServicio, CurrencyTotal]);

  useEffect(() => {
    let CambioDolar_temp = sessionStorage.getItem("CambioDolar");
    if (CambioDolar_temp) {
      setCambioDolar(CambioDolar_temp);
    } else {
      fetch("/api/DataSistema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "ObtenerCambioDolar",
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          setCambioDolar(data.value);
          sessionStorage.setItem("CambioDolar", data.value);
        });
    }
  }, []);
  useEffect(() => {
    Actulizar_fechas();
  }, [props.FechaIN]);
  const Actulizar_fechas = () => {
    const fecha_inicio = new Date(props.FechaIN);
    let temp_CotiServicio = [...CotiServicio];
    temp_CotiServicio.map((item) => {
      let temp_date = new Date(fecha_inicio);
      let dt;
      if (item["Dia"]) {
        dt = temp_date.getDate() + parseInt(item["Dia"]);
        // temp_date.setDate(dt);
        // item["FechaReserva"] = temp_date.toISOString().slice(0, 10);
      } else {
        dt = temp_date.getDate() + 1;
      }
      temp_date.setDate(dt);
      let year = temp_date.getFullYear();
      let month = temp_date.getMonth() + 1;
      let day = temp_date.getDate();

      if (day < 10) {
        day = "0" + day;
      }
      if (month < 10) {
        month = "0" + month;
      }
      item["FechaReserva"] = year + "-" + month + "-" + dt;
      console.log(item["FechaReserva"]);
      setCotiServicio(temp_CotiServicio);
      // item['FechaReserva']= item['FechaReserva'].toString()
    });
  };
  //---------------------------------------------------------------------------------
  // console.log("mas pruebas")
  // console.log(CotiServicio)
  return (
    <div>
      <span>{props.Title}</span>
      <div>
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
              field: "PrecioConfiUnitario",
              title: "Precio Confidencial Unitario",
              editable: "never",
              type: "numeric",
              hidden: true,
            },
            { field: "NombreServicio", title: "Nombre", editable: "never" },
            {
              field: "TipoServicio",
              title: "Tipo del Servicio",
              editable: "never",
            },
            { field: "Dia", title: "Dia", editable: "always", type: "numeric" },
            {
              field: "FechaReserva",
              title: "Fecha de Reserva",
              editable: "never",
              type: "date",
            },
            {
              field: "Cantidad",
              title: "Cantidad",
              editable: "always",
              type: "numeric",
            },
            {
              field: "Currency",
              title: "Moneda",
              editable: "never",
              lookup: { Dolar: "Dolares", Sol: "Nuevos Soles" },
            },
            {
              field: "PrecioCotiUnitario",
              title: "Precio Cotizacion Unitario",
              editable: "always",
              type: "numeric",
            },
            {
              field: "PrecioPublicado",
              title: "Precio Publicado",
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
              field: "PrecioCotiTotal",
              title: "Precio Cotizacion Total",
              editable: "never",
              type: "numeric",
            },
            {
              field: "PrecioConfiTotal",
              title: "Precio Confidencial Total",
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
                  let temp_CotiServicio = [...CotiServicio];
                  Object.entries(cambios).map((cambio) => {
                    let temp_newData = cambio[1]["newData"];
                    let id = temp_newData["tableData"]["id"];

                    temp_CotiServicio[id]["Cantidad"] =
                      temp_newData["Cantidad"];
                    temp_CotiServicio[id]["IGV"] = temp_newData["IGV"];
                    if (temp_CotiServicio[id]["IGV"]) {
                      temp_CotiServicio[id]["PrecioCotiTotal"] = (
                        temp_newData["Cantidad"] *
                        temp_newData["PrecioCotiUnitario"] *
                        1.18
                      ).toFixed(2);
                      temp_CotiServicio[id]["PrecioConfiTotal"] = (
                        temp_newData["Cantidad"] *
                        temp_newData["PrecioConfiUnitario"] *
                        1.18
                      ).toFixed(2);
                    } else {
                      temp_CotiServicio[id]["PrecioCotiTotal"] = (
                        temp_newData["Cantidad"] *
                        temp_newData["PrecioCotiUnitario"]
                      ).toFixed(2);
                      temp_CotiServicio[id]["PrecioConfiTotal"] = (
                        temp_newData["Cantidad"] *
                        temp_newData["PrecioConfiUnitario"]
                      ).toFixed(2);
                    }
                    temp_CotiServicio[id]["PrecioCotiUnitario"] =
                      temp_newData["PrecioCotiUnitario"];
                    temp_CotiServicio[id]["Dia"] = temp_newData["Dia"];
                  });
                  setCotiServicio(temp_CotiServicio);
                  resolve();
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
        <select
          onChange={(event) => {
            setCurrencyTotal(event.target.value);
          }}
        >
          <option value="Dolar" selected>
            Dolares
          </option>
          <option value="Sol">Soles</option>
        </select>
        <span>
          El precio total es: {CurrencyTotal == "Dolar" ? "$" : "S/."}
          {MontoTotal.toFixed(2)}
        </span>
      </div>
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
            {
              field: "Currency",
              title: "Moneda",
              editable: "never",
              lookup: { Dolar: "Dolares", Sol: "Nuevos Soles" },
            },
            {
              field: "Precio",
              title: "Precio Cotizacion",
              editable: "never",
              type: "numeric",
            },
            {
              field: "Costo",
              title: "Precio Confidencial",
              editable: "never",
              type: "numeric",
            },
            {
              field: "PrecioPublicado",
              title: "Precio Publicado",
              editable: "never",
              type: "numeric",
            },
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
                  TipoServicio:rowData['TipoServicio'],
                  PrecioConfiUnitario: rowData["Costo"],
                  NombreServicio: rowData["Nombre"],
                  TipoServicio: rowData["TipoServicio"],
                  Dia: 1,
                  Cantidad: 1,
                  PrecioCotiUnitario: rowData["Precio"],
                  IGV: false,
                  PrecioCotiTotal: rowData["Precio"],
                  PrecioConfiTotal: rowData["Costo"],
                  Currency: rowData["Currency"],
                  PrecioPublicado: rowData["PrecioPublicado"],
                  IdProveedor: rowData["IdProveedor"],
                });
                setCotiServicio(x);
                // let ActuDataTableServicios = [...DataTableServicios];
                // ActuDataTableServicios.splice(
                //   ActuDataTableServicios.findIndex((value) => {
                //     return value["IdServicio"] == rowData["IdServicio"];
                //   }),
                //   1
                // );
                // setDataTableServicios(ActuDataTableServicios);
              },
            },
          ]}
        />
      </div>
    </div>
  );
};

export default TablaServicioCotizacion;
