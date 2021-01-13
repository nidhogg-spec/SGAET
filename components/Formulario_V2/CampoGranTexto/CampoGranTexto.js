//Package
import styles from "./CampoGranTexto.module.css";
import React, { useEffect, useState} from "react";

//Componentes


const CampoGranTexto = (props={
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
            <div>
                <span>{props.Title}</span>
                <textarea value={Dato} onChange={(event)=>{
                        setDato(event.target.value)
                    }
                }/>
            </div> );
    }else{
        return ( 
            <div className={styles.divMadre}>
                <span>{props.Title}</span>
                <span>{Dato}</span>
            </div> 
        );
    }
    
    
}
 
export default CampoGranTexto;