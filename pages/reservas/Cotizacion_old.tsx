//Paquetes
import React, { useEffect, useState, useContext, createContext } from "react";
import { useRouter } from "next/router";
import MaterialTable from "material-table";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/config";

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
import styles from "@/globalStyles/Cotizacion.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import globalStyles from "@/globalStyles/modules/global.module.css";
import {
  clienteProspectoInterface,
  programaTuristicoInterface,
  reservaCotizacionInterface
} from "@/utils/interfaces/db";
// import Cotizacion_defCliente from "@/components/ComponentesUnicos/Reservas/Fase_1";
import { GetServerSideProps } from "next";

interface Props {
  APIpath: string;
  APIpathGeneral: string;
}

const Contexto = createContext([
  [{}, () => {}],
  [{}, () => {}],
  [{}, () => {}]
]);

const Cotizacion = ({ APIpath, APIpathGeneral }: Props) => {
  //State y variables
  const router = useRouter();
  const [IdProgramaTuristico, setIdProgramaTuristico] = useState(""); // Evaluar si se va
  const [ReinciarComponentes, setReinciarComponentes] = useState(false);
  const [ProgramasTuristicos, setProgramasTuristicos] = useState([]);
  const [MostrarClientesCorporativos, setMostrarClientesCorporativos] =
    useState([]);
  const [Servicios, setServicios] = useState([]);
  const [dataGeneralProgramaTuristico, setDataGeneralProgramaTuristico] =
    useState<programaTuristicoInterface>({} as any);
  const [ListaServiciosProductos, setListaServiciosProductos] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Fase, setFase] = useState(1);
  const [FechaIN, setFechaIN] = useState("");
  const [TipoCliente, setTipoCliente] = useState(0);
  const [cliente, setcliente] = useState<clienteProspectoInterface>(
    {} as clienteProspectoInterface
  );

  const [Cotizacion, setCotizacion] = useState({});

  //Hooks
  //@ts-ignore
  useEffect(async () => {
    setLoading(true);
    await Promise.all([
      new Promise<void>(async (resolve, reject) => {
        await fetch(APIpath + "/api/Cotizacion/ObtenerTodosPT/0")
          .then((r) => r.json())
          .then((data) => {
            console.log(data.AllProgramasTuristicos);
            setProgramasTuristicos(data.AllProgramasTuristicos);
            resolve();
          });
      }),
      new Promise<void>(async (resolve, reject) => {
        await fetch(APIpath + "/api/Cotizacion/ObtenerTodosServicios")
          .then((r) => r.json())
          .then((data) => {
            setListaServiciosProductos(data.data);
            resolve();
          });
      }),
      new Promise<void>(async (resolve, reject) => {
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
      let ClienteProspecto: clienteProspectoInterface =
        cliente as clienteProspectoInterface;
      // let ServiciosEscogidos = [...DataNuevaEdit["Servicios"]];
      // let ReservaCotizacion = DataNuevaEdit;

      let ServiciosEscogidos = [...Servicios];
      let ReservaCotizacion: reservaCotizacionInterface = {
        ...Cotizacion
      } as reservaCotizacionInterface;

      // Formateo de datos de ReservaCotizacion
      //@ts-ignore
      delete ReservaCotizacion["Servicios"];
      ReservaCotizacion["FechaIN"] = FechaIN;
      ReservaCotizacion["Estado"] = 0;
      ReservaCotizacion["NumPaxTotal"] =
        parseInt(ReservaCotizacion.NpasajerosAdult.toString()) +
        parseInt(ReservaCotizacion.NpasajerosChild.toString());
      // Formateo de datos de ServiciosEscogidos

      //Formateo de datos de ClienteProspecto
      ClienteProspecto["Estado"] = "Prospecto";
      switch (parseInt(TipoCliente.toString())) {
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
  //@ts-ignore
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
    <div className={globalStyles.main_work_space_container}>
      <Contexto.Provider value={[[FechaIN, setFechaIN]]}>
        <Loader Loading={Loading} />
        <div>
          <div className={styles.Formulario}>
            <h1>Generacion de nueva reserva/cotizacion</h1>
            {/* <Cotizacion_defCliente
              open={false}
              setOpen={() => {}}
              fase={Fase}
              setFase={setFase}
              clienteProspecto={cliente}
              setClienteProspecto={setcliente as any}
            /> */}
            {Fase == 2 && (
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
                      onClick: (event, rowData: any) => {
                        setIdProgramaTuristico(rowData["IdProgramaTuristico"]);
                      }
                    }
                  ]}
                />
              </>
            )}
            {Fase >= 3 ? (
              <>
                <button
                  className={`${botones.button} ${botones.buttonGuardar}`}
                >
                  Guardar
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

          <div className={styles.Formulario}></div>

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
                  setDato={setServicios as any}
                  ListaServiciosProductos={ListaServiciosProductos}
                  Reiniciar={ReinciarComponentes}
                  FechaIN={FechaIN}
                />
                <CampoGranTexto
                  Title={"Descripcion del Programa turistico"}
                  ModoEdicion={true}
                  setDato={setCotizacion as any}
                  Dato={Cotizacion}
                  KeyDato={"Descripcion"}
                  Reiniciar={false}
                />
                <TablaSimple
                  Title={"Itinierario"}
                  ModoEdicion={true}
                  setDato={setCotizacion}
                  Dato={Cotizacion}
                  KeyDato={"Itinerario"}
                  columnas={
                    [
                      {
                        field: "Dia",
                        title: "Dia",
                        type: "numeric"
                      },
                      {
                        field: "Hora Inicio",
                        title: "HoraInicio",
                        type: "time"
                      },
                      { field: "Hora Fin", title: "HoraFin", type: "time" },
                      { field: "Actividad", title: "Actividad" }
                    ] as never[]
                  }
                  Reiniciar={false}
                />
                <CampoGranTexto
                  Title={"Descripcion de Itinerario"}
                  ModoEdicion={true}
                  setDato={setCotizacion as any}
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
                  columnas={
                    [{ field: "Actividad", title: "Actividad" }] as never[]
                  }
                  Reiniciar={false}
                />
                <TablaSimple
                  Title={"No Incluye"}
                  ModoEdicion={true}
                  setDato={setCotizacion}
                  Dato={Cotizacion}
                  KeyDato={"NoIncluye"}
                  columnas={
                    [{ field: "Actividad", title: "Actividad" }] as never[]
                  }
                  Reiniciar={false}
                />
                <TablaSimple
                  Title={"Recomendaciones para llevar"}
                  ModoEdicion={true}
                  setDato={setCotizacion}
                  Dato={Cotizacion}
                  KeyDato={"RecomendacionesLlevar"}
                  columnas={
                    [
                      { field: "Recomendacion", title: "Recomendacion" }
                    ] as never[]
                  }
                  Reiniciar={false}
                />
              </div>
              {Fase >= 3 ? (
                <>
                  <div className={`${styles.button_container}`}>
                    <button
                      className={`${botones.button} ${botones.buttonGuardar} `}
                    >
                      Guardar
                      <img
                        src="/resources/save-black-18dp.svg"
                        onClick={HandleSave}
                      />
                    </button>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </Contexto.Provider>
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

    const APIpath = process.env.API_DOMAIN;
    // const APIpathGeneral = process.env.API_DOMAIN + "/api/general";

    return {
      props: {
        APIpath: APIpath
        // APIpathGeneral: APIpathGeneral,
      }
    };
  },
  ironOptions
);

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
