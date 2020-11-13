//Package
import styles from "./CampoTexto.module.css";
import React, { useEffect, useState} from "react";

//Componentes


const CampoTexto = (props) => {
//Los siguientes datos deberian de estar en props para su correcto funcionamiento:
//     Title
//     ModoEdicion
//     Dato
//     
//El desarrollador no se hace responsable de su mal uso :v  


    const [ModoEdicion, setModoEdicion] = useState(false);
    const [Dato, setDato] = useState("");
    const [DatoVariable, setDatoVariable] = useState("");
    useEffect(()=>{
        setDato(props.Dato)
    },[props.Dato])
    
    if(ModoEdicion==true){
        return ( 
            <div>
        
            </div> );
    }else{
        return ( 
            <div>
                <span>{props.Title}</span>
                <span>{Dato}</span>
            </div> 
        );
    }
    
    
}
 
export default CampoTexto;