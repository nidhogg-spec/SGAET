import React, { useState, useEffect, useRef } from "react";
import styles from "./DetalleProgramaTuristico.module.css";
import AutoFormulario from "@/components/Formulario_V2/AutoFormulario/AutoFormulario";
import { MongoClient } from "mongodb";
import axios from "axios";
import { useRouter } from "next/router";
import TablaProgramaServicio_v2 from "@/components/Formulario/CustomComponenteFormu/TablaProgramaServicio_v2/TablaProgramaServicio_v2";
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

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  res
}) => {
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
      ProgramaTuristico: ProgramaTuristico,
      APIpath: process.env.API_DOMAIN,
      ListaServiciosProductos: ListaServiciosProductos
    }
  };
};
// const TablaServicioCotizacion = (
//   props = {
//     Title: "Nombre del Proveedor",
//     setCotiServicio: () => {},
//     CotiServicio: [],
//     ListaServiciosProductos: []
//   }
// ) => {
//   // -------------------------------Variables---------------------------------
//   const router = useRouter();
//   //Datos q se guardaran en la cotizacion
//   // const [CotiServicio, setCotiServicio] = useState([]);
//   const [CurrencyTotal, setCurrencyTotal] = useState("Dolar");
//   const [MontoTotal, setMontoTotal] = useState(0);
//   const [CambioDolar, setCambioDolar] = useState(0);
//   const NotAgain = useRef(true);

//   //---------------------------------------------------------------------------------

//   //------------------------------------Hooks-----------------------------------------
//   useEffect(() => {
//     if (NotAgain.current) {
//       NotAgain.current = false;
//       return;
//     }
//     let temp_MontoTotal = 0;
//     if (props.CotiServicio != undefined) {
//       switch (CurrencyTotal) {
//         case "Dolar":
//           props.CotiServicio.map((uni_CotiServi) => {
//             switch (uni_CotiServi["Currency"] || "Dolar") {
//               case "Dolar":
//                 temp_MontoTotal += parseFloat(uni_CotiServi["PrecioCotiTotal"]);
//                 break;
//               case "Sol":
//                 temp_MontoTotal +=
//                   parseFloat(uni_CotiServi["PrecioCotiTotal"]) / CambioDolar;
//                 break;
//             }
//           });
//           break;
//         case "Sol":
//           props.CotiServicio.map((uni_CotiServi) => {
//             switch (uni_CotiServi["Currency"]) {
//               case "Dolar":
//                 temp_MontoTotal +=
//                   parseFloat(uni_CotiServi["PrecioCotiTotal"]) * CambioDolar;
//                 break;
//               case "Sol":
//                 temp_MontoTotal += parseFloat(uni_CotiServi["PrecioCotiTotal"]);
//                 break;
//             }
//           });
//           break;
//       }
//     }
//     NotAgain.current = true;
//     setMontoTotal(temp_MontoTotal);
//   }, [props.CotiServicio, CurrencyTotal]);
//   useEffect(() => {
//     let CambioDolar_temp = sessionStorage.getItem("CambioDolar");
//     if (CambioDolar_temp) {
//       setCambioDolar(CambioDolar_temp);
//     } else {
//       fetch("/api/DataSistema", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           accion: "ObtenerCambioDolar"
//         })
//       })
//         .then((r) => r.json())
//         .then((data) => {
//           setCambioDolar(data.value);
//           sessionStorage.setItem("CambioDolar", data.value);
//         });
//     }
//   }, []);
//   //---------------------------------------------------------------------------------

//   return (
//     <div>
//       <span>{props.Title}</span>
//       <div>
//         <MaterialTable
//           title={props.Title}
//           columns={[
//             {
//               field: "IdServicioProducto",
//               title: "IdServicioProducto",
//               editable: "never",
//               hidden: true
//             },
//             {
//               field: "PrecioConfiUnitario",
//               title: "Precio Confidencial Unitario",
//               editable: "never",
//               type: "numeric",
//               hidden: true
//             },
//             { field: "NombreServicio", title: "Nombre", editable: "never" },
//             {
//               field: "Dia",
//               title: "Dia",
//               editable: "never",
//               type: "numeric"
//             },
//             {
//               field: "Cantidad",
//               title: "Cantidad",
//               editable: "always",
//               type: "numeric"
//             },
//             {
//               field: "Currency",
//               title: "Moneda",
//               editable: "never",
//               lookup: { Dolar: "Dolares", Sol: "Nuevos Soles" }
//             },
//             {
//               field: "PrecioCotiUnitario",
//               title: "Precio Cotizacion Unitario",
//               editable: "always",
//               type: "numeric"
//             },
//             {
//               field: "PrecioPublicado",
//               title: "Precio Publicado",
//               editable: "never",
//               type: "numeric"
//             },
//             {
//               field: "IGV",
//               title: "IGV incluido?",
//               editable: "always",
//               type: "boolean"
//             },
//             {
//               field: "PrecioCotiTotal",
//               title: "Precio Cotizacion Total",
//               editable: "never",
//               type: "numeric"
//             },
//             {
//               field: "PrecioConfiTotal",
//               title: "Precio Confidencial Total",
//               editable: "never",
//               type: "numeric"
//             }
//           ]}
//           data={props.CotiServicio}
//           editable={{
//             onBulkUpdate: (cambios) =>
//               new Promise((resolve, reject) => {
//                 setTimeout(() => {
//                   // if (typeof(cambios) === 'object') {
//                   //   cambios = [cambios]
//                   // }
//                   Object.entries(cambios).map((cambio) => {
//                     let temp_CotiServicio = [...props.CotiServicio];
//                     let temp_newData = cambio[1]["newData"];
//                     let id = temp_newData["tableData"]["id"];

//                     temp_CotiServicio[id]["Cantidad"] =
//                       temp_newData["Cantidad"];
//                     temp_CotiServicio[id]["IGV"] = temp_newData["IGV"];
//                     if (temp_CotiServicio[id]["IGV"]) {
//                       temp_CotiServicio[id]["PrecioCotiTotal"] = (
//                         temp_newData["Cantidad"] *
//                         temp_newData["PrecioCotiUnitario"] *
//                         1.18
//                       ).toFixed(2);
//                       temp_CotiServicio[id]["PrecioConfiTotal"] = (
//                         temp_newData["Cantidad"] *
//                         temp_newData["PrecioConfiUnitario"] *
//                         1.18
//                       ).toFixed(2);
//                     } else {
//                       temp_CotiServicio[id]["PrecioCotiTotal"] = (
//                         temp_newData["Cantidad"] *
//                         temp_newData["PrecioCotiUnitario"]
//                       ).toFixed(2);
//                       temp_CotiServicio[id]["PrecioConfiTotal"] = (
//                         temp_newData["Cantidad"] *
//                         temp_newData["PrecioConfiUnitario"]
//                       ).toFixed(2);
//                     }
//                     temp_CotiServicio[id]["PrecioCotiUnitario"] =
//                       temp_newData["PrecioCotiUnitario"];
//                     props.setCotiServicio(temp_CotiServicio);
//                     resolve();
//                   });
//                 }, 1000);
//               }),
//             onRowDelete: (oldData) =>
//               new Promise((resolve, reject) => {
//                 setTimeout(() => {
//                   const dataDelete = [...props.CotiServicio];
//                   const index = oldData.tableData.id;
//                   dataDelete.splice(index, 1);
//                   props.setCotiServicio([...dataDelete]);
//                   resolve();
//                 }, 1000);
//               })
//           }}
//           actions={[
//             {
//               icon: () => {
//                 return <img src="/resources/remove_red_eye-24px.svg" />;
//               },
//               tooltip: "Mostrar reserva",
//               onClick: (event, rowData) => {
//                 router.push(`/reservas/servicio/${rowData.IdServicioEscogido}`);
//               }
//             }
//           ]}
//         />
//         <select
//           onChange={(event) => {
//             setCurrencyTotal(event.target.value);
//           }}
//         >
//           <option value="Dolar" selected>
//             Dolares
//           </option>
//           <option value="Sol">Soles</option>
//         </select>
//         <span>
//           El precio total es: {CurrencyTotal == "Dolar" ? "$" : "S/."}
//           {MontoTotal.toFixed(2)}
//         </span>
//       </div>
//       <div>
//         <MaterialTable
//           title={"Servicios para añadir"}
//           columns={[
//             {
//               field: "IdServicioProducto",
//               title: "IdServicioProducto",
//               editable: "never",
//               hidden: true
//             },
//             {
//               field: "TipoServicio",
//               title: "Tipo de Servicio",
//               editable: "never"
//             },
//             { field: "Nombre", title: "Nombre", editable: "never" },
//             { title: "Nombre del Proveedor", field: "NombreProveedor" },
//             { title: "Puntaje del Proveedor", field: "PuntajeProveedor" },
//             { field: "Descripcion", title: "Descripcion", editable: "never" },
//             {
//               field: "Currency",
//               title: "Moneda",
//               editable: "never",
//               lookup: { Dolar: "Dolares", Sol: "Nuevos Soles" }
//             },
//             {
//               field: "Precio",
//               title: "Precio Cotizacion",
//               editable: "never",
//               type: "numeric"
//             },
//             {
//               field: "Costo",
//               title: "Precio Confidencial",
//               editable: "never",
//               type: "numeric"
//             },
//             {
//               field: "PrecioPublicado",
//               title: "Precio Publicado",
//               editable: "never",
//               type: "numeric"
//             }
//           ]}
//           data={props.ListaServiciosProductos}
//           actions={[
//             {
//               icon: "add",
//               tooltip: "Añadir Servicio a Cotizacion",
//               onClick: (event, rowData) => {
//                 let x = [...props.CotiServicio];
//                 x.push({
//                   IdServicioProducto: rowData["IdServicioProducto"],
//                   TipoServicio: rowData["TipoServicio"],
//                   PrecioConfiUnitario: rowData["Costo"],
//                   NombreServicio: rowData["Nombre"],
//                   Dia: 1,
//                   Cantidad: 1,
//                   PrecioCotiUnitario: rowData["Precio"],
//                   IGV: false,
//                   PrecioCotiTotal: rowData["Precio"],
//                   PrecioConfiTotal: rowData["Costo"],
//                   Currency: rowData["Currency"],
//                   PrecioPublicado: rowData["PrecioPublicado"]
//                 });
//                 props.setCotiServicio(x);
//                 // let ActuDataTableServicios = [...DataTableServicios];
//                 // ActuDataTableServicios.splice(
//                 //   ActuDataTableServicios.findIndex((value) => {
//                 //     return value["IdServicio"] == rowData["IdServicio"];
//                 //   }),
//                 //   1
//                 // );
//                 // setDataTableServicios(ActuDataTableServicios);
//               }
//             }
//           ]}
//         />
//       </div>
//     </div>
//   );
// };

export default DetalleProgramaTuristico;
