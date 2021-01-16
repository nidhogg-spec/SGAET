import React, { useState, useEffect } from 'react';
import {useRouter} from 'next/router'

import MaterialTable from "material-table";
import Loader from '@/components/Loading/Loading'

const Index=({
    APIPath
}) => {
  const router = useRouter()
  const [Loading, setLoading] = useState(false);
  const [DataCotizacion, setDataCotizacion] = useState([]);

  useEffect(async() => {
    setLoading(true)
    await fetch(APIPath+'/api/reserva/Lista/ListaReserva')
            .then((r) => r.json())
            .then((data) => {
                setDataCotizacion(data.AllCotizacion);
            });
            setLoading(false);
  }, []);

  
  return (
    <div>
        <Loader Loading={Loading} />
      <MaterialTable

      columns={
      [{ title: "Id", field: "IdReservaCotizacion" },
      { title: "NombreGrupo", field: "NombreGrupo" },
      { title: "CodGrupo", field: "CodGrupo"},
      {
        title: "FechaIN",
        field: "FechaIN",
      }]}
      data={DataCotizacion}
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
export async function getStaticProps(){
  let DataReservas=[]
  
  const APIpathGeneral = process.env.API_DOMAIN + "/api/general";

  return({props:{
    APIPath:process.env.API_DOMAIN
  }})
}
export default Index;