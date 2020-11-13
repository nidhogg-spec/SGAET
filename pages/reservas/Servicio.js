//packege
import fetch from 'isomorphic-unfetch';
import router from 'next/router'
//css
import CustomStyles from "../../styles/Servicio.module.css";

//modulos
// import React,{useState,useEffect} from 'react'
import MaterialTable from "material-table";
import BotonAnadir from "../../components/BotonAnadir/BotonAnadir";
import Tabla from "../../components/TablaModal/Tabla";



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
  fetch('http://localhost:3000/api/servicios')
  .then(r=> r.json())
  .then(data=>{
    let Datos=[]
    console.log(data)
    // data.result.map((datosResult)=>{
    //   Datos.push({
    //     name: datosResult.idServicio,
    //     TipoServicio: datosResult.TipoServicio,
    //     NombreServicio: datosResult.NombreServicio,
    //   })
    // })
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


function Servicio({Columnas,Datos}) {

  return (
    <div>
      <div className={CustomStyles.tituloBox}>
        <span className={CustomStyles.titulo}>Servicios</span>
        <BotonAnadir />
        <Tabla Columnas={Columnas} Datos={Datos} />
      </div>

      
    </div>
  );
}
export async function getStaticProps(){
  let Columnas = [
    { title: "Id", field: "name" },
    { title: "Nombre del Servicio", field: "NombreServicio" },
    { title: "Tipo del Servicio", field: "TipoServicio"},
  ];
  let Datos=[]
  console.log(process.env.API_DOMAIN)
  
  await fetch(process.env.API_DOMAIN+'/api/servicios')
  .then(r=> r.json())
  .then(data=>{
    // console.log(data)
    data.result.map((datosResult)=>{
        Datos.push({
          name: datosResult.idServicio,
          TipoServicio: datosResult.TipoServicio,
          NombreServicio: datosResult.NombreServicio,
        })
      })
  })
  // console.log(Datos)
  return {
    props:{
      Columnas: Columnas, Datos:Datos
    }}
}

export default Servicio;

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