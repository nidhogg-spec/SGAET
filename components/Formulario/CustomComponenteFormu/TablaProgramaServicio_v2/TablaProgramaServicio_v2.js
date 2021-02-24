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
  // -------------------------------Variables---------------------------------
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
  // PAra el calculo de totales
  const [CurrencyTotal, setCurrencyTotal] = useState("Dolar");
  const [MontoTotal, setMontoTotal] = useState(0);
  // const [CambioDolar, setCambioDolar] = useState(window.sessionStorage.getItem('CambioDolar') || 0);
  const [CambioDolar, setCambioDolar] = useState(0);

  //---------------------------------------------------------------------------------

  //------------------------------------Hooks-----------------------------------------
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
      props.DevolverDatoFunct(props.KeyDato, CotiServicio);
    }
  }, [props.DarDato]);
  useEffect(() => {
    let temp_MontoTotal = 0;
    switch (CurrencyTotal) {
      case "Dolar":
        CotiServicio.map((uni_CotiServi) => {
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
        CotiServicio.map((uni_CotiServi) => {
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
    setMontoTotal(temp_MontoTotal);
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

  //---------------------------------------------------------------------------------

  if (ModoEdicion == true) {
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
                field: "Dia",
                title: "Numero de dia",
                editable: "always",
                type: "numeric",
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
                    Object.entries(cambios).map((cambio) => {
                      let temp_CotiServicio = [...CotiServicio];
                      let temp_newData = cambio[1]["newData"];
                      let id = temp_newData["tableData"]["id"];

                      temp_CotiServicio[id]["Cantidad"] =
                        temp_newData["Cantidad"];
                      temp_CotiServicio[id]["Dia"] =
                        temp_newData["Dia"];
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
                    Dia: 1,
                    Cantidad: 1,
                    PrecioCotiUnitario: rowData["Precio"],
                    IGV: false,
                    PrecioCotiTotal: rowData["Precio"],
                    PrecioConfiTotal: rowData["Costo"],
                    Currency: rowData["Currency"],
                    PrecioPublicado: rowData["PrecioPublicado"],
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
              field: "Dia",
              title: "Numero de dia",
              editable: "always",
              type: "numeric",
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
        />
      </div>
    );
  }
};

export default TablaProgramaServicio_v2;
