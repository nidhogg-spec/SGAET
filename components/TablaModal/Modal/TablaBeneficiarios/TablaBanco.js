//css
import styles from './TablaBanco.module.css'
import React, { useState, useEffect } from 'react';

const TablaBanco = (props) => {
    const [ModoEdicion, setModoEdicion] = useState();
    
    useEffect(()=>{
        if(props.DarDato==true){
            props.DevolverDatoFunct(props.KeyDato,props.datosbanc)
        }
    },[props.DarDato])

    return ( 
        <>
            <span>Numero de cuentas bancarias</span>
            <div className={styles.DataCuentasBancarias}>
                <span >Beneficiario</span><span className={styles.spanDoble}> {props.datosbanc.Beneficiario || "Nor Found"} </span>
                {props.datosbanc.Bancos.map(banco =>
                    <>
                        <span>{banco.Nombre}</span>
                        <span>{banco.Cuenta}</span>
                        <span>{banco.CCI}</span>
                    </>
                )}
                <span>RUC</span><span className={styles.spanDoble}> {props.datosbanc.RUC || "Nor Found"} </span>
                <span>Direccion Registrada</span><span className={styles.spanDoble}> {props.datosbanc.DireccionRegistrada || "Nor Found"} </span>
            </div>
        </>
     );
}
 
export default TablaBanco;