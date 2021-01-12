//Paquetes
import React, { useEffect, useState, useContext, createContext } from "react";
import { useRouter } from "next/router";

//Componentes
import CampoTexto from "@/components/Formulario/CampoTexto/CampoTexto";
import CampoFecha from "@/components/Formulario/CampoFecha/CampoFecha";
import CampoGranTexto from "@/components/Formulario/CampoGranTexto/CampoGranTexto";
import Selector from "@/components/Formulario/Selector/Selector";
import CampoNumero from "@/components/Formulario/CampoNumero/CampoNumero";
import CampoMoney from "@/components/Formulario/CampoMoney/CampoMoney";
import BotonAnadir from "@/components/BotonAnadir/BotonAnadir";
import TablaSimple from "@/components/Formulario/TablaSimple/TablaSimple";
import TablaServicioCotizacion from "@/components/Formulario/CustomComponenteFormu/TablaServicioCotizacion/TablaServicioCotizacion";
import Loader from "@/components/Loading/Loading";

//Style
import styles from "../../styles/Cotizacion.module.css";
import MaterialTable from "material-table";

const Contexto = createContext([
  [{}, () => {}],
  [{}, () => {}],
  [{}, () => {}],
]);

const Cotizacion = ({ APIpath, APIpathGeneral }) => {
  //Funciones
  let DataNuevaEdit = {};
  const DarDatoFunction = (keyDato, Dato) => {
    DataNuevaEdit[keyDato] = Dato;
  };
  const DarDatoFunction_FechaIN = (keyDato, Dato) => {
    setFechaIN(Dato);
  };

  //State y variables
  const router = useRouter();
  const [DarDato, setDarDato] = useState(false);
  const [IdProgramaTuristico, setIdProgramaTuristico] = useState(""); // Evaluar si se va
  const [ReinciarComponentes, setReinciarComponentes] = useState(false);
  const [ProgramasTuristicos, setProgramasTuristicos] = useState([]);
  const [DataCotizacion, setDataCotizacion] = useState({});
  const [Servicios, setServicios] = useState([]);
  const [ListaServiciosProductos, setListaServiciosProductos] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Fase, setFase] = useState(1);
  const [FechaIN, setFechaIN] = useState("");

  const [TipoCliente, setTipoCliente] = useState(0);
  const [cliente, setcliente] = useState({});

  //Hooks
  useEffect(async () => {
    setLoading(true);
    await Promise.all([
      new Promise(async (resolve, reject) => {
        await fetch(APIpath + "/api/Cotizacion/ObtenerTodosPT/0")
          .then((r) => r.json())
          .then((data) => {
            console.log(data.AllProgramasTuristicos);
            setProgramasTuristicos(data.AllProgramasTuristicos);
            resolve();
          });
      }),
      new Promise(async (resolve, reject) => {
        await fetch(APIpath + "/api/Cotizacion/ObtenerTodosServicios")
          .then((r) => r.json())
          .then((data) => {
            setListaServiciosProductos(data.data);
            resolve();
          });
      }),
    ]);
    setLoading(false);
  }, []);
  useEffect(() => {
    if (ReinciarComponentes == true) {
      setReinciarComponentes(false);
    }
  }, [ReinciarComponentes]);
  useEffect(async () => {
    if (DarDato == true && Fase >= 3) {
      setLoading(true);
      let ClienteProspecto = cliente;
      let ServiciosEscogidos = [...DataNuevaEdit["Servicios"]];
      let ReservaCotizacion = DataNuevaEdit;

      // Formateo de datos de ReservaCotizacion
      delete ReservaCotizacion['Servicios'];
      ReservaCotizacion['FechaIN'] = FechaIN;
      ReservaCotizacion['Estado'] = 0;
      // Formateo de datos de ServiciosEscogidos

      //Formateo de datos de ClienteProspecto
      ClienteProspecto['Estado'] = 'Prospecto';
      switch (parseInt(TipoCliente)) {
        case 1 || '1':
          ClienteProspecto['TipoCliente'] = 'Corporativo'
          break;
          case 2 || '2':
            ClienteProspecto['TipoCliente'] = 'Directo'
          break;
      
        default:
          alert('Error, no hay tipo de cliente')
          return;
          break;
      }

      // envio dde datos a las apis
        
          await fetch(APIpath + "/api/Cotizacion/NuevaReservaCotizacion",{
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ReservaCotizacion:ReservaCotizacion,
              ServiciosEscogidos:ServiciosEscogidos,
              ClienteProspecto:ClienteProspecto
            })
          })
            .then((r) => r.json())
            .then((data) => {
              
            });
        
      // await Promise.all([
      //   new Promise(async (resolve, reject) => {
      //     await fetch(APIpath + "/api/Cotizacion/NuevoClienteProspecto",{
      //       method:'POST',
      //       headers:'',
      //       body: JSON.parse()
      //     })
      //       .then((r) => r.json())
      //       .then((data) => {
      //         console.log(data.AllProgramasTuristicos);
      //         setProgramasTuristicos(data.AllProgramasTuristicos);
      //         resolve();
      //       });
      //   }),
      //   new Promise(async (resolve, reject) => {
      //     await fetch(APIpath + "/api/Cotizacion/NuevosServicios")
      //       .then((r) => r.json())
      //       .then((data) => {
      //         setListaServiciosProductos(data.data);
      //         resolve();
      //       });
      //   }),
      //   new Promise(async (resolve, reject) => {
      //     await fetch(APIpath + "/api/Cotizacion/NuevaReservaCotizacion",{
      //       method:'POST',
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({ReservaCotizacion:ReservaCotizacion})
      //     })
      //       .then((r) => r.json())
      //       .then((data) => {
      //         console.log(data.AllProgramasTuristicos);
      //         setProgramasTuristicos(data.AllProgramasTuristicos);
      //         resolve();
      //       });
      //   }),
      // ]);

      console.log(DataNuevaEdit);
      setLoading(false);
    }

    // if (DarDato == true && Fase >= 4) {
    //   let Id = "";
    //   setDarDato(false);
    //   console.log(DataNuevaEdit);
    //   await fetch(APIpathGeneral, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       coleccion: "ReservaCotizacion",
    //       accion: "IdGenerator",
    //       keyId: "IdReservaCotizacion",
    //       Prefijo: "RC",
    //     }),
    //   })
    //     .then((r) => r.json())
    //     .then((data) => {
    //       Id = data.result;
    //     });
    //   console.log(Id);
    //   let servicios = [];
    //   await fetch(APIpathGeneral, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       coleccion: "Servicio",
    //       accion: "FindSome",
    //       keyId: "IdServicio",
    //       dataFound: DataNuevaEdit["Servicios"],
    //       projection: {},
    //     }),
    //   })
    //     .then((r) => r.json())
    //     .then((data) => {
    //       servicios = data.result;
    //     });
    //   servicios.map((element) => {
    //     delete element["_id"];
    //     element["IdServicioBase"] = element["IdServicio"];
    //     delete element["IdServicio"];
    //     element["IdReservaCotizacion"] = Id;
    //     element["FechaInicio"] = null;
    //     element["FechaFin"] = null;
    //     element["Estado"] = 0;
    //     // Datos para la reserva con los proveedores
    //     element["IdProducto"] = null;
    //     element["FechaCompra"] = null;
    //     element["FechaCompraReal"] = null;
    //     element["FechaLimitePago"] = null;
    //     switch (element["TipoServicio"]) {
    //       // case 'Hotel':
    //       //   element['OrdenServicio']={
    //       //     TipoOrden:'A',
    //       //     Observaciones:null,
    //       //     CodigoOrdenServicio:'',
    //       //     Estado:0
    //       //   }
    //       // break;
    //       case "Agencia":
    //         element["OrdenServicio"] = {
    //           TipoOrden: "A",
    //           Observaciones: null,
    //           CodigoOrdenServicio: "",
    //           Estado: 0,
    //         };
    //         break;
    //       case "Guia":
    //         element["OrdenServicio"] = {
    //           TipoOrden: "A",
    //           Observaciones: null,
    //           CodigoOrdenServicio: "",
    //           Estado: 0,
    //         };
    //         break;
    //       case "TransporteTerrestre":
    //         element["OrdenServicio"] = {
    //           TipoOrden: "C",
    //           Observaciones: null,
    //           CodigoOrdenServicio: "",
    //           Estado: 0,
    //         };
    //         break;
    //       case "Restaurante":
    //         element["OrdenServicio"] = {
    //           TipoOrden: "D",
    //           Observaciones: null,
    //           CodigoOrdenServicio: "",
    //           Estado: 0,
    //         };
    //         break;
    //       default:
    //         element["OrdenServicio"] = null;
    //         break;
    //     }
    //   });
    //   console.log(servicios);

    //   await fetch(APIpathGeneral, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       coleccion: "ServicioEscogido",
    //       accion: "InsertMany",
    //       keyId: "IdServicioEscogido",
    //       data: servicios,
    //       Prefijo: "SE",
    //     }),
    //   })
    //     .then((r) => r.json())
    //     .then((data) => {
    //       console.log(data.result);
    //     });
    //   let dataGuardar = DataNuevaEdit;
    //   delete dataGuardar["Servicios"];
    //   dataGuardar["Estado"] = 0;
    //   await fetch(APIpathGeneral, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       coleccion: "ReservaCotizacion",
    //       accion: "Insert",
    //       keyId: "IdReservaCotizacion",
    //       data: dataGuardar,
    //       Prefijo: "RC",
    //     }),
    //   })
    //     .then((r) => r.json())
    //     .then((data) => {
    //       console.log(data.result);
    //     });

    //   router.push("/reservas");
    // }
    
  }, [DarDato]);
  useEffect(async () => {
    if (
      IdProgramaTuristico == null ||
      IdProgramaTuristico == "" ||
      IdProgramaTuristico == "undefined"
    ) {
      return;
    }
    setLoading(true);
    // let DataProgramasTuristicos = [...ProgramasTuristicos]
    let ProgramaTuristSeleccionado = {};
    let ServiciosActu = [];
    await fetch(APIpath + "/api/Cotizacion/ObtenerUnPT/" + IdProgramaTuristico)
      .then((r) => r.json())
      .then((data) => {
        ProgramaTuristSeleccionado = data.result;
        ServiciosActu = data.result["ServicioProducto"];
      });
    // console.log(DataServicios)
    setFase(3);
    setDataCotizacion(ProgramaTuristSeleccionado);
    setServicios(ServiciosActu);
    setLoading(false);
  }, [IdProgramaTuristico]);
  useEffect(() => {
    if (TipoCliente == 1) {
      setLoading(true);

      setLoading(false);
    }
  }, [TipoCliente]);

  return (
    <div className={styles.ContenedorPrincipal}>
      <Contexto.Provider value={[[FechaIN, setFechaIN]]}>
        <Loader Loading={Loading} />
        <div className={styles.Formulario}>
          <div>
            <h2>Cotizacion</h2>
            {Fase >= 3 ? (
              <>
                <img
                  src="/resources/save-black-18dp.svg"
                  onClick={() => {
                    DataNuevaEdit = {};
                    setDarDato(true);
                    // ReiniciarData()
                  }}
                />
              </>
            ) : (
              <></>
            )}
          </div>

          <div>
            {Fase >= 1 ? (
              <>
                <div>
                  <div>
                    <span>Tipo del cliente</span>
                    <select
                      value={TipoCliente}
                      onChange={(event) => {
                        setTipoCliente(event.target.value);
                      }}
                    >
                      <option value={1}>Corporativo</option>
                      <option value={2}>Directo</option>
                      <option value={0}>Seleecione alguno</option>
                    </select>
                  </div>
                  {TipoCliente > 0 ? (
                    <>
                      {TipoCliente == 1 ? (
                        <>
                          <MaterialTable
                            title="Todos los Clientes corporativos"
                            columns={[{ field: "", title: "" }]}
                            data={[]}
                            actions={[]}
                          />
                        </>
                      ) : (
                        <></>
                      )}

                      <h3>Datos del Cotizante</h3>

                      <div>
                        <span>Nombre completo</span>
                        <input
                          value={cliente["NombreCompleto"]}
                          onChange={(event) => {
                            let temp_cliente = cliente;
                            temp_cliente["NombreCompleto"] = event.target.value;
                            setcliente(temp_cliente);
                          }}
                        />
                      </div>
                      <div>
                        <span>Tipo de documento</span>
                        <input
                          value={cliente["TipoDocumento"]}
                          onChange={(event) => {
                            let temp_cliente = cliente;
                            temp_cliente["TipoDocumento"] = event.target.value;
                            setcliente(temp_cliente);
                          }}
                        />
                      </div>
                      <div>
                        <span>Numero de documento</span>
                        <input
                          value={cliente["NroDocumento"]}
                          onChange={(event) => {
                            let temp_cliente = cliente;
                            temp_cliente["NroDocumento"] = event.target.value;
                            setcliente(temp_cliente);
                          }}
                        />
                      </div>
                      <div>
                        <span>Celular</span>
                        <input
                          value={cliente["Celular"]}
                          onChange={(event) => {
                            let temp_cliente = cliente;
                            temp_cliente["Celular"] = event.target.value;
                            setcliente(temp_cliente);
                          }}
                        />
                      </div>
                      <div>
                        <span>Email</span>
                        <input
                          value={cliente["Email"]}
                          onChange={(event) => {
                            let temp_cliente = cliente;
                            temp_cliente["Email"] = event.target.value;
                            setcliente(temp_cliente);
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <h3>Datos de cotizacion</h3>
                <CampoTexto
                  Title={"Nombre de Grupo"}
                  ModoEdicion={true}
                  DevolverDatoFunct={DarDatoFunction}
                  DarDato={DarDato}
                  KeyDato={"NombreGrupo"}
                  Dato={DataCotizacion.NombreGrupo}
                  Reiniciar={ReinciarComponentes}
                />
                <CampoTexto
                  Title={"Codigo de Grupo"}
                  ModoEdicion={true}
                  DevolverDatoFunct={DarDatoFunction}
                  DarDato={DarDato}
                  KeyDato={"CodGrupo"}
                  Dato={DataCotizacion.CodGrupo}
                  Reiniciar={ReinciarComponentes}
                />
                <CampoNumero
                  Title={"Numero de Pasajeros Adultos"}
                  ModoEdicion={true}
                  DevolverDatoFunct={DarDatoFunction}
                  DarDato={DarDato}
                  KeyDato={"Npasajeros"}
                  Dato={DataCotizacion.NPasajerosAdult}
                  Reiniciar={ReinciarComponentes}
                  InputStep="1"
                />
                <CampoNumero
                  Title={"Numero de Pasajeros Niños o Infantes"}
                  ModoEdicion={true}
                  DevolverDatoFunct={DarDatoFunction}
                  DarDato={DarDato}
                  KeyDato={"Npasajeros"}
                  Dato={DataCotizacion.NPasajerosInfante}
                  Reiniciar={ReinciarComponentes}
                  InputStep="1"
                />
                <div>
                  <span>Fecha de Inicio</span>
                  <input
                    value={FechaIN}
                    type={"date"}
                    onChange={(event) => {
                      setFechaIN(event.target.value);
                    }}
                  />
                </div>
                <CampoFecha
                  Title={"Fecha de Fin"}
                  ModoEdicion={true}
                  DevolverDatoFunct={DarDatoFunction}
                  DarDato={DarDato}
                  KeyDato={"FechaOUT"}
                  // Dato={DataCotizacion.FechaOUT}
                  Dato={DataCotizacion.FechaOUT}
                  Reiniciar={ReinciarComponentes}
                />
                {Fase == 1 ? (
                  <>
                    <button
                      onClick={(event) => {
                        event.currentTarget.disabled = true;
                        if (FechaIN == "" || TipoCliente == 0) {
                          alert(
                            "Debe de ingresar al menos FechaIN y seleccionar un tipo de cliente"
                          );
                          event.currentTarget.disabled = false;
                        } else {
                          // setDarDato(true);
                          setFase(2);
                        }
                      }}
                    >
                      Siguiente
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
            {Fase == 2 ? (
              <>
                <MaterialTable
                  title={"Seleccione un programa turistico"}
                  columns={[
                    {
                      field: "IdProgramaTuristico",
                      title: "IdProgramaTuristico",
                      hidden: true,
                    },
                    { field: "NombrePrograma", title: "Nombre" },
                    { field: "CodigoPrograma", title: "Codigo" },
                    { field: "Localizacion", title: "Localizacion" },
                  ]}
                  data={ProgramasTuristicos}
                  actions={[
                    {
                      icon: "check",
                      tooltip: "Seleccion programa turistico",
                      onClick: (event, rowData) => {
                        setIdProgramaTuristico(rowData["IdProgramaTuristico"]);
                      },
                    },
                  ]}
                />
              </>
            ) : (
              <></>
            )}
          </div>
          {Fase >= 3 ? (
            <>
              <div className={styles.DatosContenedor} id="ContData">
                <TablaServicioCotizacion
                  Title={"Servicio/Productos"}
                  DevolverDatoFunct={DarDatoFunction}
                  DarDato={DarDato}
                  KeyDato={"Servicios"}
                  Dato={Servicios}
                  ListaServiciosProductos={ListaServiciosProductos}
                  Reiniciar={ReinciarComponentes}
                  FechaIN={FechaIN}
                />
                <CampoGranTexto
                  Title={"Descripcion del Programa turistico"}
                  ModoEdicion={true}
                  DevolverDatoFunct={DarDatoFunction}
                  DarDato={DarDato}
                  KeyDato={"Descripcion"}
                  Dato={DataCotizacion.Descripcion}
                  Reiniciar={ReinciarComponentes}
                />
                <TablaSimple
                  Title={"Itinierario"}
                  ModoEdicion={true}
                  DevolverDatoFunct={DarDatoFunction}
                  DarDato={DarDato}
                  KeyDato={"Itinerario"}
                  Dato={DataCotizacion.Itinerario || []}
                  Reiniciar={ReinciarComponentes}
                  columnas={[
                    { field: "Hora Inicio", title: "HoraInicio", type: "time" },
                    { field: "Hora Fin", title: "HoraFin", type: "time" },
                    { field: "Actividad", title: "Actividad" },
                  ]}
                />
                <TablaSimple
                  Title={"Incluye"}
                  ModoEdicion={true}
                  DevolverDatoFunct={DarDatoFunction}
                  DarDato={DarDato}
                  KeyDato={"Incluye"}
                  Dato={DataCotizacion.Incluye || []}
                  Reiniciar={ReinciarComponentes}
                  columnas={[{ field: "Actividad", title: "Actividad" }]}
                />
                <TablaSimple
                  Title={"No Incluye"}
                  ModoEdicion={true}
                  DevolverDatoFunct={DarDatoFunction}
                  DarDato={DarDato}
                  KeyDato={"NoIncluye"}
                  Dato={DataCotizacion.NoIncluye || []}
                  Reiniciar={ReinciarComponentes}
                  columnas={[{ field: "Actividad", title: "Actividad" }]}
                />
                <TablaSimple
                  Title={"Recomendaciones para llevar"}
                  ModoEdicion={true}
                  DevolverDatoFunct={DarDatoFunction}
                  DarDato={DarDato}
                  KeyDato={"RecomendacionesLlevar"}
                  Dato={DataCotizacion.RecomendacionesLlevar || []}
                  Reiniciar={ReinciarComponentes}
                  columnas={[
                    { field: "Recomendacion", title: "Recomendacion" },
                  ]}
                />
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </Contexto.Provider>
    </div>
  );
};

export async function getStaticProps() {
  const APIpath = process.env.API_DOMAIN;
  // const APIpathGeneral = process.env.API_DOMAIN + "/api/general";

  return {
    props: {
      APIpath: APIpath,
      // APIpathGeneral: APIpathGeneral,
    },
  };
}
export default Cotizacion;

// componentes

const CampoFecha_custom = (
  props = {
    Title: "Nombre del Proveedor",
  }
) => {
  const [[FechaIN, setFechaIN]] = useContext(Contexto);
  return <></>;
};
