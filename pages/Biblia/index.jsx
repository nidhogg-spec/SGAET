import React, { useState, useEffect } from "react";
import { generarLog } from "@/utils/functions/generarLog";

import MaterialTable from "material-table";
import Loader from "@/components/Loading/Loading";
import Equipo from "@/components/ComponentesUnicos/Biblia/Equipo/Equipo";
import Observacion from "@/components/ComponentesUnicos/Biblia/Observacion/Observacion";

//CSS
import global_style from "@/globalStyles/modules/global.module.css";
import styles from "@/globalStyles/Biblia.module.css";

import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/config";
import axios from "axios";
import ModalPasajeros from "@/components/ComponentesUnicos/Biblia/Pasajeros/ModalPasajero";
import botones from "@/globalStyles/modules/boton.module.css";
import { useRouter } from "next/router";

const columnasReserva = [
  { title: "Id", field: "IdReservaCotizacion", hidden: true },
  { title: "Nombre de Grupo", field: "NombreGrupo" },
  { title: "Codigo de Grupo", field: "CodGrupo" },
  { title: "Nombre del programa", field: "NombrePrograma" },
  { title: "Tipo", field: "Tipo" },
  { title: "Fecha IN", field: "FechaIN" }
];

const columnasTransporte = [
  { title: "IdServicioProducto", field: "IdServicioProducto", hidden: true },
  { title: "Nombre", field: "NombreServicio" },
  { title: "Cantidad", field: "Cantidad" },
  { title: "Fecha de reserva", field: "FechaReserva" },
  { title: "Fecha limite de pago", field: "FechaLimitePago" }
];

const columnasBriefing = [
  { title: "Nombre", field: "NombreServicio" },
  { title: "Cantidad", field: "Cantidad" },
  { title: "Fecha de reserva", field: "FechaReserva" },
  { title: "Fecha limite de pago", field: "FechaLimitePago" }
];

const columnasPasajero = [
  { title: "Nombre", field: "Nombre" },
  { title: "Apellido", field: "Apellido" },
  { title: "Tipo de documento", field: "TipoDocumento" },
  { title: "Numero de documento", field: "NroDocumento" },
  { title: "Sexo", field: "Sexo" },
  { title: "Celular", field: "Celular" },
  { title: "Nacionalidad", field: "Nacionalidad" }
];

const columnasEntrada = [
  { title: "Nombre", field: "NombreServicio" },
  { title: "Dia", field: "Dia" },
  { title: "Cantidad", field: "Cantidad" },
  { title: "Fecha de reserva", field: "FechaReserva" },
  { title: "Fecha limite de pago", field: "FechaLimitePago" }
];

const Index = ({ APIPath }) => {
  const router = useRouter();
  const [display, setDisplay] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [seleccion, setSeleccion] = useState(false);
  const [DataCotizacion, setDataCotizacion] = useState([]);

  const [equipos, setEquipos] = useState([]);
  const [observaciones, setObservaciones] = useState([]);
  const [transportes, setTransportes] = useState([]);
  const [briefing, setBriefing] = useState([]);
  const [pasajeros, setPasajeros] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [pasajeroSeleccionado, setPasajeroSeleccionado] = useState(null);
  const [reserva, setReserva] = useState("");

  const [biblia, setBiblia] = useState([]);

  const infoSection = React.useRef();

  useEffect(() => {
    setLoading(true);
    fetch(APIPath + "/api/Biblia/biblia")
      .then((r) => r.json())
      .then((data) => {
        setDataCotizacion(data.Cotizaciones);
        setLoading(false);
      });
  }, []);

  const obtenerExtras = async (IdReservaCotizacion) => {
    const params = {
      IdReservaCotizacion
    };
    const resultado = await axios.get(APIPath + "/api/Biblia/bibliaExtras", {
      params
    });
    const biblia = resultado.data.data[0];
    if (biblia) {
      const { Equipos, Observaciones } = biblia;
      setEquipos(Equipos);
      setObservaciones(Observaciones);
    }
    setBiblia(biblia);
  };

  const obtenerTransportes = (servicios) => {
    const productosTransportes = servicios.filter(
      (servicio) =>
        servicio.IdServicioProducto.startsWith("PT") ||
        servicio.IdServicioProducto.startsWith("PF")
    );
    setTransportes(productosTransportes);
  };

  const obtenerBriefing = (servicios) => {
    const productosBriefing = servicios.filter((servicio) =>
      servicio.IdServicioProducto.startsWith("PR")
    );
    setBriefing(productosBriefing);
  };

  const obtenerEntradas = (servicios) => {
    const productosEntrada = servicios.filter((servicio) =>
      servicio.IdServicioProducto.startsWith("PS")
    );
    setEntradas(productosEntrada);
  };

  const accionesReserva = [
    {
      icon: () => <img src="/resources/remove_red_eye-24px.svg" />,
      tooltip: "Ver mas datos",
      onClick: async (event, rowData) => {
        setLoading(true);
        setEquipos([]);
        setObservaciones([]);
        const {
          ServicioProducto: servicios,
          listaPasajeros,
          IdReservaCotizacion
        } = rowData;
        setPasajeros(listaPasajeros);
        obtenerTransportes(servicios);
        obtenerBriefing(servicios);
        obtenerEntradas(servicios);
        obtenerExtras(IdReservaCotizacion);
        setReserva(IdReservaCotizacion);
        await new Promise((resolve) => setTimeout(resolve, 250));
        setSeleccion(true);
        setLoading(false);
      }
    }
  ];

  const accionesPasajeros = [
    {
      icon: () => <img src="/resources/remove_red_eye-24px.svg" />,
      tooltip: "Ver mas detalles",
      onClick: async (event, rowData) => {
        setPasajeroSeleccionado(rowData);
        setDisplay(true);
      }
    }
  ];

  const guardarBiblia = async () => {
    setLoading(true);
    const nuevoRegistro = {
      IdReservaCotizacion: reserva,
      Equipos: equipos,
      Observaciones: observaciones
    };
    biblia
      ? await axios.put(`${APIPath}/api/Biblia/bibliaExtras`, {
          data: nuevoRegistro
        })
      : await axios.post(`${APIPath}/api/Biblia/bibliaExtras`, {
          data: nuevoRegistro
        });
    generarLog("UPDATE", "actualizacion de datos de biblia");
    obtenerExtras(reserva);
    setLoading(false);
    router.reload();
  };

  const scrollHere = () => {
    infoSection.current.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <div>
      <Loader Loading={Loading} />
      <div className={global_style.main_work_space_container}>
        <h1>Biblia</h1>
        <br />
        <h2>Lista de Reservas activas</h2>
        <MaterialTable
          columns={columnasReserva}
          data={DataCotizacion}
          title={null}
          actions={accionesReserva}
          options={{
            actionsColumnIndex: -1
          }}
        />
      </div>

      <section ref={infoSection} id="Extra_info"></section>

      {seleccion && (
        <>
          <div className={global_style.main_work_space_container}>
            <h1>Datos de Reserva</h1>
            <br />
            <h2>Lista de pasajeros</h2>
            <ModalPasajeros
              open={display}
              setOpen={setDisplay}
              pasajero={pasajeroSeleccionado}
            />
            <MaterialTable
              columns={columnasPasajero}
              data={pasajeros}
              actions={accionesPasajeros}
              options={{ actionsColumnIndex: -1 }}
              title={null}
            />
            <div className={styles.second__biblia_data_container}>
              <div>
                <h2>Entradas</h2>
                <MaterialTable
                  columns={columnasEntrada}
                  data={entradas}
                  title={null}
                />
                <h2>Transporte</h2>
                <MaterialTable
                  columns={columnasTransporte}
                  data={transportes}
                  title={null}
                />
              </div>
              <div>
                <h2>Briefing</h2>
                <MaterialTable
                  columns={columnasBriefing}
                  data={briefing}
                  title={null}
                />
                <Equipo equipos={equipos} setEquipo={setEquipos} />

                <Observacion
                  observaciones={observaciones}
                  setObservaciones={setObservaciones}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px"
              }}
            >
              <button
                className={`${botones.button} ${botones.buttonGuardar}`}
                onClick={guardarBiblia}
              >
                Guardar informacion
              </button>
            </div>
          </div>
          {scrollHere()}
        </>
      )}
    </div>
  );
};

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res }) {
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
    return {
      props: {
        APIPath: process.env.API_DOMAIN
      }
    };
  },
  ironOptions
);

export default Index;
