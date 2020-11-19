//Package
import styles from "./CampoTexto.module.css";
import React, { useEffect, useState} from "react";

//Componentes


const CampoTexto = (props) => {
//Los siguientes datos deberian de estar en props para su correcto funcionamiento:
//     Title
//     ModoEdicion  bool
//     Dato
//     DevolverDatoFunct={RegistrarDato}
//     DarDato={DevolverDato}
//     KeyDato - Dato como el cual se guardar
//El desarrollador no se hace responsable de su mal uso :v  

    const [ModoEdicion, setModoEdicion] = useState(props.ModoEdicion);
    const [Dato, setDato] = useState("");
    useEffect(()=>{
        setDato(props.Dato)
    },[props.Dato])

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
                <input value={Dato} onChange={(event)=>{
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
 
export default CampoTexto;