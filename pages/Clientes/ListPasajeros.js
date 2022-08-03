import MaterialTable from "material-table";
import { MongoClient } from "mongodb";
import Router from "next/router";
import { useState } from "react";

import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/config";

// Estilos
import globalStyles from '@/globalStyles/modules/global.module.css'

export default function Home({ Datos, APIpath }) {

  const [datosEditables, setDatosEditables] = useState(Datos);

  let Columnas = [
    { title: "ID", field: "IdCliente", hidden: true },
    { title: "Nombres", field: "Nombre" },
    { title: "Apellidos", field: "Apellido" },
    { title: "Nacionalidad", field: "Nacionalidad" },
    {
      title: "Tipo de Documento",
      field: "TipoDocumento",
      lookup: { DNI: "DNI", RUC: "RUC" }
    },
    { title: "Nro Documento", field: "NroDocumento" },
  ]
  return (
    <div className={`${globalStyles.main_work_space_container}`}>
      <h1>Lista de pasajeros</h1>
      <MaterialTable
        columns={Columnas}
        data={datosEditables}
        title={null}

        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                fetch(APIpath + `/api/cliente/clientes`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    data: newData,
                    accion: "create",
                  }),
                })
                  .then(r => r.json())
                  .then(data => {
                    alert(data.message);
                  })
                setDatosEditables([...datosEditables, newData]);
                resolve();
              }, 1000)
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...datosEditables];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setDatosEditables([...dataUpdate]);

                delete dataUpdate[index]._id

                fetch(APIpath + `/api/cliente/clientes`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    idProducto: dataUpdate[index].IdCliente,
                    data: dataUpdate[index],
                    accion: "update",
                  }),
                })
                  .then(r => r.json())
                  .then(data => {
                    alert(data.message);
                  })
                console.log(dataUpdate[index])
                resolve();
              }, 1000)
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...datosEditables];
                const index = oldData.tableData.id;

                fetch(APIpath + `/api/cliente/clientes`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    idProducto: dataDelete[index].IdCliente,
                    accion: "delete",
                  }),
                })
                  .then(r => r.json())
                  .then(data => {
                    alert(data.message);
                  })

                dataDelete.splice(index, 1);
                setDatosEditables([...dataDelete]);

                resolve()
              }, 1000)
            }),
        }}
        actions={[
          {
            icon: () => {
              return <img src="/resources/remove_red_eye-24px.svg" />;
            },
            tooltip: "Mostrar todo",
            onClick: (event, rowData) => Router.push({
              pathname: `/Clientes/${rowData.IdCliente}`,
            })
          },
          // {
          //   icon: ()=>{
          //     return <img src="/resources/seguimiento-online.png" />;
          //   },
          //   tooltip: "Seguimiento",
          //   onClick: (event, rowData) => Router.push({
          //       pathname: '/Clientes/detalleCliente',
          //   })
          // }
        ]}
        options={{
          actionsColumnIndex: -1,
        }}
      />
    </div>
  )
}

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

    var Datos = [];

    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;
    const APIpath = process.env.API_DOMAIN;

    let client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      console.log("mongo xdxdxdxd");
      await client.connect();
      let collection = client.db(dbName).collection("Cliente");
      let result = await collection.find({}).project({ "_id": 0 }).toArray();
      // DatosProveedor = JSON.stringify(result);

      result._id = JSON.stringify(result._id);
      Datos = result;

    } catch (error) {
      console.log("Error cliente Mongo 1 => " + error);
    } finally {
      client.close();
    }

    return {
      props: {
        Datos: Datos, APIpath: APIpath
      }
    }

  },
  ironOptions
);