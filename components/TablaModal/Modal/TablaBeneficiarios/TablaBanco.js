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
    const [data, setData] = useState(props.datosbanc ? (props.datosbanc.Bancos || []) : []);
    const [Edicion, setEdicion] = useState(props.ModoEdicion);


    let RegistBancos=[]
    let DataRegist={}
    useEffect(() => {
        setEdicion(props.ModoEdicion)
    }, [props.ModoEdicion]);

    useEffect(()=>{
        if(props.DarDato==true){
            RegistBancos =[] 
            data.map(dt =>{
                RegistBancos.push({Nombre:dt.Nombre,Cuenta:dt.Cuenta,CCI:dt.CCI})
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
                        Dato={props.datosbanc ? props.datosbanc.Beneficiario : ""}
                    />
                    <CampoTexto 
                        Title="RUC"
                        ModoEdicion={Edicion}
                        DevolverDatoFunct={RegistrarDato}
                        DarDato={props.DarDato}
                        KeyDato="RUC"
                        Dato={props.datosbanc ? props.datosbanc.RUC : ""}
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
        );
    }
export default TablaBanco;