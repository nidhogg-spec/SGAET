//Package
// import styles from "./Modal.module.css";

import React, { useEffect, useState} from "react";

//Componentes
import MaterialTable from "material-table";
import Modal from './Modal/Modal'
// import { render } from 'react-dom';



export default function Tabla(props) {
    const [Columnas,setColumnas]=useState(props.Columnas)
    const [Datos,setDatos]=useState(props.Datos)
    const [ModalDisplay,setModalDisplay]=useState(true)
    const [ModalId,setModalId]=useState(0)
    const [ModalType,setModalType]=useState({})
    
    useEffect(()=>{
        console.log("asdasdasdasdasd")
       
    },[ModalId])

    const MostrarModal=(x)=>{
        setModalDisplay(x)
    }
    return(
        <> 
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
                onClick: (event, rowData) => alert("You saved " + rowData.name)
            },
            (rowData) => ({
                icon: () =>{
                return <img src="/resources/delete-black-18dp.svg"/>
                },
                tooltip: "Delete User",
                onClick: (event, rowData) => {setModalDisplay(true); }
            }),
            {
                icon: () =>{
                return <img src="/resources/edit-black-18dp.svg"/>
                },
                tooltip: "Save User",
                onClick: (event, rowData) => {
                
                }
            },
            ]}
            options={{
            actionsColumnIndex: -1,
            }}
            />
            {/* <div id="soy_un_modal"> */}
            <Modal Id={ModalId} Display= {ModalDisplay} Type={ModalType} MostrarModal={MostrarModal}  />
            {/* </div> */}
            
        </>
    )
}