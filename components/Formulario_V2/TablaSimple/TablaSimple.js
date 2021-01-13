//Package
import styles from "./TablaSimple.module.css";
import React, { useEffect, useState} from "react";

//Componentes
import MaterialTable from "material-table";

const TablaSimple = (props={
    Title:"Nombre del Proveedor",
    ModoEdicion:true,
    DevolverDatoFunct:{RegistrarDato},
    DarDato:{DevolverDato},
    KeyDato:"nombre",
    Dato:[],
    Reiniciar:true,
    columnas:[]
}) => {

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
                    editable={{
                        onRowAdd: newData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                            setData([...Data, newData]);
                            
                            resolve();
                            }, 1000)
                        }),
                        onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                            const dataUpdate = [...Data];
                            const index = oldData.tableData.id;
                            dataUpdate[index] = newData;
                            setData([...dataUpdate]);

                            resolve();
                            }, 1000)
                        }),
                        onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                            const dataDelete = [...Data];
                            const index = oldData.tableData.id;
                            dataDelete.splice(index, 1);
                            setData([...dataDelete]);
                            
                            resolve()
                            }, 1000)
                        }),
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
                />
            </div> 
        );
    }
    
    
}
 
export default TablaSimple;