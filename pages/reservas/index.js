import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/config";

import MaterialTable from "material-table";

const Index = ({
  DataReservas
}) => {
  const router = useRouter()
  let data = [
    {
      name: "Mehmet",
      surname: "Baran",
      birthYear: 1987,
      birthCity: 63,
    },
  ]

  return (
    <div>
      <MaterialTable

        columns={
          [{ title: "Id", field: "IdReservaCotizacion" },
          { title: "NombreGrupo", field: "NombreGrupo" },
          { title: "CodGrupo", field: "CodGrupo" },
          {
            title: "FechaIN",
            field: "FechaIN",
          }]}
        data={DataReservas}
        title={null}
        actions={
          [
            {
              icon: () => {
                return <img src="/resources/remove_red_eye-24px.svg" />;
              },
              tooltip: "Mostrar reserva",
              onClick: (event, rowData) => {
                router.push(`/reservas/reserva/${rowData.IdReservaCotizacion}`)
              },
            },
          ]}
        options={{
          actionsColumnIndex: -1,
        }
        }
      />
    </div>
  )

}

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
    let DataReservas = []
    const APIpathGeneral = process.env.API_DOMAIN + "/api/general";

    await fetch(APIpathGeneral, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coleccion: "ReservaCotizacion",
        accion: "FindAll",
        projection: {},
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        DataReservas = data.result;
      });
    return ({
      props: {
        DataReservas: DataReservas
      }
    })


  },
  ironOptions
);


export default Index;