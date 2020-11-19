//css
import styles from './TablaBanco.module.css'

//Paquetes
import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table'

//Componentes
import CampoTexto from '@/components/TablaModal/Modal/CampoTexto/CampoTexto'

const TablaBanco = (props) => {
    //comunicacion con padre
    const [ObtenerDatos, setObtenerDatos] = useState();
    const [DevolverDato, setDevolverDato] = useState(false);
    const [data, setData] = useState([]);
    const [Edicion, setEdicion] = useState(props.ModoEdicion);


    let RegistBancos=[]
    let DataRegist={}
    useEffect(() => {
        setEdicion(props.ModoEdicion)
    }, [props.ModoEdicion]);

    useEffect(() => {
        setData(props.datosbanc.Bancos)
    }, [props.datosbanc.Bancos]);

    useEffect(()=>{
        if(props.DarDato==true){
            RegistBancos =[] 
            data.map(dt =>{
                RegistBancos.push({Nombre:dt.NombreBanco,Cuenta:dt.nCuentaBanco,CCI:dt.CCI})
            })
            DataRegist["Bancos"]=RegistBancos;
            props.DevolverDatoFunct(props.KeyDato,DataRegist)
        }
    },[props.DarDato])
    
    const RegistrarDato = (keyDato, Dato) =>{
        DataRegist[keyDato]=Dato;
    }
    let columnas=[]
    
    // if(Edicion==true){
        columnas=[
            {title: 'Nombre del Banco', field: 'Nombre'},
            {title: 'Cuenta Bancaria', field: 'Cuenta'},
            {title: 'CCI', field: 'CCI'},
        ]
        

        return(
            <div>
                <span className={styles.DataCuentasBancarias}>Numero de cuentas bancarias</span>
                <div className={styles.CamposDeTexto}>
                    <CampoTexto 
                        Title="Beneficiario"
                        ModoEdicion={Edicion}
                        DevolverDatoFunct={RegistrarDato}
                        DarDato={props.DarDato}
                        KeyDato="Beneficiario"
                        Dato={props.datosbanc.Beneficiario}
                    />
                    <CampoTexto 
                        Title="RUC"
                        ModoEdicion={Edicion}
                        DevolverDatoFunct={RegistrarDato}
                        DarDato={props.DarDato}
                        KeyDato="RUC"
                        Dato={props.datosbanc.RUC}
                    />
                </div>
                <MaterialTable
                    title="Datos de Cuentas Bancarias"
                    columns={columnas}
                    data={data}
                    editable={{
                        onRowAdd: newData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                            setData([...data, newData]);
                            
                            resolve();
                            }, 1000)
                        }),
                        onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                            const dataUpdate = [...data];
                            const index = oldData.tableData.id;
                            dataUpdate[index] = newData;
                            setData([...dataUpdate]);

                            resolve();
                            }, 1000)
                        }),
                        onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                            const dataDelete = [...data];
                            const index = oldData.tableData.id;
                            dataDelete.splice(index, 1);
                            setData([...dataDelete]);
                            
                            resolve()
                            }, 1000)
                        }),
                    }}

                />
            </div>

                // <span>Numero de cuentas bancarias</span>
                // <div className={styles.DataCuentasBancarias}>
                //     <span >Beneficiario</span><input className={styles.spanDoble} value={props.datosbanc.Beneficiario || "Nor Found"}/>
                //         <input value={banco.Nombre}/>
                //         <input value={banco.Cuenta}/>
                //         <input value={banco.CCI}/>

                //     <span>RUC</span><span className={styles.spanDoble}> {props.datosbanc.RUC || "Nor Found"} </span>
                //     <span>Direccion Registrada</span><span className={styles.spanDoble}> {props.datosbanc.DireccionRegistrada || "Nor Found"} </span>
                // </div>
            
        );
    // }else{
    //     columnas=[
    //         {title: 'Nombre del Banco', field: 'Nombre'},
    //         {title: 'Cuenta Bancaria', field: 'Cuenta'},
    //         {title: 'CCI', field: 'CCI'},
    //     ]
    //     return ( 
    //         <div>
    //             <span className={styles.DataCuentasBancarias}>Numero de cuentas bancarias</span>
    //             <div className={styles.CamposDeTexto}>
    //                 <CampoTexto 
    //                     Title="Beneficiario"
    //                     ModoEdicion={Edicion}
    //                     DevolverDatoFunct={RegistrarDato}
    //                     DarDato={props.DarDato}
    //                     KeyDato="Beneficiario"
    //                     Dato={{}}
    //                 />
    //                 <CampoTexto 
    //                     Title="RUC"
    //                     ModoEdicion={Edicion}
    //                     DevolverDatoFunct={RegistrarDato}
    //                     DarDato={props.DarDato}
    //                     KeyDato="RUC"
    //                     Dato={{}}
    //                 />
    //                 <CampoTexto 
    //                     Title="Direccion Registrada"
    //                     ModoEdicion={Edicion}
    //                     DevolverDatoFunct={RegistrarDato}
    //                     DarDato={props.DarDato}
    //                     KeyDato="DireccionRegistrada"
    //                     Dato={{}}
    //                 />
    //             </div>
                
    //             <MaterialTable
    //                 title="Datos de Cuentas Bancarias"
    //                 columns={columnas}
    //                 data={props.datosbanc.Bancos}
    //             />
    //         </div>
    //      );
    // }
}
const InputBanco = (props) => {
    const [Nombre, setNombre] = useState(props.Nombre || "");
    const [Cuenta, setCuenta] = useState(props.Cuenta || "");
    const [CCI, setCCI] = useState(props.CCI || "");
    eEffect(()=>{
        if(DevolverDato==true){
          props.FuncionDevolver(Nombre,Cuenta,CCI)
          setDevolverDato(false)
        }
      },[props.DevolverDato])

    return (
        <>
            <input value={Nombre} onChange={(event)=> setNombre(event.target.value)}/>
            <input value={Cuenta} onChange={(event)=> setCuenta(event.target.value)}/>
            <input value={CCI} onChange={(event)=> setCCI(event.target.value)}/>
        </>
    );
}
export default TablaBanco;