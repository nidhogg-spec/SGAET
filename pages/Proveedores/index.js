import React, {useState} from 'react';
import fetch from 'isomorphic-unfetch';
import MaterialTable from "material-table";
import Router from 'next/router'

//Componentes
import BotonAnadir from '@/components/BotonAnadir/BotonAnadir'
import Modal from '@/components/TablaModal/Modal/Modal'



export default function Home({Columnas, Datos, APIpath}){
    //Variables
    const [ModalDisplay,setModalDisplay]=useState(false)

    //Funciones
    const AccionBoton = () =>{
      setModalDisplay(true)
    }
    const MostrarModal=(x)=>{
      setModalDisplay(x)
  }
    return (
        <div>
            <Modal Display= {ModalDisplay} MostrarModal={MostrarModal} APIpath={APIpath} TipoModal={"Proveedores"}/>
            <MaterialTable
            columns={Columnas}
            data={Datos}
            title="Lista de Proovedores"
            // editable={{
            //   onRowAdd: newData =>
            //   new Promise ((resolve,reject) => {
            //     console.log(newData)
            //     console.log(datosEditables)
            //     setTimeout(()=>{
            //       fetch('http://localhost:3000/api/proveedores/listaProveedores',{
            //       method:"POST",
            //       headers:{"Content-Type": "application/json"},
            //       body: JSON.stringify({
            //         data: newData,
            //         accion: "create",
            //       }),
            //     })
            //     .then(r=>r.json())
            //     .then(data=>{
            //     })
            //       setDatosEditables([...datosEditables, newData])
            //       resolve();
            //     },1000)
            //   }),
            //   onRowUpdate: (newData, oldData)=>
            //     new Promise((resolve, reject)=>{
            //       setTimeout(()=>{

            //       },1000)
            //     }),
            //   onRowDelete: oldData=>
            //     new Promise((resolve,reject)=>{
            //       setTimeout(() => {
                    
            //       }, 1000);
            //     })
            // }}
            data={Datos}
            title={<span>Lista de Proveedores <BotonAnadir Accion={AccionBoton}/> </span>}
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
              {
                icon: () =>{
                  return <img src="/resources/delete-black-18dp.svg"/>
                },
                tooltip: "Delete Proveedor",
                onClick: (event, rowData) => {
                  fetch(APIpath,{
                    method:"POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({
                      idProveedor: rowData.id,
                      accion: "delete",
                    }),
                  })
                  .then(r=>r.json())
                  .then(data=>{
                    alert(data.message);
                  })
                }
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
  const APIpath = process.env.API_DOMAIN+"/api/proveedores/listaProveedores";
  
  let Columnas = [
    { title: "ID", field: "id" },
    { title: "Nombre Proovedores", field: "proveedor" },
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
          ubicacion: datosResult.direccionRegistrada,
          tipo: datosResult.tipo,
        })
      })
  })
  return {
    props:{
      Columnas: Columnas, Datos:Datos,APIpath:APIpath
    }}
}