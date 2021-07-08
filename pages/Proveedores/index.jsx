import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { withSSRContext } from 'aws-amplify'
import { MongoClient } from "mongodb";
import { resetServerContext } from "react-beautiful-dnd";

//Componentes
import MaterialTable from "material-table";
import BotonAnadir from "@/components/BotonAnadir/BotonAnadir";
resetServerContext();

export default function Home({ Datos, APIpath }) {
  const router = useRouter();
  const [TablaDatos, setTablaDatos] = useState(Datos);

  const HandleAnadir = ()=>{
    router.push('/Proveedores/NuevoProveedor')
  }

  return (
    <div>
      <div>
        <h1 className="Titulo">Lista de Proveedores</h1>
        <BotonAnadir Accion={HandleAnadir}/>
      </div>
      <div className="">
        <MaterialTable
          columns={[
            { title: "ID", field: "id", filtering: false, hidden: true },
            {
              title: "Nombre Comercial",
              field: "proveedor",
              filtering: false,
            },
            {
              title: "Ubicacion",
              field: "ubicacion",
              filtering: false,
            },
            {
              title: "Tipo de Proovedor",
              field: "tipo",
              lookup: {
                Hotel: "Hotel",
                Agencia: "Agencia",
                Guia: "Guia",
                TransporteTerrestre: "Transporte Terrestre",
                Restaurante: "Restaurante",
                SitioTuristico: "Sitio Turistico",
                TransporteFerroviario: "Transporte Ferroviario",
                Otro: "Otro",
              },
            },
          ]}
          data={TablaDatos}
          title={null}
          actions={[
            {
              icon: () => {
                return <img src="/resources/delete-black-18dp.svg" />;
              },
              tooltip: "Delete Proveedor",
              onClick: (event, rowData) => {
                fetch(APIpath, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    IdProveedor: rowData.id,
                    accion: "delete",
                  }),
                })
                  .then((r) => r.json())
                  .then((data) => {
                    alert(data.message);
                  });
              },
            },
            (rowData) => ({
              icon: () => {
                return (
                  <Link href={`/Proveedores/${rowData.tipo}/${rowData.id}`}>
                    <a>
                      <img src="/resources/remove_red_eye-24px.svg" />
                    </a>
                  </Link>
                );
              },
              tooltip:'Ver detalle de proveedor',
              onClick: () => {
                router.push(`/Proveedores/${rowData.tipo}/${rowData.id}`);
              },
            }),
          ]}
          options={{
            actionsColumnIndex: -1,
            filtering: true,
          }}
        />
      </div>
    </div>
  );
}
export async function getServerSideProps({ req, res }) {
  const APIpath = process.env.API_DOMAIN + "/api/proveedores/listaProveedores";
  //---------------------------Validacion del Login-----------------------------//
  const { Auth } = withSSRContext({ req })
  try {
    const user = await Auth.currentAuthenticatedUser()
  } catch (err) {
    res.writeHead(302, { Location: '/' })
    res.end()
  }
  //----------------------Obtener datos de proveedores-------------------------------------------
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  const coleccion = "Proveedor";
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect()
  const dbo = client.db(dbName);
  const collection = dbo.collection("Proveedor");
  let data = await collection.find({}).toArray();
  let Datos = [];
  data.map(datosResult=>{
    Datos.push({
      id: datosResult.IdProveedor,
      proveedor: datosResult.nombre,
      ubicacion: datosResult.DireccionFiscal,
      tipo: datosResult.tipo,
    });
  })
  client.close()
  //----------------------------------------------------------------------------
  return {
    props: {
      Datos: Datos,
      APIpath: APIpath,
    },
  };
}
