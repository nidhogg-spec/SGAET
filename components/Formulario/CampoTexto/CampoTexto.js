//Package
import styles from "./CampoTexto.module.css";
import React, { useEffect, useState} from "react";

import globalStyles from '@/globalStyles/modules/global.module.css'



const CampoTexto = (props={
    Title:"Nombre del Proveedor",
    ModoEdicion:true,
    DevolverDatoFunct:{RegistrarDato},
    DarDato:{DevolverDato},
    KeyDato:"nombre",
    Dato:{},
    Reiniciar:true
}) => {


    const [ModoEdicion, setModoEdicion] = useState(props.ModoEdicion);
    const [Dato, setDato] = useState("");
    useEffect(()=>{
        setDato(props.Dato)
    },[props.Dato])
    useEffect(() => {
        if (props.Reiniciar==true) {
            setDato(props.Dato)
        }
    }, [props.Reiniciar]);
    useEffect(() => {
        setModoEdicion(props.ModoEdicion)
    },[props.ModoEdicion]);

    useEffect(()=>{
        if(props.DarDato==true){
            props.DevolverDatoFunct(props.KeyDato,Dato)
        }
    },[props.DarDato])
    
    if(ModoEdicion==true){
        return ( 
            <div className={`${globalStyles.global_textInput_container}`}>
                <span>{props.Title}</span>
                <input value={Dato} onChange={(event)=>{
                        setDato(event.target.value)
                    }
                }/>
            </div> );
    }else{
        return ( 
            <div className={`${globalStyles.global_textInput_container}`}>
                <span>{props.Title}</span>
                <span>{Dato}</span>
            </div> 
        );
    }
    
    
}
 
export default CampoTexto;