//Package
import styles from "./TablaServicioEscogido.module.css";
import React, { useEffect, useState} from "react";
import {useRouter} from 'next/router'

//Componentes
import MaterialTable from "material-table";

const TablaServicioEscogido = (props={
    Title:"Nombre del Proveedor",
    ModoEdicion:true,
    DevolverDatoFunct:{RegistrarDato},
    DarDato:{DevolverDato},
    KeyDato:"nombre",
    Dato:[],
    Reiniciar:true,
    columnas:[]
}) => {
    const router = useRouter()
    let editableacion={}
    const [ModoEdicion, setModoEdicion] = useState(props.ModoEdicion);
    const [Data, setData] = useState([]);
    useEffect(()=>{
        setData(props.Dato)
    },[props.Dato])
    useEffect(() => {
        if (props.Reiniciar==true) {
            setData(props.Dato)
        }
    }, [props.Reiniciar]);
    useEffect(() => {
        setModoEdicion(props.ModoEdicion)
    },[props.ModoEdicion]);

    useEffect(()=>{
        if(props.DarDato==true){
            props.DevolverDatoFunct(props.KeyDato,Data)
        }
    },[props.DarDato])
    
    if(ModoEdicion==true){
        return ( 
            <div>
                <span>{props.Title}</span>
                <MaterialTable
                    title={props.Title}
                    columns={props.columnas}
                    data={Data}
                    actions={[
                        rowData => ({
                          icon: 'delete',
                          tooltip: 'Delete User',
                          onClick: (event, rowData) => confirm("You want to delete " + rowData.name),
                        }),
                        rowData => ({
                            icon: () => {
                              return <img src="/resources/remove_red_eye-24px.svg" />;
                            },
                            tooltip: "Mostrar reserva",
                            onClick: (event, rowData) => {
                              router.push(`/reservas/servicio/${rowData.IdServicioEscogido}`)
                            },
                            // disabled: rowData.OrdenServicio==null
                          }),
                      ]}
                      options={{
                        actionsColumnIndex: -1
                      }}

                />
            </div> );
    }else{
        return ( 
            <div className={styles.divMadre}>
                <MaterialTable
                    title={props.Title}
                    columns={props.columnas}
                    data={Data}
                    actions={[
                        rowData => ({
                            icon: () => {
                              return <img src="/resources/remove_red_eye-24px.svg" />;
                            },
                            tooltip: "Mostrar reserva",
                            onClick: (event, rowData) => {
                              router.push(`/reservas/servicio/${rowData.IdServicioEscogido}`)
                            },
                            // disabled: rowData.OrdenServicio==null
                          }),
                          rowData => ({
                            icon: () => {
                              return <img src="/resources/remove_red_eye-24px.svg" />;
                            },
                            tooltip: "Orden de servicio",
                            onClick: (event, rowData) => {
                              router.push(`/reservas/OrdenServicio/${rowData.OrdenServicio['TipoOrden']}/${rowData.IdServicioEscogido}`)
                            },
                            disabled: rowData.OrdenServicio==null
                          }),
                      ]}
                      options={{
                        actionsColumnIndex: -1
                      }}
                />
            </div> 
        );
    }
    
    
}
 
export default TablaServicioEscogido;