import React, {useState} from 'react';
import fetch from 'isomorphic-unfetch';
import MaterialTable from "material-table";
import Router from 'next/router'



export default function Home({Columnas, Datos}){
    // Datos.map((result)=>{
    //   console.log(result.tipo)
    // })
    return (
        <div>
            <MaterialTable
            columns={Columnas}
            data={Datos}
            title="Lista de Proovedores"
            actions= {[
              {
                icon: () =>{
                  return <img src="/resources/edit-black-18dp.svg"/>
                },
                tooltip: "Edit Proveedor",
                // onClick: (event, rowData) => alert("You saved " + rowData.name)
              },
              {
                icon: () =>{
                  return <img src="/resources/remove_red_eye-24px.svg"/>
                },
                tooltip: "Show Proveedor",
                // pathname: '/Proveedores/[tipoProveedor]',
                // query: {tipoProveedor: rowData.tipo},
                onClick: (event, rowData,) => Router.push({
                  pathname: `/Proveedores/${rowData.tipo}/${rowData.id}`,
                  // pathname: `/Proveedores/${rowData.tipo}/[tipoProveedor]`,
                  // // query: {TipoProveedor: rowData.tipo},
                  // query: {tipoProveedor: rowData.id},
                  // query: {tipoProveedor: rowData.id},
                  // pathname: `/Proveedores/[tipoProveedor]`,
                  // query: {tipoProveedor: rowData.tipo},
                })
              },
              {
                icon: () =>{
                  return <img src="/resources/delete-black-18dp.svg"/>
                },
                tooltip: "Delete Proveedor",
                // onClick: (event, rowData) => alert("You saved " + rowData.name)
              },
            ]}
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
    { title: "ID", field: "id" },
    { title: "Nomber Proovedores", field: "proveedor" },
    { title: "Ubicacion Proovedor", field: "ubicacion" },
    { title: "Tipo de Proovedor", field: "tipo" },
  ];
  let Datos=[]
  
  await fetch(process.env.API_DOMAIN+'/api/proveedores/listaProveedores')
  .then(r=> r.json())
  .then(data1=>{
    data1.data.map((datosResult)=>{
        Datos.push({
          id:datosResult.idProveedor,
          proveedor: datosResult.nombre,
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