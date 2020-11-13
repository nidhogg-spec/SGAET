//Package
import styles from "./Tabla.module.css";

import React, { useEffect, useState} from "react";

//Componentes
import MaterialTable from "material-table";
import Modal from './Modal/Modal'
// import { render } from 'react-dom';



export default function Tabla(props) {
//Los siguientes datos deberian de estar en props para su correcto funcionamiento:
//     Title
//     ModoEdicion
//     Dato
//     
//El desarrollador no se hace responsable de su mal uso :v 
    const [Columnas,setColumnas]=useState(props.Columnas)
    const [Datos,setDatos]=useState(props.Datos)
    const [ModalDisplay,setModalDisplay]=useState(true)
    const [ModalId,setModalId]=useState("")
    const [TipoModal,setModalType]=useState(props.TipoModal)
    const [APIpath, setAPIpath] = useState(props.APIpath);

    
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
                onClick: (event, rowData) => {
                    alert(rowData.IdPrincipal)
                    setModalId(rowData.IdPrincipal); setModalDisplay(true);}
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
            <Modal Id={ModalId} Display= {ModalDisplay} MostrarModal={MostrarModal} APIpath={APIpath} TipoModal={TipoModal} />
            {/* </div> */}
            
        </>
    )
}