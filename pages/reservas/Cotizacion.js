//Paquetes
import React, { useEffect, useState, useContext, createContext } from "react";
import { useRouter } from "next/router";
import { withSSRContext } from 'aws-amplify'
//Componentes

import CampoTexto from "@/components/Formulario_V2/CampoTexto/CampoTexto";
import CampoFecha from "@/components/Formulario_V2/CampoFecha/CampoFecha";
import CampoGranTexto from "@/components/Formulario_V2/CampoGranTexto/CampoGranTexto";
// import Selector from "@/components/Formulario/Selector/Selector";
import CampoNumero from "@/components/Formulario_V2/CampoNumero/CampoNumero";
// import CampoMoney from "@/components/Formulario/CampoMoney/CampoMoney";
// import BotonAnadir from "@/components/BotonAnadir/BotonAnadir";
import TablaSimple from "@/components/Formulario_V2/TablaSimple/TablaSimple";
import TablaServicioCotizacion from "@/components/Formulario/CustomComponenteFormu/TablaServicioCotizacion/TablaServicioCotizacion";

import Loader from "@/components/Loading/Loading";
//Style
import styles from "../../styles/Cotizacion.module.css";
import MaterialTable from "material-table";
import axios from "axios";

const Contexto = createContext([
  [{}, () => {}],
  [{}, () => {}],
  [{}, () => {}]
]);

const Cotizacion = ({ APIpath, APIpathGeneral }) => {
  //State y variables
  const router = useRouter();
  const [IdProgramaTuristico, setIdProgramaTuristico] = useState(""); // Evaluar si se va
  const [ReinciarComponentes, setReinciarComponentes] = useState(false);
  const [ProgramasTuristicos, setProgramasTuristicos] = useState([]);
  const [
    MostrarClientesCorporativos,
    setMostrarClientesCorporativos
  ] = useState([]);
  const [Servicios, setServicios] = useState([]);
  const [
    dataGeneralProgramaTuristico,
    setDataGeneralProgramaTuristico
  ] = useState({});
  const [ListaServiciosProductos, setListaServiciosProductos] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Fase, setFase] = useState(1);
  const [FechaIN, setFechaIN] = useState("");
  const [TipoCliente, setTipoCliente] = useState(0);
  const [cliente, setcliente] = useState({});

  const [Cotizacion, setCotizacion] = useState({});

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
      new Promise(async (resolve, reject) => {
        await fetch(APIpath + "/api/Cotizacion/ObtenerClientesCorporativos")
          .then((r) => r.json())
          .then((data) => {
            setMostrarClientesCorporativos(data.data);
            resolve();
          });
      })
    ]);
    setLoading(false);
  }, []);
  useEffect(() => {
    if (ReinciarComponentes == true) {
      setReinciarComponentes(false);
    }
  }, [ReinciarComponentes]);
  const HandleSave = async () => {
    if (Fase >= 3) {
      setLoading(true);
      let ClienteProspecto = cliente;
      // let ServiciosEscogidos = [...DataNuevaEdit["Servicios"]];
      // let ReservaCotizacion = DataNuevaEdit;

      let ServiciosEscogidos = [...Servicios];
      let ReservaCotizacion = { ...Cotizacion };

      // Formateo de datos de ReservaCotizacion
      delete ReservaCotizacion["Servicios"];
      ReservaCotizacion["FechaIN"] = FechaIN;
      ReservaCotizacion["Estado"] = 0;
      ReservaCotizacion["NumPaxTotal"] =
        parseInt(ReservaCotizacion.NpasajerosAdult) +
        parseInt(ReservaCotizacion.NpasajerosChild);
      // Formateo de datos de ServiciosEscogidos

      //Formateo de datos de ClienteProspecto
      ClienteProspecto["Estado"] = "Prospecto";
      switch (parseInt(TipoCliente)) {
        case 1 || "1":
          ClienteProspecto["TipoCliente"] = "Corporativo";
          ReservaCotizacion["IdClienteProspecto"] =
            ClienteProspecto["IdClienteProspecto"];
          break;
        case 2 || "2":
          ClienteProspecto["TipoCliente"] = "Directo";
          break;

        default:
          alert("Error, no hay tipo de cliente");
          return;
          break;
      }

      // envio dde datos a las apis
      let result = await axios.post(
        APIpath + "/api/Cotizacion/NuevaReservaCotizacion",
        {
          ReservaCotizacion: ReservaCotizacion,
          ServiciosEscogidos: ServiciosEscogidos,
          ClienteProspecto: ClienteProspecto
        }
      );
      console.log(result.data.message);
      router.push("/reservas/ListaCotizacion");
      setLoading(false);
    }
  };
  useEffect(async () => {
    if (
      IdProgramaTuristico == null ||
      IdProgramaTuristico == "" ||
      IdProgramaTuristico == "undefined"
    ) {
      return;
    }
    setLoading(true);
    console.log(IdProgramaTuristico);
    let result = await axios.get(
      APIpath + "/api/Cotizacion/ObtenerUnPT/" + IdProgramaTuristico
    );
    let ProgramaTuristSeleccionado = result.data.result;
    let ServiciosActu = result.data.result["ServicioProducto"];

    setFase(3);
    setServicios(ServiciosActu);
    setCotizacion({ ...Cotizacion, ...ProgramaTuristSeleccionado });
    setDataGeneralProgramaTuristico(ProgramaTuristSeleccionado);
    setLoading(false);
  }, [IdProgramaTuristico]);

  return (
    <div className={styles.ContenedorPrincipal}>
      <Contexto.Provider value={[[FechaIN, setFechaIN]]}>
        <Loader Loading={Loading} />
        <div className={styles.Formulario}>
          <div>
            <h2>Cotizacion</h2>
            {Fase >= 3 ? (
              <>
                <button>
                  <img
                    src="/resources/save-black-18dp.svg"
                    onClick={HandleSave}
                  />
                </button>
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
                        if (event.target.value == 2) setcliente({});
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
                            columns={[
                              {
                                title: "Nombre Completo",
                                field: "NombreCompleto"
                              },
                              {
                                title: "Tipo Documento",
                                field: "TipoDocumento"
                              },
                              {
                                title: "Numero de Documento",
                                field: "NroDocumento"
                              },
                              { title: "Celular", field: "Contacto[0].Numero" },
                              { title: "Email", field: "Contacto[0].Email" }
                            ]}
                            data={MostrarClientesCorporativos}
                            actions={[
                              {
                                icon: "check",
                                tooltip: "Seleccione Cliente Corporativo",
                                onClick: (event, rowData) => {
                                  //console.log(cliente)
                                  if (rowData.Contacto == undefined) {
                                    rowData.Celular = "";
                                    rowData.Email = "";
                                  } else {
                                    rowData.Celular =
                                      rowData.Contacto[0].Numero;
                                    rowData.Email = rowData.Contacto[0].Email;
                                  }
                                  setcliente(rowData);
                                }
                              }
                            ]}
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
                          disabled={TipoCliente==1?true:false}                          
                        />
                      </div>
                      <div>
                        <span>Tipo de documento</span>
                        <select
                          onChange={(event) => {
                            let temp_cliente = cliente;
                            temp_cliente["TipoDocumento"] = event.target.value;
                            setcliente(temp_cliente);
                          }}
                          disabled={TipoCliente==1?true:false}
                        >
                          <option value={null}>Seleccione Documento</option>
                          <option value={cliente["DNI"]}>DNI</option>
                          <option value={cliente["Pasaporte"]}>
                            Pasaporte
                          </option>
                          <option value={cliente["CarneExtranjeria"]}>
                            Carne de Extranjeria
                          </option>
                        </select>
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
                          disabled={TipoCliente==1?true:false}
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
                          disabled={TipoCliente==1?true:false}
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
                          disabled={TipoCliente==1?true:false}
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
                  setDato={setCotizacion}
                  Dato={Cotizacion}
                  KeyDato={"NombreGrupo"}
                />
                <CampoTexto
                  Title={"Codigo de Grupo"}
                  ModoEdicion={true}
                  setDato={setCotizacion}
                  Dato={Cotizacion}
                  KeyDato={"CodGrupo"}
                />
                <CampoNumero
                  Title={"Numero de Pasajeros Adultos"}
                  ModoEdicion={true}
                  setDato={setCotizacion}
                  Dato={Cotizacion}
                  KeyDato={"NpasajerosAdult"}
                  InputStep="1"
                />
                <CampoNumero
                  Title={"Numero de Pasajeros Niños o Infantes"}
                  ModoEdicion={true}
                  setDato={setCotizacion}
                  Dato={Cotizacion}
                  KeyDato={"NpasajerosChild"}
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
                  ModoEdicion={false}
                  setDato={setCotizacion}
                  Dato={Cotizacion}
                  KeyDato={"FechaOUT"}
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
                      hidden: true
                    },
                    { field: "NombrePrograma", title: "Nombre" },
                    { field: "CodigoPrograma", title: "Codigo" },
                    { field: "Localizacion", title: "Localizacion" }
                  ]}
                  data={ProgramasTuristicos}
                  actions={[
                    {
                      icon: "check",
                      tooltip: "Seleccion programa turistico",
                      onClick: (event, rowData) => {
                        setIdProgramaTuristico(rowData["IdProgramaTuristico"]);
                      }
                    }
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
                <h2>{dataGeneralProgramaTuristico.NombrePrograma}</h2>
                <p>{dataGeneralProgramaTuristico.Descripcion}</p>
                <span>
                  Duracion Dias : {dataGeneralProgramaTuristico.DuracionDias}
                </span>
                <br></br>
                <span>
                  Duracion Noches : {dataGeneralProgramaTuristico.DuracionNoche}
                </span>
                <br></br>
                {/* <span>
                  Precio Estandar: {dataGeneralProgramaTuristico.PrecioEstandar}
                </span> */}
                <TablaServicioCotizacion
                  Title={"Servicio/Productos"}
                  // KeyDato={"Servicios"}
                  Dato={Servicios}
                  setDato={setServicios}
                  ListaServiciosProductos={ListaServiciosProductos}
                  Reiniciar={ReinciarComponentes}
                  FechaIN={FechaIN}
                />
                <CampoGranTexto
                  Title={"Descripcion del Programa turistico"}
                  ModoEdicion={true}
                  setDato={setCotizacion}
                  Dato={Cotizacion}
                  KeyDato={"Descripcion"}
                />
                <TablaSimple
                  Title={"Itinierario"}
                  ModoEdicion={true}
                  setDato={setCotizacion}
                  Dato={Cotizacion}
                  KeyDato={"Itinerario"}
                  columnas={[
                    {
                      field: "Dia",
                      title: "Dia",
                      type: "numeric"
                    },
                    { field: "Hora Inicio", title: "HoraInicio", type: "time" },
                    { field: "Hora Fin", title: "HoraFin", type: "time" },
                    { field: "Actividad", title: "Actividad" }
                  ]}
                />
                <CampoGranTexto
                  Title={"Descripcion de Itinerario"}
                  ModoEdicion={true}
                  setDato={setCotizacion}
                  Dato={Cotizacion}
                  KeyDato={"ItinerarioDescripcion"}
                  Reiniciar={ReinciarComponentes}
                />
                <TablaSimple
                  Title={"Incluye"}
                  ModoEdicion={true}
                  setDato={setCotizacion}
                  Dato={Cotizacion}
                  KeyDato={"Incluye"}
                  columnas={[{ field: "Actividad", title: "Actividad" }]}
                />
                <TablaSimple
                  Title={"No Incluye"}
                  ModoEdicion={true}
                  setDato={setCotizacion}
                  Dato={Cotizacion}
                  KeyDato={"NoIncluye"}
                  columnas={[{ field: "Actividad", title: "Actividad" }]}
                />
                <TablaSimple
                  Title={"Recomendaciones para llevar"}
                  ModoEdicion={true}
                  setDato={setCotizacion}
                  Dato={Cotizacion}
                  KeyDato={"RecomendacionesLlevar"}
                  columnas={[
                    { field: "Recomendacion", title: "Recomendacion" }
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

export async function getServerSideProps({ req, res }) {
  const APIpath = process.env.API_DOMAIN;
  const { Auth } = withSSRContext({ req })
  try {
    const user = await Auth.currentAuthenticatedUser()
  } catch (err) {
    res.writeHead(302, { Location: '/' })
    res.end()
  }
  // const APIpathGeneral = process.env.API_DOMAIN + "/api/general";

  return {
    props: {
      APIpath: APIpath
      // APIpathGeneral: APIpathGeneral,
    }
  };
}
export default Cotizacion;

// componentes

const CampoFecha_custom = (
  props = {
    Title: "Nombre del Proveedor"
  }
) => {
  const [[FechaIN, setFechaIN]] = useContext(Contexto);
  return <></>;
};
