//Package
import styles from "./CampoFecha.module.css";
import React, { useEffect, useState} from "react";

//Componentes


const CampoFecha = (props={
    Title:"Nombre del Proveedor",
    ModoEdicion:true,
    setDato:()=>{},
    Dato:{},
    KeyDato:"nombre",
    Reiniciar:true
}) => {
    const [ModoEdicion, setModoEdicion] = useState(props.ModoEdicion);
    const [Dato, setDato] = [props.Dato,props.setDato]
    useEffect(() => {
        setModoEdicion(props.ModoEdicion)
    },[props.ModoEdicion]);
    
    if(ModoEdicion==true){
        return ( 
            <div>
                <span>{props.Title}</span>
                <input value={Dato} 
                type={"date" }
                onChange={(event)=>{
                        let temp_dato = props.Dato;
                        temp_dato[props.KeyDato]=event.target.value;
                        setDato(temp_dato)
                    }
                }/>
            </div> );
    }else{
        return ( 
            <div className={styles.divMadre}>
                <span>{props.Title}</span>
                <input value={Dato} 
                type={"date" }
                disabled/>
            </div> 
        );
    }
    
    
}
 
export default CampoFecha;