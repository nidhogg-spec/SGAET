import React, { useState, useEffect,useRef } from "react";
import Link from 'next/link'
import { useRouter } from "next/router";
// import styles from '..'

//Componentes
import AutoFormulario_v2 from "@/components/Formulario_V2/AutoFormulario/AutoFormulario";
import Loader from "@/components/Loading/Loading";
import MaterialTable from "material-table";
import axios from "axios";
import Cotizacion from "../Cotizacion";

const ReservaCotizacion = ({ APIPatch }) => {
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
  const [MontoTotal, setMontoTotal] = useState(0);
  const [CambioDolar, setCambioDolar] = useState(0);

  const refEstado = useRef(null)
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
            setReservaCotizacion(data.ReservaCotizacion);
            setClienteCotizacion(data.ClienteProspecto);
            if (data.ReservaCotizacion["Estado"]) {
              setEstado(data.ReservaCotizacion["Estado"]);
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
        let temp_cambio = await axios.post(APIPatch + '/api/DataSistema',{
          accion: "ObtenerCambioDolar",
        });
        setCambioDolar(temp_cambio.data['value']);
        resolve();
      }),
    ]);
    setLoading(false);
  }, []);

  // -----------------------------------------------------------------------
  const CalcularTotal = () =>{
    let temp_MontoTotal = 0;
    let CurrencyTotal = 'Sol'
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
                temp_MontoTotal += parseFloat(uni_CotiServi["PrecioCotiTotal"]) * CambioDolar;
                break;
              case "Sol":
                temp_MontoTotal += parseFloat(uni_CotiServi["PrecioCotiTotal"]);
                break;
            }
          });
          break;
      }
    }
    return [temp_MontoTotal]
  }

  //-----------------Funcionamiento de tabla devolucion --------------------
  const [Devolucion, setDevolucion] = useState([]);
  const callback_create = () =>{

  }
  const callback_delete = () =>{
    
  }
  const callback_update = () =>{
    
  }


  return (
    <>
      <Loader Loading={Loading} />
      <h3>Datos de Reserva</h3>
      {ModoEdicion ? (
          <>
          <button>
            <img
              src="/resources/save-black-18dp.svg"
              onClick={async () => {
                setLoading(true);
                await Promise.all([
                  new Promise(async (resolve, reject) => {
                    let temp_ServiciosEscogidos=[...ServiciosEscogidos];
                    temp_ServiciosEscogidos.map(Servi=>{
                      Servi['IdReservaCotizacion'] = IdReservaCotizacion;
                    })
                    await axios.put(APIPatch+'/api/reserva/DataServicio/CRUD',{
                      ServicioEscogido:temp_ServiciosEscogidos,
                      Accion:'UpdateMany'
                    })
                    resolve();
                  }),
                  new Promise(async (resolve, reject) => {
                    await axios.post(APIPatch+'/api/reserva/DataReserva/CRUDReservaCotizacion',{
                      data:ReservaCotizacion,
                      idProducto: IdReservaCotizacion,
                      accion:'update'
                    })
                    resolve();
                  }),
                ])
                setLoading(false);
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
      <button
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
      <select value={Estado} ref={refEstado} onChange={async()=>{
        setLoading(true)
        let Estado_val = parseInt(refEstado.current.value)
        if(Estado_val>Estado){
          if(confirm('Esta seguro de cambiar de estado?')){
            setEstado(Estado_val);
            await axios.post(APIPatch+'/api/reserva/DataReserva/CRUDReservaCotizacion',{
              data:{Estado:Estado_val},
              idProducto: IdReservaCotizacion,
              accion:'update'
            })
            if(Estado_val==3){
              await Promise.all([
                // new Promise(async (resolve, reject) => {
                //   await axios.post(APIPatch+'/api/reserva/DataReserva/CRUDReservaCotizacion',{
                //     data:{Estado:refEstado.current.value},
                //     idProducto: IdReservaCotizacion,
                //     accion:'update'
                //   })
                // }),
                new Promise(async (resolve, reject) => {
                  const [temp_MontoTotal] =CalcularTotal()
                  await axios.post(APIPatch + '/api/finanzas/ingresos',{
                    accion:'create',
                    data:{
                      Npasajeros:(ReservaCotizacion['NpasajerosAdult']||0) + (ReservaCotizacion['NpasajerosChild']||0),
                      Total:temp_MontoTotal,
                      TotalNeto:0,
                      Comision:0,
                      Adelanto:0,
                      AdelantoNeto:0
                    },
                  })
                  resolve();
                }),
              ])
              
            }
          }
        }
        setLoading(false)
      }}>
        <option value={0}>Cotizacion</option>
        <option value={1}>Reserva sin confirmar</option>
        <option value={2}>Reserva confirmada</option>
        <option value={3}>Reserva pagada</option>
      </select>
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
                      KeyDato: "CodGrupo",
                    },
                    {
                      tipo: "texto",
                      Title: "Nombre de Grupo",
                      KeyDato: "NombreGrupo",
                    },
                    {
                      tipo: "numero",
                      Title: "Numero de pasajeros",
                      KeyDato: "Npasajeros",
                    },
                    {
                      tipo: "fecha",
                      Title: "Fecha IN",
                      KeyDato: "FechaIN",
                    },
                    {
                      tipo: "fecha",
                      Title: "Fecha OUT",
                      KeyDato: "FechaOUT",
                    },
                    {
                      tipo: "texto",
                      Title: "Voucher",
                      KeyDato: "Voucher",
                    },
                    {
                      tipo: "texto",
                      Title: "Idioma",
                      KeyDato: "Idioma",
                    },
                    {
                      tipo: "fecha",
                      Title: "Fecha de entrega voucher",
                      KeyDato: "FechaEntrega",
                    },
                    {
                      tipo: "money",
                      Title: "Precio",
                      KeyDato: "precio",
                    },
                  ],
                },
              ],
            }}
            ModoEdicion={ModoEdicion}
            Dato={ReservaCotizacion}
            setDato={setReservaCotizacion}
            key={"AF_ReserCoti"}
          />
        </div>
        <div>
          <h3>LLenado de Pasajeros</h3>
          <div>
            <input
              value={`http://localhost:3000/LlenadoPasajeros/${IdReservaCotizacion}`}
              disabled
            />
            <Link href={`http://localhost:3000/LlenadoPasajeros/${IdReservaCotizacion}`}>
              <button><a >Llenar Lista de Pasajeros</a></button> 
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
                      KeyDato: "NombreCompleto",
                    },
                    {
                      tipo: "selector",
                      Title: "Tipo de Documento",
                      KeyDato: "TipoDocumento",
                      SelectOptions: [
                        { value: 0, texto: "DNI" },
                        { value: 1, texto: "RUC" },
                        { value: 2, texto: "Pasaporte" },
                        { value: 3, texto: "Carné de Extranjería" },
                      ],
                    },
                    {
                      tipo: "texto",
                      Title: "Nro de Documento",
                      KeyDato: "NroDocumento",
                    },
                    {
                      tipo: "texto",
                      Title: "Celular Principal",
                      KeyDato: "Celular",
                    },
                    {
                      tipo: "texto",
                      Title: "Email Principal",
                      KeyDato: "Email",
                    },
                  ],
                },
              ],
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
            Title="Servicios/Productos de la reserva"
            setCotiServicio={setServiciosEscogidos}
            CotiServicio={ServiciosEscogidos || []}
            ListaServiciosProductos={AllServiciosProductos || []}
            FechaIN={ReservaCotizacion["FechaIN"]}
            setMontoTotal={setMontoTotal}
          />
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  let APIPatch = process.env.API_DOMAIN;

  return {
    props: {
      APIPatch: APIPatch,
    },
  };
}

export default ReservaCotizacion;

const TablaServicioCotizacion = (
  props = {
    Title: "Nombre del Proveedor",
    setCotiServicio: () => {},
    CotiServicio: [],
    ListaServiciosProductos: [],
    FechaIN,
    setMontoTotal,
    // columnas:[]
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
                temp_MontoTotal += parseFloat(uni_CotiServi["PrecioCotiTotal"]) * CambioDolar;
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
              editable: "always",
              type: "numeric",
            },
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
                  Object.entries(cambios).map((cambio) => {
                    let temp_CotiServicio = [...props.CotiServicio];
                    let temp_newData = cambio[1]["newData"];
                    let id = temp_newData["tableData"]["id"];

                    temp_CotiServicio[id]["Cantidad"] = temp_newData["Cantidad"];
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
