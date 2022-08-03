import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/config";

import MaterialTable from "material-table";
import Loader from "@/components/Loading/Loading";

import globalStyles from "@/globalStyles/modules/global.module.css";

const Index = ({ APIPath }) => {
  const router = useRouter();
  const [Loading, setLoading] = useState(false);
  const [DataCotizacion, setDataCotizacion] = useState([]);
  const [DataReserva, setDataReserva] = useState([]);

  useEffect(async () => {
    setLoading(true);
    await Promise.all([
      axios.get(`${APIPath}/api/reserva/Lista/ListaReserva`).then((data) => {
        setDataReserva(data.data.AllCotizacion);
        console.log(data);
      }),
      axios.get(`${APIPath}/api/reserva/Lista/ListaCotizacion`).then((data) => {
        setDataCotizacion(data.data.AllCotizacion);
        console.log(data);
      })
    ]);
    setLoading(false);
  }, []);

  return (
    <div>
      <Loader Loading={Loading} />
      <div className={`${globalStyles.main_work_space_container}`}>
        <div>
          <h1>Lista de Reservas</h1>
          <MaterialTable
            columns={[
              { title: "Id", field: "IdReservaCotizacion" },
              { title: "NombreGrupo", field: "NombreGrupo" },
              { title: "CodGrupo", field: "CodGrupo" },
              {
                title: "FechaIN",
                field: "FechaIN"
              }
            ]}
            data={DataReserva}
            title={null}
            actions={[
              {
                icon: () => {
                  return <img src="/resources/remove_red_eye-24px.svg" />;
                },
                tooltip: "Mostrar reserva",
                onClick: (event, rowData) => {
                  router.push(
                    `/reservas/reserva/${rowData.IdReservaCotizacion}`
                  );
                }
              }
            ]}
            options={{
              actionsColumnIndex: -1
            }}
          />
        </div>
        <div>
          <h1>Lista de Cotizaciones</h1>
          <MaterialTable
            columns={[
              { title: "Id", field: "IdReservaCotizacion", hidden: true },
              { title: "NombreGrupo", field: "NombreGrupo" },
              { title: "CodGrupo", field: "CodGrupo" },
              {
                title: "FechaIN",
                field: "FechaIN"
              }
            ]}
            data={DataCotizacion}
            title={null}
            actions={[
              {
                icon: () => {
                  return <img src="/resources/remove_red_eye-24px.svg" />;
                },
                tooltip: "Mostrar reserva",
                onClick: (event, rowData) => {
                  router.push(
                    `/reservas/reserva/${rowData.IdReservaCotizacion}`
                  );
                }
              }
            ]}
            options={{
              actionsColumnIndex: -1
            }}
          />
        </div>
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

    let DataReservas = [];

    const APIpathGeneral = process.env.API_DOMAIN + "/api/general";

    return {
      props: {
        APIPath: process.env.API_DOMAIN
      }
    };
  },
  ironOptions
);
export default Index;
