//packege
// import fetch from "isomorphic-unfetch";
import router from "next/router";
import React, { useEffect, useState, createContext, useRef } from "react";
// import {Data_ProgramasTuristicos} from '../../query/query'
import { resetServerContext } from "react-beautiful-dnd";

//Seguidad para routing Backend si no esta logueado
import { withSSRContext } from 'aws-amplify'

//css
import CustomStyles from "@/globalStyles/ProgramasTuristicos.module.css";

//modulos
import MaterialTable from "material-table";
import Tabla from "../../components/TablaModal/Tabla";
import AutoModal_v2 from "@/components/AutoModal_v2/AutoModal_v2";
import FusionProgramas from "@/components/ComponentesUnicos/ProgramaTuristico/FusionProgramas/FusionProgramas";
import Loader from "@/components/Loading/Loading";
import axios from "axios";
import { route } from "next/dist/next-server/server/router";
import { db_connect } from "@/src/db";

resetServerContext();
function ProgramasTuristicos({
  Columnas,
  Datos,
  APIpath,
  APIpathGeneral,
  ListaServiciosProductos,
  API_DOMAIN
}) {
  //--------------- Acciones para que funcione el AutoMdoal --------------
  //--------------------------------------------------------------------
  const [Display, setDisplay] = useState(false);
  const [ModalData, setModalData] = useState({});
  const ModalDisplay = createContext([
    [{}, () => {}],
    [{}, () => {}],
    [{}, () => {}]
  ]);

  const firstUpdate = useRef(true);

  const DevolverEstructuraFormulario = (FormuData = {}) => {
    return {
      id: FormuData.Id,
      title: "Programas turisticos",
      secciones: [
        {
          subTitle: "Datos del Programas turisticos",
          componentes: [
            {
              tipo: "texto",
              Title: "Nombre",
              KeyDato: "NombrePrograma",
              Dato: FormuData.NombrePrograma
            },
            {
              tipo: "texto",
              Title: "Codigo",
              KeyDato: "CodigoPrograma",
              Dato: FormuData.CodigoPrograma
            },
            {
              tipo: "texto",
              Title: "Tipo de experiencia",
              KeyDato: "Tipo",
              Dato: FormuData.CodigoPrograma
            },
            {
              tipo: "numero",
              Title: "Duracion Dias",
              KeyDato: "DuracionDias",
              Dato: FormuData.DuracionDias,
              InputStep: "1"
            },
            {
              tipo: "numero",
              Title: "Duracion Noches",
              KeyDato: "DuracionNoche",
              Dato: FormuData.DuracionNoche,
              InputStep: "1"
            },
            {
              tipo: "texto",
              Title: "Localizacion",
              KeyDato: "Localizacion",
              Dato: FormuData.Localizacion,
              InputStep: "1"
            }
          ]
        },
        {
          subTitle: "Descripcion",
          componentes: [
            {
              tipo: "granTexto",
              Title: "",
              KeyDato: "Descripcion",
              Dato: FormuData.Descripcion
            }
          ]
        },
        {
          subTitle: "Itinerario",
          componentes: [
            {
              tipo: "tablaSimple",
              Title: "",
              KeyDato: "Itinerario",
              Dato: FormuData.Itinerario, //deber ser un [] - array - Sino todo explota
              columnas: [
                {
                  field: "Dia",
                  title: "Dia",
                  initialEditValue: 1,
                  type: "numeric"
                },
                {
                  field: "Hora Inicio",
                  title: "Hora de Inicio",
                  initialEditValue: "00:00"
                },
                {
                  field: "Hora Fin",
                  title: "Hora de Fin",
                  initialEditValue: "00:00"
                },
                { field: "Actividad", title: "Actividad" }
              ]
            },
            {
              tipo: "granTexto",
              Title: "Descripcion de Itinerario",
              KeyDato: "ItinerarioDescripcion",
              Dato: FormuData.ItinerarioDescripcion
            }
          ]
        },
        {
          subTitle: "",
          componentes: [
            {
              tipo: "tablaSimple",
              Title: "Incluye",
              KeyDato: "Incluye",
              Dato: FormuData.Incluye, //deber ser un [] - array - Sino todo explota
              columnas: [{ field: "Actividad", title: "Actividad" }]
            },
            {
              tipo: "tablaSimple",
              Title: "No Incluye",
              KeyDato: "NoIncluye",
              Dato: FormuData.NoIncluye, //deber ser un [] - array - Sino todo explota
              columnas: [{ field: "Actividad", title: "Actividad" }]
            }
          ]
        },
        {
          subTitle: "Recomendaciones para llevar",
          componentes: [
            {
              tipo: "tablaSimple",
              Title: "",
              KeyDato: "RecomendacionesLlevar",
              Dato: FormuData.RecomendacionesLlevar, //deber ser un [] - array - Sino todo explota
              columnas: [{ field: "Recomendacion", title: "Recomendacion" }]
            }
          ]
        },
        {
          subTitle: "Servicios/Productos base del Programa Turistico",
          componentes: [
            {
              tipo: "TablaProgramaServicio_v2",
              Title: "",
              KeyDato: "ServicioProducto",
              Dato: FormuData.ServicioProducto, //deber ser un [] - array - Sino todo explota
              ListaServiciosProductos: ListaServiciosProductos
            }
          ]
        }
      ]
    };
  };
  const Formulario_default = DevolverEstructuraFormulario({
    Id: null,
    NombrePrograma: "",
    CodigoPrograma: "",
    DuracionDias: 0,
    DuracionNoche: 0,
    PrecioEstandar: 0.0,
    Localizacion: "",
    Descripcion: "",
    Itinerario: [],
    Incluye: [],
    NoIncluye: [],
    RecomendacionesLlevar: [],
    ServicioProducto: []
  });
  //------------------------------------------------
  //Variables
  const [IdDato, setIdDato] = useState("");
  const [ReiniciarData, setReiniciarData] = useState(false);
  const [Formulario, setFormulario] = useState(Formulario_default);
  const [TablaDatos, setTablaDatos] = useState(Datos);
  const [Loading, setLoading] = useState(false);

  //hooks
  useEffect(async () => {
    // setLoading(true);
    console.log(IdDato);
    if (IdDato != null && IdDato != "") {
      await fetch(APIpath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idDato: IdDato,
          accion: "FindOne"
        })
      })
        .then((r) => r.json())
        .then((data) => {
          console.log(data);
          setFormulario(
            DevolverEstructuraFormulario({
              //cAMBIAR ESTA ZONA
              Id: IdDato,
              NombrePrograma: data.result.NombrePrograma,
              CodigoPrograma: data.result.CodigoPrograma,
              DuracionDias: data.result.DuracionDias,
              DuracionNoche: data.result.DuracionNoche,
              PrecioEstandar: data.result.PrecioEstandar,
              Localizacion: data.result.Localizacion,
              Descripcion: data.result.Descripcion,
              Itinerario: data.result.Itinerario,
              Incluye: data.result.Incluye,
              NoIncluye: data.result.NoIncluye,
              RecomendacionesLlevar: data.result.RecomendacionesLlevar,
              ServicioProducto: data.result.ServicioProducto || []
            })
          );
        });
      setDisplay(true);
      // setLoading(false);
    }
  }, [IdDato]);
  useEffect(async () => {
    if (ReiniciarData == true) {
      let ActuTablaDatos = [];
      await fetch(APIpath)
        .then((r) => r.json())
        .then((data) => {
          // console.log(data)
          data.result.map((datosResult) => {
            ActuTablaDatos.push({
              IdProgramaTuristico: datosResult.IdProgramaTuristico,
              NombrePrograma: datosResult.NombrePrograma,
              Localizacion: datosResult.Localizacion,
              DuracionDias: datosResult.DuracionDias,
              DuracionNoche: datosResult.DuracionNoche
            });
          });
          setTablaDatos(ActuTablaDatos);
        });
      setReiniciarData(false);
    }
  }, [ReiniciarData]);
  useEffect(() => {
    // Seguros para no subir datos no validos
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (
      ModalData["NombrePrograma"] == null ||
      ModalData["NombrePrograma"] == undefined
    ) {
      console.log("Grave error evitado");
      return;
    }

    if (ModalData["IdProgramaTuristico"] == null) {
      // if (ModalData.Nombre == null) {
      //   alert("Ingrese Datos");
      // }
      //else {
      axios
        .post(API_DOMAIN + "/api/ProgramaTuristico/CRUD", {
          ProgramaTuristico: ModalData
        })
        .then((result) => {
          console.log(result);
          alert("Ingresado Correctamente");
          router.reload();
        });
      //}
    } else {
      fetch(APIpathGeneral, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "update",
          coleccion: "ProgramaTuristico",
          query: { IdProgramaTuristico: ModalData["IdProgramaTuristico"] },
          data: ModalData
        })
      })
        .then((r) => r.json())
        .then((data) => {
          alert(data.message);
        });
    }
  }, [ModalData]);
  return (
    <div>
      <Loader Loading={Loading} />
      <ModalDisplay.Provider
        value={[
          [Display, setDisplay],
          [ModalData, setModalData],
          [Formulario, setFormulario]
        ]}
      >
        <AutoModal_v2
          Formulario={Formulario}
          ModalDisplay={ModalDisplay} //Contexto - Por si lo preguntaban
          IdDato={"IdProgramaTuristico"}
        />

        <span className={CustomStyles.titulo}>Programas turisticos</span>
        <button
          onClick={(event) => {
            setIdDato(null);
            setModalData({});
            setFormulario(Formulario_default);
            setDisplay(true);
          }}
        >
          Nuevo Programa Turistico
        </button>
        <div className={CustomStyles.tituloBox}>
          <MaterialTable
            columns={Columnas}
            data={TablaDatos}
            title="Programas turisticos"
            actions={[
              {
                icon: () => {
                  return <img src="/resources/remove_red_eye-24px.svg" />;
                },
                tooltip: "Save User",
                onClick: (event, rowData) => {
                  // setIdDato();
                  router.push(
                    `/ProgramaTuristico/${rowData.IdProgramaTuristico}`
                  );
                  // setDisplay(true);
                }
              },
              (rowData) => ({
                icon: () => {
                  return <img src="/resources/delete-black-18dp.svg" />;
                },
                tooltip: "Delete User",
                onClick: (event, rowData) => {
                  const dataDelete = [...TablaDatos];
                  const index = rowData.tableData.id;
                  dataDelete.splice(index, 1);
                  setTablaDatos([...dataDelete]);

                  fetch(APIpathGeneral, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      accion: "DeleteOne",
                      coleccion: "ProgramaTuristico",
                      query: {
                        IdProgramaTuristico: rowData["IdProgramaTuristico"]
                      }
                    })
                  })
                    .then((r) => r.json())
                    .then((data) => {
                      alert("Eliminacion realizada");
                    });
                }
              })
            ]}
            options={{
              actionsColumnIndex: -1
            }}
          />
        </div>
        <div>
          <span>Opciones Avanzadas</span>
          <FusionProgramas
            TablaDatos={TablaDatos}
            DevolverEstructuraFormulario={DevolverEstructuraFormulario}
            ModalDisplay={ModalDisplay}
            APIpathGeneral={APIpathGeneral}
          />
        </div>
      </ModalDisplay.Provider>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const APIpath = process.env.API_DOMAIN + "/api/programasTuristicos";
  const APIpathGeneral = process.env.API_DOMAIN + "/api/general";

  const { Auth } = withSSRContext({ req })

  try {
    const user = await Auth.currentAuthenticatedUser()
  } catch (err) {
    res.writeHead(302, { Location: '/' })
    res.end()
  }

  let Columnas = [
    { title: "Id", field: "IdProgramaTuristico", hidden: true },
    { title: "Nombre", field: "NombrePrograma" },
    { title: "Codigo", field: "CodigoPrograma" },
    { title: "Localizacion", field: "Localizacion" },
    { title: "Duracion Dias", field: "DuracionDias" },
    { title: "Duracion Noches", field: "DuracionNoche" }
  ];
  const [client, collection] = await db_connect("ProgramaTuristico");
  let ListaServiciosProductos = [];
  let [ProgramaTuristico, resultProveedores] = await Promise.all([
    new Promise(async (resolve, reject) => {
      let ProgramaTuristico = await collection
        .find(
          {},
          {
            projection: {
              _id: 0,
              IdProgramaTuristico: 1,
              CodigoPrograma: 1,
              NombrePrograma: 1,
              Localizacion: 1,
              DuracionDias: 1,
              DuracionNoche: 1
            }
          }
        )
        .toArray();
      resolve(ProgramaTuristico);
    }),
    new Promise(async (resolve, reject) => {
      let prov_collection = client
        .db(process.env.MONGODB_DB)
        .collection("Proveedor");
      let resultProveedores = await prov_collection
        .find({})
        .project({
          _id: 0,
          nombre: 1,
          tipo: 1,
          IdProveedor: 1,
          porcentajeTotal: 1,
          TipoMoneda: 1
        })
        .toArray();
      resolve(resultProveedores);
    })
  ]);
  let dbo = client.db(process.env.MONGODB_DB);
  let DATA = await Promise.all([
    // Hotel
    new Promise(async (resolve, reject) => {
      let collection = dbo.collection("ProductoHoteles");
      let result = await collection
        .find({})
        .project({
          _id: 0
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
            OrdenServicio: null
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
          _id: 0
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
              Estado: 0
            }
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
          _id: 0
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
              Estado: 0
            }
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
          _id: 0
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
              x["codServicio"] + " - " + x["TipoPaxs"] + " - " + x["gremio"] ||
              null,
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
            OrdenServicio: null
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
          _id: 0
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
            OrdenServicio: null
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
          _id: 0
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
            OrdenServicio: null
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
          _id: 0
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
            OrdenServicio: null
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
          _id: 0
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
            OrdenServicio: null
          });
        }
      });
      resolve(ListaServiciosProductos);
    })
  ]);
  DATA.map((d) => {
    d.map((obj) => {
      ListaServiciosProductos.push(obj);
    });
  });
  client.close();

  return {
    props: {
      Columnas: Columnas,
      Datos: ProgramaTuristico,
      APIpath: APIpath,
      APIpathGeneral: APIpathGeneral,
      ListaServiciosProductos: ListaServiciosProductos,
      API_DOMAIN: process.env.API_DOMAIN
    }
  };
}
export default ProgramasTuristicos;
