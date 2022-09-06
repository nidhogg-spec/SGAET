import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

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
  { title: "Fecha limite de pago", field: "FechaLimitePago"} 
];

const columnasBriefing = [
  { title: "Nombre", field: "NombreServicio" },
  { title: "Cantidad", field: "Cantidad" },
  { title: "Fecha de reserva", field: "FechaReserva" },
  { title: "Fecha limite de pago", field: "FechaLimitePago" }
];

const columnasCliente = [
  { title: "Nombre completo", field: "NombreCompleto" },
  { title: "Tipo de cliente", field: "TipoCliente" },
  { title: "Tipo de documento", field: "TipoDocumento" },
  { title: "Numero de documento", field: "NroDocumento" },
  { title: "Celular", field: "Celular" },
  { title: "Email", field: "Email" }
];


const Index = ({ APIPath }) => {
  const router = useRouter();
  const [Loading, setLoading] = useState(false);
  const [seleccion, setSeleccion] = useState(false);
  const [DataCotizacion, setDataCotizacion] = useState([]);
  const [BibliaData_pasajeros, setBibliaData_pasajeros] = useState([]);

  const [equipos, setEquipos] = useState([]);
  const [observaciones, setObservaciones] = useState([]);

  const [transportes, setTransportes] = useState([]);
  const [briefing, setBriefing] = useState([]);
  const [cliente, setCliente] = useState([]);
  const infoSection = React.useRef();

  useEffect(() => {
    setLoading(true);
    fetch(APIPath + "/api/Biblia/biblia")
      .then((r) => r.json())
      .then((data) => {
        setDataCotizacion(data.Cotizaciones);
      });
    setLoading(false);
  }, []);

  const obtenerTransportes = async (servicios) => {
    const productosTransportes = servicios.filter((servicio) => servicio.IdServicioProducto.startsWith("PT") || servicio.IdServicioProducto.startsWith("PF"));
    setTransportes(productosTransportes);
  }

  const obtenerBriefing = async (servicios) => {
    const productosBriefing = servicios.filter((servicio) => servicio.IdServicioProducto.startsWith("PR"));
    setBriefing(productosBriefing);
  }

  const obtenerCliente = async (idCliente) => {
    const params = { cliente: idCliente };
    const resultado = await axios.get(`${APIPath}/api/cliente/clientes`, { params });
    setCliente(resultado.data.Cliente);
  }

  const accionesReserva = [
    {
      icon: () => <img src="/resources/remove_red_eye-24px.svg" />,
      tooltip: "Ver mas datos",
      onClick: async (event, rowData) => {
        setLoading(true);

        const { ServicioProducto : servicios, IdClienteProspecto } = rowData;
        await obtenerCliente(IdClienteProspecto);
        await obtenerTransportes(servicios);
        await obtenerBriefing(servicios);

        setSeleccion(true);
        setBibliaData_pasajeros([]);
        setLoading(false);
      }
    }
  ]

  const scrollHere = () => {
    infoSection.current.scrollIntoView({
      behavior: "smooth"
    });
  }

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

      {seleccion &&

        <>

          <div className={global_style.main_work_space_container}>
            <h1>Datos de Reserva</h1>
            <br />
            <h2>Lista de clientes</h2>
            <MaterialTable
              columns={columnasCliente}
              data={cliente}
              title={null}
            />
            <div className={styles.second__biblia_data_container}>
              <div>
                <h2>Entradas</h2>
                <MaterialTable
                  columns={[
                    { title: "Id", field: "IdReservaCotizacion" },
                    { title: "Nombre Entrada", field: "" },
                    { title: "Fecha", field: "" },
                    {
                      title: "Codigo",
                      field: ""
                    }
                  ]}
                  data={DataCotizacion}
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

                <Observacion observaciones={observaciones} setObservaciones={setObservaciones} />

              </div>
            </div>
          </div>
          { scrollHere() }
        </>}
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
