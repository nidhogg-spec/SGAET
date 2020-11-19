import React, {useState} from 'react';
import fetch from 'isomorphic-unfetch';
import MaterialTable from "material-table";
import Router from 'next/router'



export default function Home({Columnas, Datos}){

  const [datosEditables,setDatosEditables] = useState(Datos)
    // Datos.map((result)=>{
    //   console.log(result.tipo)
    // })
    return (
        <div>
            <MaterialTable
            columns={Columnas}
            data={datosEditables}
            title="Lista de Proovedores"
            editable={{
              onRowAdd: newData =>
              new Promise ((resolve,reject) => {
                console.log(newData)
                console.log(datosEditables)
                setTimeout(()=>{
                  fetch('http://localhost:3000/api/proveedores/listaProveedores',{
                  method:"POST",
                  headers:{"Content-Type": "application/json"},
                  body: JSON.stringify({
                    data: newData,
                    accion: "create",
                  }),
                })
                .then(r=>r.json())
                .then(data=>{
                })
                  setDatosEditables([...datosEditables, newData])
                  resolve();
                },1000)
              }),
              onRowUpdate: (newData, oldData)=>
                new Promise((resolve, reject)=>{
                  setTimeout(()=>{

                  },1000)
                }),
              onRowDelete: oldData=>
                new Promise((resolve,reject)=>{
                  setTimeout(() => {
                    
                  }, 1000);
                })
            }}
            actions= {[
              {
                icon: () =>{
                  return <img src="/resources/remove_red_eye-24px.svg"/>
                },
                tooltip: "Show Proveedor",
                onClick: (event, rowData,) => Router.push({
                  pathname: `/Proveedores/${rowData.tipo}/${rowData.id}`,
                })
              },
            ]}
            // actions= {[
            //   {
            //     icon: () =>{
            //       return <img src="/resources/edit-black-18dp.svg"/>
            //     },
            //     tooltip: "Edit Proveedor",
            //     // onClick: (event, rowData) => alert("You saved " + rowData.name)
            //   },
            //   {
            //     icon: () =>{
            //       return <img src="/resources/remove_red_eye-24px.svg"/>
            //     },
            //     tooltip: "Show Proveedor",
            //     onClick: (event, rowData,) => Router.push({
            //       pathname: `/Proveedores/${rowData.tipo}/${rowData.id}`,
            //     })
            //   },
            //   {
            //     icon: () =>{
            //       return <img src="/resources/delete-black-18dp.svg"/>
            //     },
            //     tooltip: "Delete Proveedor",
            //     onClick: (event, rowData) => {
            //       fetch('http://localhost:3000/api/proveedores/listaProveedores',{
            //         method:"POST",
            //         headers:{"Content-Type": "application/json"},
            //         body: JSON.stringify({
            //           idProveedor: rowData.id,
            //           accion: "delete",
            //         }),
            //       })
            //       .then(r=>r.json())
            //       .then(data=>{
            //         alert(data.message);
            //       })
            //     }
            //   },
            // ]}
            options={{
              actionsColumnIndex: -1,
            }}
            >
            </MaterialTable>
        </div>
    )
}
export async function getStaticProps() {
  let Columnas = [
    { title: "ID", field: "idProveedor" },
    { title: "Nombre Proovedores", field: "nombre" },
    { title: "Ubicacion Proovedor", field: "ubicacion" },
    { title: "Tipo de Proovedor", field: "tipo" },
  ];
  let Datos=[]
  
  await fetch(process.env.API_DOMAIN+'/api/proveedores/listaProveedores')
  .then(r=> r.json())
  .then(data1=>{
    data1.data.map((datosResult)=>{
        Datos.push({
          idProveedor:datosResult.idProveedor,
          nombre: datosResult.nombre,
          ubicacion: datosResult.ubicacion,
          tipo: datosResult.tipo,
        })
      })
  })
  return {
    props:{
      Columnas: Columnas, Datos:Datos
    }}
}