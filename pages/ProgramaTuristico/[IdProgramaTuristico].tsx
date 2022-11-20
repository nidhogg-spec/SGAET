import React, { useState, useEffect, useRef } from "react";
import styles from "./DetalleProgramaTuristico.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import MaterialTable from "material-table";
import { resetServerContext } from "react-beautiful-dnd";
import TablaProgramaServicio_v3 from "@/components/ComponentesUnicos/ProgramaTuristico/TablaProgramaServicio_v3/TablaProgramaServicio_v3";

// Estilos
import globalStyles from "@/globalStyles/modules/global.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { GetServerSideProps } from "next";
import { programaTuristicoInterface } from "@/utils/interfaces/db";
import ModalProgramTuris_Editar from "@/components/ComponentesUnicos/ProgramaTuristico/ModalProgramTuris_Editar/ModalProgramTuris_Editar";
import ModalProgramTuris_Editar_Servicios from "@/components/ComponentesUnicos/ProgramaTuristico/ModalProgramTuris_Editar_Servicios/ModalProgramTuris_Editar_Servicios";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/config";

interface Props {
  ProgramaTuristico: programaTuristicoInterface;
  APIpath: string;
  ListaServiciosProductos: any[];
}

const DetalleProgramaTuristico = (props: Props) => {
  const router = useRouter();
  const { IdProgramaTuristico } = router.query;
  const [ProgramaTuristico, setProgramaTuristico] = useState(
    props.ProgramaTuristico
  );
  const [ModoEdicion, setModoEdicion] = useState(false);
  const [ServiciosEdicion, setServiciosEdicion] = useState(false);

  const [ServicioProducto, setServicioProducto] = useState(
    props.ProgramaTuristico["ServicioProducto"]
  );

  return (
    <div
      className={`${styles.ContainerPrincipal} ${globalStyles.main_work_space_container}`}
    >
      <ModalProgramTuris_Editar
        ListaServiciosProductos={props.ListaServiciosProductos as any}
        open={ModoEdicion}
        setOpen={setModoEdicion}
        programaTuristico={props.ProgramaTuristico}
        key={"ModalProgramTuris_Editar_01"}
      />
      <ModalProgramTuris_Editar_Servicios
        ListaServiciosProductos={props.ListaServiciosProductos as any}
        open={ServiciosEdicion}
        setOpen={setServiciosEdicion}
        ListaServiciosEscojidos={props.ProgramaTuristico["ServicioProducto"]}
        programaTuristico={props.ProgramaTuristico}
        key={"ModalProgramTuris_Editar_02"}
      />
      <h1 className="Titulo">{ProgramaTuristico["NombrePrograma"]}</h1>
      <div className={styles.botones__container}>
        <button
          onClick={(event) => {
            setModoEdicion(true);
          }}
          className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}
        >
          Editar
          <img src="/resources/edit-black-18dp.svg" />
        </button>
        {props.ProgramaTuristico["Estado"] ? (
          <button
            onClick={(event) => {
              axios
                .put(`/api/ProgramaTuristico/CRUD`, {
                  ProgramaTuristico: { Estado: 0 },
                  IdProgramaTuristico:
                    props.ProgramaTuristico["IdProgramaTuristico"]
                })
                .then((result) => {
                  router.reload();
                });
            }}
            className={`${botones.buttonCancelar} ${botones.button}`}
          >
            Desactivar
          </button>
        ) : (
          <button
            onClick={(event) => {
              axios
                .put(`/api/ProgramaTuristico/CRUD`, {
                  ProgramaTuristico: { Estado: 1 },
                  IdProgramaTuristico:
                    props.ProgramaTuristico["IdProgramaTuristico"]
                })
                .then((result) => {
                  router.reload();
                });
            }}
            className={`${botones.button} ${botones.buttonGuardar}`}
          >
            Activar
          </button>
        )}
      </div>
      <div>
        <h2>Datos del programa turistico</h2>
        <div className={`${globalStyles.global_textInput_container}`}>
          <label>Nombre del programa turistico</label>
          <input
            type="text"
            value={props.ProgramaTuristico["NombrePrograma"]}
            disabled={true}
          />
        </div>
        <div className={`${globalStyles.global_textInput_container}`}>
          <label>Codigo extra del programa turistico</label>
          <input
            type="text"
            value={props.ProgramaTuristico["CodigoPrograma"]}
            disabled={true}
          />
        </div>
        <div className={`${globalStyles.global_textInput_container}`}>
          <label>Tipo de experiencia</label>
          <input
            type="text"
            value={props.ProgramaTuristico["Tipo"]}
            disabled={true}
          />
        </div>
        <div className={`${globalStyles.global_textInput_container}`}>
          <label>Duracion Dias</label>
          <input
            type="number"
            value={props.ProgramaTuristico["DuracionDias"]}
            disabled={true}
            min={1}
          />
        </div>
        <div className={`${globalStyles.global_textInput_container}`}>
          <label>Duracion Noches</label>
          <input
            type="number"
            value={props.ProgramaTuristico["DuracionNoche"]}
            disabled={true}
            min={0}
          />
        </div>
        <div className={`${globalStyles.global_textInput_container}`}>
          <label>Localizacion</label>
          <input
            type="text"
            value={props.ProgramaTuristico["Localizacion"]}
            disabled={true}
          />
        </div>
        <div className={`${globalStyles.global_textArea_container}`}>
          <label>Descripcion</label>
          <textarea
            id=""
            cols={30}
            rows={10}
            value={props.ProgramaTuristico["Descripcion"]}
            disabled={true}
          ></textarea>
        </div>
        <h2>Itinerario</h2>
        <MaterialTable
          title=""
          columns={[
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
          ]}
          data={props.ProgramaTuristico["Itinerario"]}
        />
        <div className={`${globalStyles.global_textArea_container}`}>
          <label>Descripcion de Itinerario</label>
          <textarea
            id=""
            cols={30}
            rows={10}
            value={props.ProgramaTuristico["ItinerarioDescripcion"]}
            disabled={true}
          ></textarea>
        </div>
        <h2>Incluye</h2>
        <MaterialTable
          title=""
          columns={[{ field: "Actividad", title: "Actividad" }]}
          data={props.ProgramaTuristico["Incluye"]}
        />
        <h2>No Incluye</h2>
        <MaterialTable
          title=""
          columns={[{ field: "Actividad", title: "Actividad" }]}
          data={props.ProgramaTuristico["NoIncluye"]}
        />
        <h2>Recomendaciones para llevar</h2>
        <MaterialTable
          title=""
          columns={[{ field: "Recomendacion", title: "Recomendacion" }]}
          data={props.ProgramaTuristico["RecomendacionesLlevar"]}
        />
        <h2>Servicios/Productos base del Programa Turistico</h2>
        <button
          onClick={(event) => {
            setServiciosEdicion(true);
          }}
          className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}
        >
          Editar Servicios de Programa Turistico
          <img src="/resources/edit-black-18dp.svg" />
        </button>
        <TablaProgramaServicio_v3
          Title={""}
          ModoEdicion={false}
          CotiServicio={ServicioProducto}
          setCotiServicio={setServicioProducto}
          // KeyDato={"ServicioProducto"}
          ListaServiciosProductos={props.ListaServiciosProductos}
          Reiniciar={false}
        />
      </div>
    </div>
  );
};

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
    resetServerContext();
    const IdProgramaTuristico = query.IdProgramaTuristico;

    let [ProgramaTuristico, resultProveedores]: any[] = [];
    let ListaServiciosProductos: any[] = [];
    await connectToDatabase().then(async (connectedObject) => {
      const { client, db } = connectedObject;
      const collection = db.collection("ProgramaTuristico");
      [ProgramaTuristico, resultProveedores] = await Promise.all([
        new Promise(async (resolve, reject) => {
          let ProgramaTuristico = await collection.findOne(
            { IdProgramaTuristico: IdProgramaTuristico },
            { projection: { _id: 0 } }
          );
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
                IdServicioProducto: x["IdProductoHoteles"] || null,
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
                IdServicioProducto: x["IdProductoAgencias"] || null,
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
        ProgramaTuristico: ProgramaTuristico,
        APIpath: process.env.API_DOMAIN,
        ListaServiciosProductos: ListaServiciosProductos
      }
    };
  },
  ironOptions
);

export default DetalleProgramaTuristico;
