import MaterialTable from "material-table";
import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import Router from "next/router";
import { useState } from "react";

export default function ClientesIndex({ Datos, APIpath }) {

  const [datosEditables, setDatosEditables] = useState(Datos);

  let Columnas = [
    { title: "ID", field: "IdCliente", hidden: true },
    { title: "Nombres", field: "Nombre" },
    { title: "Apellidos", field: "Apellido" },
    {
      title: "Tipo de Cliente",
      field: "Tipocliente",
      lookup: { afiliado: "Afiliado", directo: "Directo" }
    },
    { title: "Nacionalidad", field: "Nacionalidad" },
    {
      title: "Tipo de Documento",
      field: "TipoDocumento",
      lookup: { DNI: "DNI", RUC: "RUC" }
    },
    { title: "Nro Documento", field: "NroDocumento" },
  ]
  return (
    <div>
      <MaterialTable
        columns={Columnas}
        data={datosEditables}
        title="Clientes"

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
export async function getStaticProps() {
  var Datos = [];

  /*---------------------------------------------------------------------------------*/
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  const APIpath = process.env.API_DOMAIN;
  try {
    await connectToDatabase().then(async connectedObject => {
      let collection = connectedObject.db.collection("Cliente");
      let result = await collection.find({}).project({ "_id": 0 }).toArray();
      // DatosProveedor = JSON.stringify(result);

      result._id = JSON.stringify(result._id);
      Datos = result;
    });


  } catch (error) {
    console.log("Error cliente Mongo 1 => " + error);
  }

  return {
    props: {
      Datos: Datos, APIpath: APIpath
    }
  }
}