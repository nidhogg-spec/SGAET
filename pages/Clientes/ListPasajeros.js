import MaterialTable from "material-table";
import { MongoClient } from "mongodb";
import  Router  from "next/router";
import { withSSRContext } from 'aws-amplify'
import { useState } from "react";

export default function Home({Datos}){

const [datosEditables, setDatosEditables] = useState(Datos);

    let Columnas = [
        { title: "ID", field: "IdCliente", hidden: true },
        { title: "Nombres", field: "Nombre" },
        { title: "Apellidos", field: "Apellido" },
        { title: "Nacionalidad", field: "Nacionalidad" },
        { 
          title: "Tipo de Documento", 
          field: "TipoDocumento" ,
          lookup: {DNI:"DNI",RUC:"RUC"}
      },
        { title: "Nro Documento", field: "NroDocumento"},
    ]
    return(
        <div>
            <MaterialTable
                columns={Columnas}
                data= {datosEditables}
                title="Clientes"
           
                editable={{
                    onRowAdd: newData =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                            fetch(`http://localhost:3000/api/cliente/clientes`,{
                              method:"POST",
                              headers:{"Content-Type": "application/json"},
                              body: JSON.stringify({
                                data: newData,
                                accion: "create",
                              }),
                            })
                            .then(r=>r.json())
                            .then(data=>{
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
                          
                          fetch(`http://localhost:3000/api/cliente/clientes`,{
                            method:"POST",
                            headers:{"Content-Type": "application/json"},
                            body: JSON.stringify({
                              idProducto: dataUpdate[index].IdCliente,
                              data: dataUpdate[index],
                              accion: "update",
                            }),
                          })
                          .then(r=>r.json())
                          .then(data=>{
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
        
                          fetch(`http://localhost:3000/api/cliente/clientes`,{
                            method:"POST",
                            headers:{"Content-Type": "application/json"},
                            body: JSON.stringify({
                              idProducto: dataDelete[index].IdCliente,
                              accion: "delete",
                            }),
                          })
                          .then(r=>r.json())
                          .then(data=>{
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
                      icon: ()=>{
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
export async function getServerSideProps({ req, res }) {
    var Datos = [];
  
    /*---------------------------------------------------------------------------------*/
    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;
    let client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { Auth } = withSSRContext({ req })
    try {
      const user = await Auth.currentAuthenticatedUser()
    } catch (err) {
      res.writeHead(302, { Location: '/' })
      res.end()
    }

    try {
      console.log("mongo xdxdxdxd");
      await client.connect();
      let collection = client.db(dbName).collection("Cliente");
      let result = await collection.find({}).project({"_id":0}).toArray();
      // DatosProveedor = JSON.stringify(result);

      result._id = JSON.stringify(result._id);
      Datos = result;

    } catch (error) {
      console.log("Error cliente Mongo 1 => " + error);
    } finally {
      client.close();
    }

    return {
      props:{
        Datos:Datos
      }}
  }