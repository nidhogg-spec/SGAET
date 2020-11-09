//packege
import fetch from 'isomorphic-unfetch';

//css
import CustomStyles from "../../styles/Servicio.module.css";

//modulos
// import React,{useState,useEffect} from 'react'
import MaterialTable from "material-table";
import BotonAnadir from "../../components/BotonAnadir/BotonAnadir";
import Modal from "../../components/Modal/Modal";


let PedirDatos = ()=>{
  fetch('/api/servicios',{
    method:'POST',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify({
      idServicio:"001"
    })
  })
  .then(r=> r.json())
  .then(data=>{
    console.log(data)
  })
}
let datosTabla = () =>{
   fetch('/api/servicios',{
    method:'GET',
    headers:{'Content-Type': 'application/json'},
  })
  .then(r=> r.json())
  .then(data=>{
    let Datos=[]
    data.result.map((datosResult)=>{
      Datos.push({
        name: datosResult.idServicio,
        TipoServicio: datosResult.TipoServicio,
        NombreServicio: datosResult.NombreServicio,
      })
    })
    return Datos
    // let Datos = [
    //   {
    //     name: data.idServicio,
    //     TipoServicio: data.TipoServicio,
    //     NombreServicio: data.NombreServicio,
    //   },
    // ];
    
    // data.result.map((datosResult)=>{
    //   Datos.push({
    //     name: data.idServicio,
    //     TipoServicio: data.TipoServicio,
    //     NombreServicio: data.NombreServicio,
    //   })
    // })
    // console.log(Datos)
  })
}


export default async function Home() {
  
  let Columnas = [
    { title: "Id", field: "name" },
    { title: "Nombre del Servicio", field: "NombreServicio" },
    { title: "Tipo del Servicio", field: "TipoServicio"},
  ];
  let Datos=[]
  // Datos = datosTabla()
  
  // fetch('/api/servicios',{
  //   method:'GET',
        
  // })
  // .then(r=> r.json())
  // .then(data=>{
  //   console.log(data)
    // let Datos = [
    //   {
    //     name: data.idServicio,
    //     TipoServicio: data.TipoServicio,
    //     NombreServicio: data.NombreServicio,
    //   },
    // ];
    
    // data.result.map((datosResult)=>{
    //   Datos.push({
    //     name: data.idServicio,
    //     TipoServicio: data.TipoServicio,
    //     NombreServicio: data.NombreServicio,
    //   })
    // })
    // console.log(Datos)
  // })
  

  // console.log(process)
  return (
    <div>
      <div className={CustomStyles.tituloBox}>
        <span className={CustomStyles.titulo}>Servicios</span>
        <BotonAnadir />
        <Modal />
        
      </div>

      <MaterialTable
        columns={Columnas}
        data={Datos}
        title="Servicios"
        actions={[
          {
            icon: () =>{
              return <img src="/resources/remove_red_eye-24px.svg"/>
            },
            tooltip: "Save User",
            // onClick: (event, rowData) => alert("You saved " + rowData.name)
          },
          (rowData) => ({
            icon: () =>{
              return <img src="/resources/delete-black-18dp.svg"/>
            },
            tooltip: "Delete User",
            // onClick: (event, rowData) => confirm("You want to delete " + rowData.name)
          }),
          {
            icon: () =>{
              return <img src="/resources/edit-black-18dp.svg"/>
            },
            tooltip: "Save User",
            // onClick: (event, rowData) => alert("You saved " + rowData.name)
          },
        ]}
        options={{
          actionsColumnIndex: -1,
        }}
      />
    </div>
  );
}
