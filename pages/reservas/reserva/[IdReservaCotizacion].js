import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { estadosReservaCotizacion } from "@/utils/dominio";

import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/config";

//Componentes
import AutoFormulario_v2 from "@/components/Formulario_V2/AutoFormulario/AutoFormulario";
import Loader from "@/components/Loading/Loading";
import MaterialTable from "material-table";
import axios from "axios";
import Cotizacion from "../Cotizacion";
import { resetServerContext } from "react-beautiful-dnd";

import { Modal } from "@mui/material";

// Estilos
import styles from "@/globalStyles/DetalleReservaCotizacion.module.css";
import botones from '@/globalStyles/modules/boton.module.css'
import globalStyles from '@/globalStyles/modules/global.module.css'


const estadosReservaCotizacion_array = Object.values(estadosReservaCotizacion);
console.log(estadosReservaCotizacion_array);

const ReservaCotizacion = ({ APIPatch, APIpath }) => {
  const router = useRouter();
  const { IdReservaCotizacion } = router.query;
  // --------------------------------------------------------------------------------------
  // Aqui va todo lo necesario para trabajar con el autoFormulario
  const [ReservaCotizacion, setReservaCotizacion] = useState({});
  const [ServiciosEscogidos, setServiciosEscogidos] = useState([]);
  const [AllServiciosProductos, setAllServiciosProductos] = useState([]);
  const [ClienteCotizacion, setClienteCotizacion] = useState({});
  const [Estado, setEstado] = useState(0);
  const [Loading, setLoading] = useState(false);
  const [ModoEdicion, setModoEdicion] = useState(false);
  const [ModalOpen, setModalOpen] = useState(false);
  const RefPago = useRef(null);

  const [Currency, setCurrency] = useState("Dolar");
  const [MontoTotal, setMontoTotal] = useState(0);
  const [CambioDolar, setCambioDolar] = useState(0);

  const refEstado = useRef(null);
  //--------------------------------------------------------------------------------------
  useEffect(async () => {
    setLoading(true);
    await Promise.all([
      new Promise(async (resolve, reject) => {
        await fetch(
          APIPatch + "/api/reserva/DataReserva/" + IdReservaCotizacion
        )
          .then((r) => r.json())
          .then((data) => {
            setReservaCotizacion(data.reservaCotizacion);
            setClienteCotizacion(data.clienteProspecto);
            if (data.reservaCotizacion["Estado"]) {
              setEstado(data.reservaCotizacion["Estado"]);
            } else {
              setEstado(0);
            }
            resolve();
          });
      }),
      new Promise(async (resolve, reject) => {
        await fetch(
          APIPatch + "/api/reserva/DataServicio/" + IdReservaCotizacion
        )
          .then((r) => r.json())
          .then((data) => {
            setServiciosEscogidos(data.AllServicioEscogido);
            resolve();
          });
      }),
      new Promise(async (resolve, reject) => {
        await fetch(APIPatch + "/api/Cotizacion/ObtenerTodosServicios")
          .then((r) => r.json())
          .then((data) => {
            setAllServiciosProductos(data.data);
            resolve();
          });
      }),
      new Promise(async (resolve, reject) => {
        let temp_cambio = await axios.post(APIPatch + "/api/DataSistema", {
          accion: "ObtenerCambioDolar"
        });
        setCambioDolar(temp_cambio.data["value"]);
        resolve();
      })
    ]);
    setLoading(false);
  }, []);
  // -----------------------------------------------------------------------
  const CalcularTotal = () => {
    let temp_MontoTotal = 0;
    let CurrencyTotal = Currency;
    if (ServiciosEscogidos != undefined) {
      switch (CurrencyTotal) {
        case "Dolar":
          ServiciosEscogidos.map((uni_CotiServi) => {
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
          ServiciosEscogidos.map((uni_CotiServi) => {
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
    return temp_MontoTotal;
  };
  useEffect(() => {
    setMontoTotal(CalcularTotal());
  }, [ServiciosEscogidos, Currency]);

  //-----------------Funcionamiento de tabla devolucion --------------------
  const [Devolucion, setDevolucion] = useState([]);
  const callback_create = () => { };
  const callback_delete = () => { };
  const callback_update = () => { };

  const handlePagadoSubmit = async () => {
    const formData = new FormData(RefPago.current);
    const data = {
      Adelanto: parseFloat(parseFloat(formData.get("Adelanto")).toFixed(2)),
      MetodoPago: formData.get("MetodoPago")
    };
    let array_data = Object.values(data);
    if (
      array_data.includes("") ||
      array_data.includes(null) ||
      array_data.includes(undefined) ||
      array_data.includes(NaN)
    ) {
      alert("Faltan datos");
    } else {
      const temp_MontoTotal = CalcularTotal();
      setModalOpen(false);
      setLoading(true);
      let Estado_val = parseInt(refEstado.current.value);
      await Promise.all([
        new Promise(async (resolve, reject) => {
          await axios.post(
            APIPatch + "/api/reserva/DataReserva/CRUDReservaCotizacion",
            {
              data: { Estado: Estado_val },
              idProducto: IdReservaCotizacion,
              accion: "update"
            }
          );
          resolve()
        }),
        new Promise(async (resolve, reject) => {
          await axios.post(APIPatch + "/api/finanzas/ingresos", {
            accion: "create",
            data: {
              Npasajeros:
                (ReservaCotizacion["NpasajerosAdult"] || 0) +
                (ReservaCotizacion["NpasajerosChild"] || 0),
              Total: temp_MontoTotal,
              TotalNeto: 0,
              Comision: 0,
              IdReservaCotizacion: IdReservaCotizacion,
              ...data
            }
          });
          resolve()
        }),
      ])
      setLoading(false);
    }
  };

  return (
    <>
      <Loader Loading={Loading} />
      <div className={`${globalStyles.main_work_space_container}`}>
        <div className={`${styles.title_container}`}>
          <h1>Reserva/Cotizacion</h1>
          {ModoEdicion ? (
            <>
              <button
                className={`${botones.button} ${botones.buttonGuardar}`}
                onClick={async () => {
                  setLoading(true);
                  await Promise.all([
                    new Promise(async (resolve, reject) => {
                      let temp_ServiciosEscogidos = [...ServiciosEscogidos];
                      temp_ServiciosEscogidos.map((Servi) => {
                        Servi["IdReservaCotizacion"] = IdReservaCotizacion;
                      });
                      await axios.put(
                        APIPatch + "/api/reserva/DataServicio/CRUD",
                        {
                          ServicioEscogido: temp_ServiciosEscogidos,
                          Accion: "UpdateMany"
                        }
                      );
                      resolve();
                    }),
                    new Promise(async (resolve, reject) => {
                      await axios.post(
                        APIPatch +
                        "/api/reserva/DataReserva/CRUDReservaCotizacion",
                        {
                          data: ReservaCotizacion,
                          idProducto: IdReservaCotizacion,
                          accion: "update"
                        }
                      );
                      resolve();
                    })
                  ]);
                  setLoading(false);
                }}
              >
                Guardar
                <img
                  src="/resources/save-black-18dp.svg"
                />
              </button>
              <button
                className={` ${botones.button} ${botones.buttonCancelar}`}
                onClick={(event) => {
                  setModoEdicion(false);
                }}
              >
                Cancelar
                <img
                  src="/resources/close-black-18dp.svg"

                />
              </button>
            </>
          ) : (
            <>
              <button
                className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}
                onClick={(event) => {
                  setModoEdicion(true);
                }}
              >
                Editar
                <img
                  src="/resources/edit-black-18dp.svg"
                />
              </button>
            </>
          )}
          <button
            className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}
            onClick={async (event) => {
              setLoading(true);
              let Binary_pdf = await fetch(
                APIPatch + "/api/reserva/Voucher/GetVocher/" + IdReservaCotizacion
              )
                .then((response) => {
                  return response.text();
                })
                .then((data) => {
                  let link = document.createElement("a");
                  link.download = "file.pdf";
                  link.href = "data:application/octet-stream;base64," + data;
                  link.click();
                });

              setLoading(false);
            }}
          >
            Descargar Voucher
          </button>
        </div>

        <Modal open={ModalOpen} className={styles.modal}>
          <div className={styles.ModalMainContainer}>
            <form ref={RefPago}>
              <input
                type="number"
                min="0.00"
                step="0.10"
                placeholder="Adelanto"
                name="Adelanto"
              />
              <input placeholder="Metodo de Pago" name="MetodoPago" />
              <button type="button" onClick={handlePagadoSubmit}>
                Continuar
              </button>
            </form>
          </div>
        </Modal>

        <div
          className={`${styles.Estado_Input_container}`}
        >
          <h3>Estado de Reserva/Cotizacion</h3>
          <select
            value={Estado}
            ref={refEstado}
            onChange={async () => {
              setLoading(true);
              let Estado_val = parseInt(refEstado.current.value);
              if (Estado_val > Estado) {
                if (confirm("Esta seguro de cambiar de estado?")) {
                  setEstado(Estado_val);
                  if (Estado_val == 2) {
                    setModalOpen(true);
                  } else {
                    await axios.post(
                      APIPatch + "/api/reserva/DataReserva/CRUDReservaCotizacion",
                      {
                        data: { Estado: Estado_val },
                        idProducto: IdReservaCotizacion,
                        accion: "update"
                      }
                    );
                  }
                }
              }
              setLoading(false);
            }}
          >
            {estadosReservaCotizacion_array.map((Estado) => {
              return <option value={Estado.numero}>{Estado.estado}</option>
            })}
          </select>
        </div>
        <div>
          <div>
            <h3>Datos de Reserva/Cotizacion</h3>
            <AutoFormulario_v2
              Formulario={{
                title: "Prueba de guardado de datos",
                secciones: [
                  {
                    subTitle: "",
                    componentes: [
                      {
                        tipo: "texto",
                        Title: "Codigo de Grupo",
                        KeyDato: "CodGrupo"
                      },
                      {
                        tipo: "texto",
                        Title: "Nombre de Grupo",
                        KeyDato: "NombreGrupo"
                      },
                      {
                        tipo: "numero",
                        Title: "Numero de pasajeros adultos",
                        KeyDato: "NpasajerosAdult"
                      },
                      {
                        tipo: "numero",
                        Title: "Numero de pasajeros niños",
                        KeyDato: "NpasajerosChild"
                      },
                      {
                        tipo: "fecha",
                        Title: "Fecha IN",
                        KeyDato: "FechaIN"
                      },
                      {
                        tipo: "fecha",
                        Title: "Fecha OUT",
                        KeyDato: "FechaOUT"
                      },
                      {
                        tipo: "texto",
                        Title: "Voucher",
                        KeyDato: "Voucher"
                      },
                      {
                        tipo: "texto",
                        Title: "Idioma",
                        KeyDato: "Idioma"
                      },
                      {
                        tipo: "fecha",
                        Title: "Fecha de entrega voucher",
                        KeyDato: "FechaEntrega"
                      }
                    ]
                  }
                ]
              }}
              ModoEdicion={ModoEdicion}
              Dato={ReservaCotizacion}
              setDato={setReservaCotizacion}
              key={"AF_ReserCoti"}
            />
            <div className={`${globalStyles.global_textInput_container}`}>
              <span>Moneda</span>
              <select
                onChange={(event) => {
                  setCurrency(event.target.value);
                }}
              >
                <option value="Dolar" selected>
                  Dolares
                </option>
                <option value="Sol">Soles</option>
              </select>
            </div>
            <div className={`${globalStyles.global_textInput_container}`}>
              <span>Precio</span>
              <input value={"$ " + MontoTotal.toFixed(2)} type="text" disabled />
            </div>
          </div>
          <div>
            <h3>LLenado de Pasajeros</h3>
            <div className={`${styles.Pasajeros_Input_container}`}>
              <span>Link de Formulario de pasajeros</span>
              <input
                value={APIpath + `/LlenadoPasajeros/${IdReservaCotizacion}`}
                disabled
              />
              <Link
                href={APIpath + `/LlenadoPasajeros/${IdReservaCotizacion}`}
              >
                <a className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}>Llenar Lista de Pasajeros</a>
              </Link>
            </div>
            <h3>Datos del Cotizante</h3>
            <AutoFormulario_v2
              Formulario={{
                title: "Prueba de guardado de datos",
                secciones: [
                  {
                    subTitle: "",
                    componentes: [
                      {
                        tipo: "texto",
                        Title: "Nombre Completo",
                        KeyDato: "NombreCompleto"
                      },
                      {
                        tipo: "selector",
                        Title: "Tipo de Documento",
                        KeyDato: "TipoDocumento",
                        SelectOptions: [
                          { value: 0, texto: "DNI" },
                          { value: 1, texto: "RUC" },
                          { value: 2, texto: "Pasaporte" },
                          { value: 3, texto: "Carné de Extranjería" }
                        ]
                      },
                      {
                        tipo: "texto",
                        Title: "Nro de Documento",
                        KeyDato: "NroDocumento"
                      },
                      {
                        tipo: "texto",
                        Title: "Celular Principal",
                        KeyDato: "Celular"
                      },
                      {
                        tipo: "texto",
                        Title: "Email Principal",
                        KeyDato: "Email"
                      }
                    ]
                  }
                ]
              }}
              ModoEdicion={ModoEdicion}
              Dato={ClienteCotizacion}
              setDato={setClienteCotizacion}
              key={"AF_ClienteCotizacion"}
            />
          </div>
          <div>
            {/* <TablaDevolucion
          Data={Devolucion}
          setData={setDevolucion}
          callback_create={null}
          callback_delete={null}
          callback_update={null}
        /> */}
          </div>
          <div>
            <TablaServicioCotizacion
              Title="Servicios/Productos de la Reserva/Coizacion"
              setCotiServicio={setServiciosEscogidos}
              CotiServicio={ServiciosEscogidos || []}
              ListaServiciosProductos={AllServiciosProductos || []}
              FechaIN={ReservaCotizacion["FechaIN"]}
              setMontoTotal={setMontoTotal}
              APIPatch={APIPatch}
              IdReservaCotizacion={IdReservaCotizacion}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps(context) {
    const user = context.req.session.user;
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
    let APIPatch = process.env.API_DOMAIN;
    const APIpath = process.env.API_DOMAIN;
    return {
      props: {
        APIPatch: APIPatch,
        APIpath: APIpath
      }
    };

  },
  ironOptions
);

export default ReservaCotizacion;

const TablaServicioCotizacion = (
  props = {
    Title: "Nombre del Proveedor",
    setCotiServicio: () => { },
    CotiServicio: [],
    ListaServiciosProductos: [],
    FechaIN,
    setMontoTotal,
    APIPatch,
    IdReservaCotizacion
    // columnas:[]
  }
) => {
  resetServerContext();
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
    props.setMontoTotal(temp_MontoTotal);
    Actulizar_fechas();
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
          accion: "ObtenerCambioDolar"
        })
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
    let temp_CotiServicio = [...props.CotiServicio];
    temp_CotiServicio.map((item) => {
      let temp_date = new Date(fecha_inicio);
      if (item["Dia"]) {
        let dt = temp_date.getDate() + parseInt(item["Dia"]);
        temp_date.setDate(dt);
        item["FechaReserva"] = temp_date.toLocaleDateString();
      } else {
        let dt = temp_date.getDate() + 1;
        temp_date.setDate(dt);
        item["FechaReserva"] = temp_date.toLocaleDateString();
      }
      console.log(item["FechaReserva"]);
      props.setCotiServicio(temp_CotiServicio);
      // item['FechaReserva']= item['FechaReserva'].toString()
    });
  };
  //---------------------------------------------------------------------------------

  return (
    <div>
      <h3>{props.Title}</h3>
      <div>
        <MaterialTable
          title={props.Title}
          columns={[
            {
              field: "IdServicioProducto",
              title: "IdServicioProducto",
              editable: "never",
              hidden: true
            },
            {
              field: "PrecioConfiUnitario",
              title: "Precio Confidencial Unitario",
              editable: "never",
              type: "numeric",
              hidden: true
            },
            { field: "NombreServicio", title: "Nombre", editable: "never" },
            {
              field: "Dia",
              title: "Dia",
              editable: "always",
              type: "numeric"
            },
            {
              field: "FechaReserva",
              title: "Fecha de Reserva",
              editable: "never",
              type: "date"
            },
            {
              field: "Cantidad",
              title: "Cantidad",
              editable: "always",
              type: "numeric"
            },
            {
              field: "Currency",
              title: "Moneda",
              editable: "never",
              lookup: { Dolar: "Dolares", Sol: "Nuevos Soles" }
            },
            {
              field: "PrecioCotiUnitario",
              title: "Precio Cotizacion Unitario",
              editable: "always",
              type: "numeric"
            },
            {
              field: "PrecioPublicado",
              title: "Precio Publicado",
              editable: "never",
              type: "numeric"
            },
            {
              field: "IGV",
              title: "IGV incluido?",
              editable: "always",
              type: "boolean"
            },
            {
              field: "PrecioCotiTotal",
              title: "Precio Cotizacion Total",
              editable: "never",
              type: "numeric"
            },
            {
              field: "PrecioConfiTotal",
              title: "Precio Confidencial Total",
              editable: "never",
              type: "numeric"
            }
          ]}
          data={props.CotiServicio}
          editable={{
            onBulkUpdate: (cambios) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  //--------Improtante / Si solo se edito un objeto, el cambios se da como un objeto, pero todo el proceso esta hecho para trabajar con arrays
                  // if (typeof(cambios) === 'object') {
                  //   cambios = [cambios]
                  // }
                  //--------------------------------------------------------------------------------------------
                  let temp_CotiServicio = [...props.CotiServicio];
                  Object.entries(cambios).map((cambio) => {
                    let temp_newData = cambio[1]["newData"];
                    let id = temp_newData["tableData"]["id"];

                    temp_CotiServicio[id]["Cantidad"] =
                      temp_newData["Cantidad"];
                    temp_CotiServicio[id]["Dia"] = temp_newData["Dia"];
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
                    //--------------------------------------------------
                    axios.put(
                      props.APIPatch +
                      `/api/ServicioEscogido/CRUD/${temp_CotiServicio[id]["IdServicioEscogido"]}`,
                      { ServicioEscogido: temp_CotiServicio[id] }
                    );
                    //--------------------------------------------------
                  });
                  props.setCotiServicio(temp_CotiServicio);
                  resolve();
                }, 1000);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(async () => {
                  const dataDelete = [...props.CotiServicio];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  props.setCotiServicio([...dataDelete]);
                  //--------------------------------------------------
                  console.log(oldData);
                  let result = await axios.delete(
                    props.APIPatch +
                    `/api/ServicioEscogido/CRUD/${oldData["IdServicioEscogido"]}`
                  );
                  console.log(result);
                  //--------------------------------------------------

                  resolve();
                }, 1000);
              })
          }}
          actions={[
            {
              icon: () => {
                return <img src="/resources/remove_red_eye-24px.svg" />;
              },
              tooltip: "Mostrar reserva",
              onClick: (event, rowData) => {
                router.push(`/reservas/servicio/${rowData.IdServicioEscogido}`);
              }
            }
          ]}
        />
        <div className={styles.total_container} >
          <select
            onChange={(event) => {
              setCurrencyTotal(event.target.value);
            }}
            className={styles.moneda_select_container}
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
      </div>
      <div>
        <h3>Servicios para añadir</h3>
        <MaterialTable
          title={null}
          columns={[
            {
              field: "IdServicioProducto",
              title: "IdServicioProducto",
              editable: "never",
              hidden: true
            },
            {
              field: "TipoServicio",
              title: "Tipo de Servicio",
              editable: "never"
            },
            { field: "Nombre", title: "Nombre", editable: "never" },
            { title: "Nombre del Proveedor", field: "NombreProveedor" },
            { title: "Puntaje del Proveedor", field: "PuntajeProveedor" },
            { field: "Descripcion", title: "Descripcion", editable: "never" },
            {
              field: "Currency",
              title: "Moneda",
              editable: "never",
              lookup: { Dolar: "Dolares", Sol: "Nuevos Soles" }
            },
            {
              field: "Precio",
              title: "Precio Cotizacion",
              editable: "never",
              type: "numeric"
            },
            {
              field: "Costo",
              title: "Precio Confidencial",
              editable: "never",
              type: "numeric"
            },
            {
              field: "PrecioPublicado",
              title: "Precio Publicado",
              editable: "never",
              type: "numeric"
            }
          ]}
          data={props.ListaServiciosProductos}
          actions={[
            {
              icon: "add",
              tooltip: "Añadir Servicio a Cotizacion",
              onClick: async (event, rowData) => {
                let x = [...props.CotiServicio];
                x.push({
                  IdServicioProducto: rowData["IdServicioProducto"],
                  TipoServicio: rowData["TipoServicio"],
                  PrecioConfiUnitario: rowData["Costo"],
                  NombreServicio: rowData["Nombre"],
                  Dia: 1,
                  Cantidad: 1,
                  PrecioCotiUnitario: rowData["Precio"],
                  IGV: false,
                  PrecioCotiTotal: rowData["Precio"],
                  PrecioConfiTotal: rowData["Costo"],
                  Currency: rowData["Currency"],
                  PrecioPublicado: rowData["PrecioPublicado"]
                });
                await axios.post(
                  props.APIPatch + `/api/ServicioEscogido/CRUD/0`,
                  {
                    ServicioEscogido: {
                      IdServicioProducto: rowData["IdServicioProducto"],
                      TipoServicio: rowData["TipoServicio"],
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
                      IdReservaCotizacion: props.IdReservaCotizacion
                    }
                  }
                );
                let get_allServiciosEscogidos = await axios.get(
                  props.APIPatch +
                  `/api/reserva/DataServicio/${props.IdReservaCotizacion}`
                );
                props.setCotiServicio(
                  get_allServiciosEscogidos.data.AllServicioEscogido
                );
                // props.setCotiServicio(x);
                // let ActuDataTableServicios = [...DataTableServicios];
                // ActuDataTableServicios.splice(
                //   ActuDataTableServicios.findIndex((value) => {
                //     return value["IdServicio"] == rowData["IdServicio"];
                //   }),
                //   1
                // );
                // setDataTableServicios(ActuDataTableServicios);
              }
            }
          ]}
        />
      </div>
    </div>
  );
};
