import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { MongoClient } from "mongodb";

//componentes
import CampoTexto from "@/components/TablaModal/Modal/CampoTexto/CampoTexto";
import Selector from '@/components/TablaModal/Modal/Selector/Selector'

export default function Clientes(){
  //Funciones
    const RegistrarDato = (keyDato, Dato) => {
        DataEdit[keyDato] = Dato;
    };
    useEffect(() => {
        if (DevolverDato == true) {
            console.log(APIpath);
            setDevolverDato(false);
            fetch(APIpath, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idProveedor: idProveedor,
                accion: "update",
                data: DataEdit,
            }),
            })
            .then((r) => r.json())
            .then((data) => {
                alert(data.message);
            });
        }
    }, [DevolverDato]);

    const [Edicion, setEdicion] = useState(false);
    const [DevolverDato, setDevolverDato] = useState(false);
    const [datosEditables, setDatosEditables] = useState(Datos)
    return(
        <div>
            gdsfg
        </div>
    )
}