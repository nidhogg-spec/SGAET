import React, {useState} from 'react';
import fetch from 'isomorphic-unfetch';
import MaterialTable from "material-table";

export default function Home({Columnas, Datos}){
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
                // onClick: (event, rowData) => alert("You saved " + rowData.name)
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