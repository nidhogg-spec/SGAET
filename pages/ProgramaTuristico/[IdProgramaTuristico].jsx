import React, { useState, useEffect,useRef } from "react";
import styles from "./DetalleProgramaTuristico.module.css";
import AutoFormulario from "@/components/Formulario_V2/AutoFormulario/AutoFormulario";
import { MongoClient } from "mongodb";
import axios from "axios";
import { useRouter } from "next/router";
import TablaProgramaServicio_v2 from "@/components/Formulario/CustomComponenteFormu/TablaProgramaServicio_v2/TablaProgramaServicio_v2";
import MaterialTable from "material-table";
import { resetServerContext } from "react-beautiful-dnd";
resetServerContext();

const DetalleProgramaTuristico = (
  props = {
    ProgramaTuristico,
    APIpath,
    ListaServiciosProductos,
  }
) => {
  const router = useRouter();
  const {IdProgramaTuristico}=router.query
  const [ProgramaTuristico, setProgramaTuristico] = useState(
    props.ProgramaTuristico
  );
  const [ModoEdicion, setModoEdicion] = useState(false);
  const [ServicioProducto, setServicioProducto] = useState(props.ProgramaTuristico['ServicioProducto']);

  return (
    <div className={styles.ContainerPrincipal}>
      <h1 className="Titulo">{ProgramaTuristico['NombrePrograma']}</h1>
      <div className="Acciones">
        {ModoEdicion ? (
          <>
          <button>
            <img
              src="/resources/save-black-18dp.svg"
              onClick={() => {
                async function Actualizar() {
                  let temp_ProgramaTuristico = {...ProgramaTuristico,ServicioProducto:ServicioProducto}
                  let result = await axios.put(props.APIpath + '/api/ProgramaTuristico/CRUD',{
                    IdProgramaTuristico: IdProgramaTuristico,
                    ProgramaTuristico: temp_ProgramaTuristico
                  })
                  console.log(result)
                  alert('Actualizacion realizada')
                }
                Actualizar()
              }}
            />
          </button>
            <button>
              <img
                src="/resources/close-black-18dp.svg"
                onClick={(event) => {
                  setModoEdicion(false)
                  }
                }
              />
            </button>
          </>
        ) : (
          <>
          <button>
              <img
                src="/resources/edit-black-18dp.svg"
                onClick={(event) => {
                  setModoEdicion(true)
                  }
                }
              />
            </button>
          </>
        )}
      </div>
      <AutoFormulario
        Formulario={{
          title: "Detalle de Programa Turistico",
          secciones: [
            {
              subTitle: "",
              componentes: [
                {
                  tipo: "texto",
                  Title: "Nombre",
                  KeyDato: "NombrePrograma",
                },
                {
                  tipo: "texto",
                  Title: "Condigo",
                  KeyDato: "CodigoPrograma",
                },
                {
                  tipo: "texto",
                  Title: "Tipo de experiencia",
                  KeyDato: "Tipo",
                },
                {
                  tipo: "texto",
                  Title: "Duracion Dias",
                  KeyDato: "DuracionDias",
                },
                {
                  tipo: "texto",
                  Title: "Duracion Noches",
                  KeyDato: "DuracionNoche",
                },
                {
                  tipo: "money",
                  Title: "Precio estandar",
                  KeyDato: "PrecioEstandar",
                },
                {
                  tipo: "texto",
                  Title: "Localizacion",
                  KeyDato: "Localizacion",
                },
              ],
            },
            {
              subTitle: "Descripcion",
              componentes: [
                {
                  tipo: "granTexto",
                  Title: "",
                  KeyDato: "Descripcion",
                },
              ],
            },
          ],
        }}
        ModoEdicion={ModoEdicion}
        Dato={ProgramaTuristico}
        setDato={setProgramaTuristico}
      />
      <h2>Servicios/Productos</h2>
      <TablaServicioCotizacion
        CotiServicio={ServicioProducto}
        ListaServiciosProductos={props.ListaServiciosProductos}
        Title={''}
        setCotiServicio={setServicioProducto}
      />
      <AutoFormulario
        Formulario={{
          title: "Detalle de Programa Turistico",
          secciones: [
            {
              subTitle: "Descripcion de Itinerario",
              componentes: [
                {
                  tipo: "granTexto",
                  Title: "",
                  KeyDato: "ItinerarioDescripcion",
                },
              ],
            },
            {
              subTitle: "",
              componentes: [
                {
                  tipo: "tablaSimple",
                  Title: "Itinerario",
                  KeyDato: "Itinerario",
                  columnas: [
                    {
                      field: "Dia",
                      title: "Dia",
                      initialEditValue: 1,
                      type: "numeric",
                    },
                    {
                      field: "Hora Inicio",
                      title: "Hora de Inicio",
                      initialEditValue: "00:00",
                    },
                    {
                      field: "Hora Fin",
                      title: "Hora de Fin",
                      initialEditValue: "00:00",
                    },
                    { field: "Actividad", title: "Actividad" },
                  ],
                },
                {
                  tipo: "tablaSimple",
                  Title: "Incluye",
                  KeyDato: "Incluye",
                  columnas: [{ field: "Actividad", title: "Actividad" }],
                },
                {
                  tipo: "tablaSimple",
                  Title: "No Incluye",
                  KeyDato: "NoIncluye",
                  columnas: [{ field: "Actividad", title: "Actividad" }],
                },
                {
                  tipo: "tablaSimple",
                  Title: "Recomendaciones para llevar",
                  KeyDato: "RecomendacionesLlevar",
                  columnas: [
                    { field: "Recomendacion", title: "Recomendacion" },
                  ],
                },
              ],
            },
          ],
        }}
        ModoEdicion={ModoEdicion}
        Dato={ProgramaTuristico}
        setDato={setProgramaTuristico}
      />
    </div>
  );
};

export async function getServerSideProps({ query, req, res }) {
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  const IdProgramaTuristico = query.IdProgramaTuristico;
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const dbo = client.db(dbName);
  // Optencion de datos de programa tursitico
  let ProgramaTuristico;
  try {
    ProgramaTuristico = await dbo
      .collection("ProgramaTuristico")
      .findOne(
        { IdProgramaTuristico: IdProgramaTuristico },
        { projection: { _id: 0 } }
      );
  } catch (error) {
    res.writeHead(302, { Location: "/404" });
    res.end();
  }

  //------------------------------------- obtencion de datos de probedores -----------------------------

  let ListaServiciosProductos = [];
  let resultProveedores;

  try {
    let collection = dbo.collection("Proveedor");
    resultProveedores = await collection
      .find({})
      .project({
        _id: 0,
        nombre: 1,
        tipo: 1,
        IdProveedor: 1,
        porcentajeTotal: 1,
        TipoMoneda: 1,
      })
      .toArray();
  } catch (error) {
    console.log("error - Obtener cambios dolar => " + error);
  }
  try {
    let DATA = await Promise.all([
      // Hotel
      new Promise(async (resolve, reject) => {
        let collection = dbo.collection("ProductoHoteles");
        let result = await collection
          .find({})
          .project({
            _id: 0,
          })
          .toArray();
        let ListaServiciosProductos = [];
        result.map((x) => {
          let proveedor = resultProveedores.find((value) => {
            return value["IdProveedor"] == x["IdProveedor"];
          });
          if (proveedor == undefined) {
            console.log("Proveedor eliminado - " + x["IdProveedor"]);
          } else {
            ListaServiciosProductos.push({
              IdServicioProducto: x["IdProductoHotel"] || null,
              IdProveedor: x["IdProveedor"] || null,
              TipoServicio: "Hotel" || null,
              Nombre: x["TipoPaxs"] + " - " + x["tipoHabitacion"] || null,
              Descripcion:
                "Cama Adicional: " +
                  (x["camAdic"] ? "si" : "no") +
                  " - Descripcion: " +
                  x["descripcionHabitacion"] || null,
              Precio: x["precioCoti"] || 0.0,
              Costo: x["precioConfi"] || 0.0,
              NombreProveedor: proveedor["nombre"],
              PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
              Currency: proveedor["TipoMoneda"] || null,
              PrecioPublicado: x["precioPubli"] || null,
              OrdenServicio: null,
            });
          }
        });
        resolve(ListaServiciosProductos);
      }),
      // Restaurantes
      new Promise(async (resolve, reject) => {
        let collection = dbo.collection("ProductoRestaurantes");
        let result = await collection
          .find({})
          .project({
            _id: 0,
          })
          .toArray();
        let ListaServiciosProductos = [];
        result.map((x) => {
          let proveedor = resultProveedores.find((value) => {
            return value["IdProveedor"] == x["IdProveedor"];
          });
          if (proveedor == undefined) {
            console.log("Proveedor eliminado - " + x["IdProveedor"]);
            //   proveedor={};
            //   proveedor['nombre']=null;
            //   proveedor["porcentajeTotal"]=0;
            //   proveedor["TipoMoneda"]="Dolar";
          } else {
            ListaServiciosProductos.push({
              IdServicioProducto: x["IdProductoRestaurante"] || null,
              IdProveedor: x["IdProveedor"] || null,
              TipoServicio: "Restaurante" || null,
              Nombre:
                x["codServicio"] +
                  " - " +
                  x["servicio"] +
                  " - " +
                  x["TipoPaxs"] || null,
              Descripcion: "Caracteristicas: " + x["caracte"] || null,
              Precio: x["precioCoti"] || 0.0,
              Costo: x["precioConfi"] || 0.0,
              NombreProveedor: proveedor["nombre"],
              PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
              Currency: proveedor["TipoMoneda"] || null,
              PrecioPublicado: x["precioPubli"] || null,
              OrdenServicio: {
                TipoOrden: "D",
                Estado: 0,
              },
            });
          }
        });
        resolve(ListaServiciosProductos);
      }),
      // Transporte Terrestre
      new Promise(async (resolve, reject) => {
        let collection = dbo.collection("ProductoTransportes");
        let result = await collection
          .find({})
          .project({
            _id: 0,
          })
          .toArray();
        let ListaServiciosProductos = [];
        result.map((x) => {
          let proveedor = resultProveedores.find((value) => {
            return value["IdProveedor"] == x["IdProveedor"];
          });
          if (proveedor == undefined) {
            console.log("Proveedor eliminado - " + x["IdProveedor"]);
            //   proveedor={};
            //   proveedor['nombre']=null;
            //   proveedor["porcentajeTotal"]=0;
            //   proveedor["TipoMoneda"]="Dolar";
          } else {
            ListaServiciosProductos.push({
              IdServicioProducto: x["IdProductoTransporte"] || null,
              IdProveedor: x["IdProveedor"] || null,
              TipoServicio: "Transporte Terrestre" || null,
              Nombre:
                x["codServicio"] +
                  " / " +
                  // x["EtapaPaxs"] +
                  // " / " +
                  x["TipoPaxs"] +
                  " / " +
                  x["servicio"] +
                  " / Horario:" +
                  x["horario"] || null,
              Descripcion: "Tipo de Vehiculo: " + x["tipvehiculo"] || null,
              Precio: x["precioCoti"] || 0.0,
              Costo: x["precioConfi"] || 0.0,
              NombreProveedor: proveedor["nombre"],
              PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
              Currency: proveedor["TipoMoneda"] || null,
              PrecioPublicado: x["precioPubli"] || null,
              OrdenServicio: {
                TipoOrden: "C",
                Estado: 0,
              },
            });
          }
        });
        resolve(ListaServiciosProductos);
      }),
      // Guia
      new Promise(async (resolve, reject) => {
        let collection = dbo.collection("ProductoGuias");
        let result = await collection
          .find({})
          .project({
            _id: 0,
          })
          .toArray();
        let ListaServiciosProductos = [];
        result.map((x) => {
          let proveedor = resultProveedores.find((value) => {
            return value["IdProveedor"] == x["IdProveedor"];
          });
          if (proveedor == undefined) {
            console.log("Proveedor eliminado - " + x["IdProveedor"]);
            //   proveedor={};
            //   proveedor['nombre']=null;
            //   proveedor["porcentajeTotal"]=0;
            //   proveedor["TipoMoneda"]="Dolar";
          } else {
            ListaServiciosProductos.push({
              IdServicioProducto: x["IdProductoGuia"] || null,
              IdProveedor: x["IdProveedor"] || null,
              TipoServicio: "Guia" || null,
              Nombre:
                x["codServicio"] +
                  " - " +
                  x["TipoPaxs"] +
                  " - " +
                  x["gremio"] || null,
              Descripcion:
                "N° Carne: " +
                  x["carne"] +
                  "; Idioma: " +
                  x["idiomas"] +
                  "; DNI: " +
                  x["dni"] || null,
              Precio: x["precioCoti"] || 0.0,
              Costo: x["precioConfi"] || 0.0,
              NombreProveedor: proveedor["nombre"],
              PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
              Currency: proveedor["TipoMoneda"] || null,
              PrecioPublicado: x["precioPubli"] || null,
              OrdenServicio: null,
            });
          }
        });
        resolve(ListaServiciosProductos);
      }),
      // Agencia
      new Promise(async (resolve, reject) => {
        let collection = dbo.collection("ProductoAgencias");
        let result = await collection
          .find({})
          .project({
            _id: 0,
          })
          .toArray();
        let ListaServiciosProductos = [];
        result.map((x) => {
          let proveedor = resultProveedores.find((value) => {
            return value["IdProveedor"] == x["IdProveedor"];
          });
          if (proveedor == undefined) {
            console.log("Proveedor eliminado - " + x["IdProveedor"]);
            //   proveedor={};
            //   proveedor['nombre']=null;
            //   proveedor["porcentajeTotal"]=0;
            //   proveedor["TipoMoneda"]="Dolar";
          } else {
            ListaServiciosProductos.push({
              IdServicioProducto: x["IdProductoHotel"] || null,
              IdProveedor: x["IdProveedor"] || null,
              TipoServicio: "Agencia" || null,
              Nombre:
                x["codServicio"] +
                  " - " +
                  x["TipoPaxs"] +
                  " - " +
                  x["servicio"] || null,
              Descripcion: "Duracion: " + x["duracion"] || null,
              Precio: x["precioCoti"] || 0.0,
              Costo: x["precioConfi"] || 0.0,
              NombreProveedor: proveedor["nombre"],
              PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
              Currency: proveedor["TipoMoneda"] || null,
              PrecioPublicado: x["precioPubli"] || null,
              OrdenServicio: null,
            });
          }
        });
        resolve(ListaServiciosProductos);
      }),
      // Transporte Ferroviario
      new Promise(async (resolve, reject) => {
        let collection = dbo.collection("ProductoTransFerroviario");
        let result = await collection
          .find({})
          .project({
            _id: 0,
          })
          .toArray();
        let ListaServiciosProductos = [];
        result.map((x) => {
          let proveedor = resultProveedores.find((value) => {
            return value["IdProveedor"] == x["IdProveedor"];
          });
          if (proveedor == undefined) {
            console.log("Proveedor eliminado - " + x["IdProveedor"]);
            //   proveedor={};
            //   proveedor['nombre']=null;
            //   proveedor["porcentajeTotal"]=0;
            //   proveedor["TipoMoneda"]="Dolar";
          } else {
            ListaServiciosProductos.push({
              IdServicioProducto: x["IdProductoTransFerroviario"] || null,
              IdProveedor: x["IdProveedor"] || null,
              TipoServicio: "Transporte Ferroviario" || null,
              Nombre:
                x["TipoPaxs"] +
                  " / " +
                  x["EtapaPaxs"] +
                  " / " +
                  x["ruta"] +
                  "/ Horario:" +
                  x["salida"] +
                  "-" +
                  x["llegada"] || null,
              Descripcion: "Tipo de tren: " + x["tipoTren"] || null,
              Precio: x["precioCoti"] || 0.0,
              Costo: x["precioConfi"] || 0.0,
              NombreProveedor: proveedor["nombre"],
              PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
              Currency: proveedor["TipoMoneda"] || null,
              PrecioPublicado: x["precioPubli"] || null,
              OrdenServicio: null,
            });
          }
        });
        resolve(ListaServiciosProductos);
      }),
      // Sitio Turistico
      new Promise(async (resolve, reject) => {
        let collection = dbo.collection("ProductoSitioTuristico");
        let result = await collection
          .find({})
          .project({
            _id: 0,
          })
          .toArray();
        let ListaServiciosProductos = [];
        result.map((x) => {
          let proveedor = resultProveedores.find((value) => {
            return value["IdProveedor"] == x["IdProveedor"];
          });
          if (proveedor == undefined) {
            console.log("Proveedor eliminado - " + x["IdProveedor"]);
            //   proveedor={};
            //   proveedor['nombre']=null;
            //   proveedor["porcentajeTotal"]=0;
            //   proveedor["TipoMoneda"]="Dolar";
          } else {
            ListaServiciosProductos.push({
              IdServicioProducto: x["IdProductoSitioTuristico"] || null,
              IdProveedor: x["IdProveedor"] || null,
              TipoServicio: "Sitio Turistico" || null,
              Nombre: x["NomServicio"] + " - " + x["Categoria"] || null,
              Descripcion: x["HoraAtencion"] || null,
              Precio: x["precioCoti"] || 0.0,
              Costo: x["precioConfi"] || 0.0,
              NombreProveedor: proveedor["nombre"],
              PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
              Currency: proveedor["TipoMoneda"] || null,
              PrecioPublicado: x["precioPubli"] || null,
              OrdenServicio: null,
            });
          }
        });
        resolve(ListaServiciosProductos);
      }),
      // Otro
      new Promise(async (resolve, reject) => {
        let collection = dbo.collection("ProductoOtros");
        let result = await collection
          .find({})
          .project({
            _id: 0,
          })
          .toArray();
        let ListaServiciosProductos = [];
        result.map((x) => {
          let proveedor = resultProveedores.find((value) => {
            return value["IdProveedor"] == x["IdProveedor"];
          });
          if (proveedor == undefined) {
            console.log("Proveedor eliminado - " + x["IdProveedor"]);
            //   proveedor={};
            //   proveedor['nombre']=null;
            //   proveedor["porcentajeTotal"]=0;
            //   proveedor["TipoMoneda"]="Dolar";
          } else {
            ListaServiciosProductos.push({
              IdServicioProducto: x["IdProductoOtro"] || null,
              IdProveedor: x["IdProveedor"] || null,
              TipoServicio: "Otro" || null,
              Nombre:
                x["codServicio"] +
                  " - " +
                  x["TipoPaxs"] +
                  " - " +
                  x["servicio"] || null,
              Descripcion: x["Descripcion"] || null,
              Precio: x["precioCoti"] || 0.0,
              Costo: x["precioConfi"] || 0.0,
              NombreProveedor: proveedor["nombre"],
              PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
              Currency: proveedor["TipoMoneda"] || null,
              PrecioPublicado: x["precioPubli"] || null,
              OrdenServicio: null,
            });
          }
        });
        resolve(ListaServiciosProductos);
      }),
    ]);
    // Transformar todo a un solo array de objetos
    DATA.map((d) => {
      d.map((obj) => {
        ListaServiciosProductos.push(obj);
      });
    });
  } catch (error) {
    console.log(error);
  }
  //---------------------------------------------------------------------
  try {
    client.close();
  } catch (error) {
    console.log("Error al cerrar cliente -> " + error);
  }

  return {
    props: {
      ProgramaTuristico: ProgramaTuristico,
      APIpath: process.env.API_DOMAIN,
      ListaServiciosProductos: ListaServiciosProductos,
    },
  };
}
const TablaServicioCotizacion = (
  props = {
    Title: "Nombre del Proveedor",
    setCotiServicio: () => {},
    CotiServicio: [],
    ListaServiciosProductos: [],
  }
) => {
  // -------------------------------Variables---------------------------------
  const router = useRouter();
  //Datos q se guardaran en la cotizacion
  // const [CotiServicio, setCotiServicio] = useState([]);
  const [CurrencyTotal, setCurrencyTotal] = useState("Dolar");
  const [MontoTotal, setMontoTotal] = useState(0);
  const [CambioDolar, setCambioDolar] = useState(0);
  const NotAgain = useRef(true);

  //---------------------------------------------------------------------------------

  //------------------------------------Hooks-----------------------------------------
  useEffect(() => {
    if (NotAgain.current) {
      NotAgain.current = false;
      return;
    }
    let temp_MontoTotal = 0;
    if (props.CotiServicio != undefined) {
      switch (CurrencyTotal) {
        case "Dolar":
          props.CotiServicio.map((uni_CotiServi) => {
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
          props.CotiServicio.map((uni_CotiServi) => {
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
    }
    NotAgain.current = true;
    setMontoTotal(temp_MontoTotal);
  }, [props.CotiServicio, CurrencyTotal]);
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
              title: "Dia",
              editable: "never",
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
          data={props.CotiServicio}
          editable={{
            onBulkUpdate: (cambios) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  // if (typeof(cambios) === 'object') {
                  //   cambios = [cambios]
                  // }
                  Object.entries(cambios).map((cambio) => {
                    let temp_CotiServicio = [...props.CotiServicio];
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
                    props.setCotiServicio(temp_CotiServicio);
                    resolve();
                  });
                }, 1000);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...props.CotiServicio];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  props.setCotiServicio([...dataDelete]);
                  resolve();
                }, 1000);
              }),
          }}
          actions={[
            {
              icon: () => {
                return <img src="/resources/remove_red_eye-24px.svg" />;
              },
              tooltip: "Mostrar reserva",
              onClick: (event, rowData) => {
                router.push(`/reservas/servicio/${rowData.IdServicioEscogido}`);
              },
            },
          ]}
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
      <div>
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
                let x = [...props.CotiServicio];
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
                props.setCotiServicio(x);
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

export default DetalleProgramaTuristico;
