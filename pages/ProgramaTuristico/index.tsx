//packege
import router from "next/router";
import React, { useEffect, useState, createContext, useRef } from "react";
// import {Data_ProgramasTuristicos} from '../../query/query'
import { resetServerContext } from "react-beautiful-dnd";

//css
import CustomStyles from "@/globalStyles/ProgramasTuristicos.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import globalStyles from "@/globalStyles/modules/global.module.css";

//modulos
import MaterialTable from "material-table";
import ModalProgramTuris_Nuevo from "@/components/ComponentesUnicos/ProgramaTuristico/ModalProgramTuris_Nuevo/ModalProgramTuris_Nuevo";
import Tabla from "../../components/TablaModal/Tabla";
import AutoModal_v2 from "@/components/AutoModal_v2/AutoModal_v2";
import FusionProgramas from "@/components/ComponentesUnicos/ProgramaTuristico/FusionProgramas/FusionProgramas";
import Loader from "@/components/Loading/Loading";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/config";

//
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/utils/API/connectMongo-v2";

interface Props {
  Columnas: any[];
  Datos: any[];
  APIpath: string;
  APIpathGeneral: string;
  ListaServiciosProductos: any[];
  API_DOMAIN: string;
}
function ProgramasTuristicos({
  Columnas,
  Datos,
  APIpath,
  APIpathGeneral,
  ListaServiciosProductos,
  API_DOMAIN
}: Props) {
  //Variables
  const [TablaDatos, setTablaDatos] = useState(Datos);
  const [Loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [ListarInactivos, setListarInactivos] = useState(false);

  useEffect(() => {
    // setLoading(true);
    if (ListarInactivos == true) {
      axios.get("/api/ProgramaTuristico/CRUD?inactivos=true").then((data) => {
        setTablaDatos(data.data.data);
        setLoading(false);
      });
    } else {
      axios.get("/api/ProgramaTuristico/CRUD").then((data) => {
        setTablaDatos(data.data.data);
        setLoading(false);
      });
    }
  }, [ListarInactivos]);
  return (
    <div>
      <Loader Loading={Loading} />
      <ModalProgramTuris_Nuevo
        open={open}
        setOpen={setOpen}
        ListaServiciosProductos={ListaServiciosProductos as never[]}
        key={"ModalProgramTuris_Nuevo"}
      />
      <div className={globalStyles.main_work_space_container}>
        <div className={CustomStyles.main_work_space_container_title}>
          <span className={CustomStyles.titulo}>
            Lista de Programas turisticos
          </span>
          <button
            className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}
            onClick={(event) => {
              setOpen(true);
            }}
          >
            Nuevo Programa Turistico
          </button>
        </div>
        <div className={globalStyles.checkbox_container}>
          <label className={globalStyles.checkbox_switch}>
            <input
              type="checkbox"
              onChange={(value) => {
                setListarInactivos(value.target.checked);
              }}
              //@ts-ignore
              value={ListarInactivos}
            />
            <span
              className={`${globalStyles.checkbox_switch_slider} ${globalStyles.checkbox_switch_slider_round}`}
            ></span>
          </label>
          <span className={globalStyles.checkbox_label}>Mostrar Inactivos</span>
        </div>
        <div className={CustomStyles.tituloBox}>
          <MaterialTable
            columns={Columnas}
            data={TablaDatos}
            title={""}
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
        {/* <div>
          <h2>Opciones Avanzadas</h2>
          <FusionProgramas
              TablaDatos={TablaDatos as never[]}
              DevolverEstructuraFormulario={DevolverEstructuraFormulario as any}
              ModalDisplay={ModalDisplay}
              APIpathGeneral={APIpathGeneral}
            />
        </div> */}
      </div>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res, query }) {
    const user = req.session.user;
    if (!user) {
      return {
        redirect: {
          permanent: false,
          destination: "/login"
        }
      };
    }
    //---------------------------------------------------------------------------------------------------------------------

    const APIpath = process.env.API_DOMAIN + "/api/programasTuristicos";
    const APIpathGeneral = process.env.API_DOMAIN + "/api/general";

    resetServerContext();

    let Columnas = [
      { title: "Id", field: "IdProgramaTuristico", hidden: true },
      { title: "Nombre", field: "NombrePrograma" },
      { title: "Codigo", field: "CodigoPrograma" },
      { title: "Localizacion", field: "Localizacion" },
      { title: "Duracion Dias", field: "DuracionDias" },
      { title: "Duracion Noches", field: "DuracionNoche" }
    ];
    // const [client, collection] = await db_connect("ProgramaTuristico");
    let [ProgramaTuristico, resultProveedores]: any[] = [];
    let ListaServiciosProductos: any[] = [];
    await connectToDatabase().then(async (connectedObject) => {
      const { client, db } = connectedObject;
      const collection = db.collection("ProgramaTuristico");
      [ProgramaTuristico, resultProveedores] = await Promise.all([
        new Promise(async (resolve, reject) => {
          let ProgramaTuristico = await collection
            .find(
              { Estado: 1 },
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
      let DATA: any[] = await Promise.all([
        // Hotel
        new Promise(async (resolve, reject) => {
          let collection = db.collection("ProductoHoteles");
          let result = await collection
            .find({})
            .project({
              _id: 0
            })
            .toArray();
          let ListaServiciosProductos: any[] = [];
          result.map((x) => {
            let proveedor = resultProveedores.find(
              (value: { [x: string]: any }) => {
                return value["IdProveedor"] == x["IdProveedor"];
              }
            );
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
          let collection = db.collection("ProductoRestaurantes");
          let result = await collection
            .find({})
            .project({
              _id: 0
            })
            .toArray();
          let ListaServiciosProductos: any[] = [];
          result.map((x) => {
            let proveedor = resultProveedores.find(
              (value: { [x: string]: any }) => {
                return value["IdProveedor"] == x["IdProveedor"];
              }
            );
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
          let collection = db.collection("ProductoTransportes");
          let result = await collection
            .find({})
            .project({
              _id: 0
            })
            .toArray();
          let ListaServiciosProductos: any[] = [];
          result.map((x) => {
            let proveedor = resultProveedores.find(
              (value: { [x: string]: any }) => {
                return value["IdProveedor"] == x["IdProveedor"];
              }
            );
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
          let collection = db.collection("ProductoGuias");
          let result = await collection
            .find({})
            .project({
              _id: 0
            })
            .toArray();
          let ListaServiciosProductos: any[] = [];
          result.map((x) => {
            let proveedor = resultProveedores.find(
              (value: { [x: string]: any }) => {
                return value["IdProveedor"] == x["IdProveedor"];
              }
            );
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
                OrdenServicio: null
              });
            }
          });
          resolve(ListaServiciosProductos);
        }),
        // Agencia
        new Promise(async (resolve, reject) => {
          let collection = db.collection("ProductoAgencias");
          let result = await collection
            .find({})
            .project({
              _id: 0
            })
            .toArray();
          let ListaServiciosProductos: any[] = [];
          result.map((x) => {
            let proveedor = resultProveedores.find(
              (value: { [x: string]: any }) => {
                return value["IdProveedor"] == x["IdProveedor"];
              }
            );
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
          let collection = db.collection("ProductoTransFerroviario");
          let result = await collection
            .find({})
            .project({
              _id: 0
            })
            .toArray();
          let ListaServiciosProductos: any[] = [];
          result.map((x) => {
            let proveedor = resultProveedores.find(
              (value: { [x: string]: any }) => {
                return value["IdProveedor"] == x["IdProveedor"];
              }
            );
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
          let collection = db.collection("ProductoSitioTuristico");
          let result = await collection
            .find({})
            .project({
              _id: 0
            })
            .toArray();
          let ListaServiciosProductos: any[] = [];
          result.map((x) => {
            let proveedor = resultProveedores.find(
              (value: { [x: string]: any }) => {
                return value["IdProveedor"] == x["IdProveedor"];
              }
            );
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
          let collection = db.collection("ProductoOtros");
          let result = await collection
            .find({})
            .project({
              _id: 0
            })
            .toArray();
          let ListaServiciosProductos: any[] = [];
          result.map((x) => {
            let proveedor = resultProveedores.find(
              (value: { [x: string]: any }) => {
                return value["IdProveedor"] == x["IdProveedor"];
              }
            );
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
      DATA.map((d: any[]) => {
        d.map((obj) => {
          ListaServiciosProductos.push(obj);
        });
      });
    });

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
  },
  ironOptions
);

export default ProgramasTuristicos;
