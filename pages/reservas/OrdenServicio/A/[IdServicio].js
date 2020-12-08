import CampoTexto from '@/components/Formulario/CampoTexto/CampoTexto'
import CampoGranTexto from '@/components/Formulario/CampoGranTexto/CampoGranTexto'
import MaterialTable from "material-table";
import Router from 'next/router'
import { useEffect, useState } from 'react'
import {useRouter} from 'next/router'
import { MongoClient } from "mongodb";

export default function OrdenServicioTipoA (){
    let x = {}

    function setData (key,data){
        x[key] = data
    }

    const [modoEdicion, setModoEdicion] = useState(false)
    const [darDato,setDarDato]  = useState(false)
    const showtitulos = ["Orden","Datos de Grupo"]
    const showOrden = [
        {
            Title: "Codigo de Grupo",
            ModoEdicion: modoEdicion,
            Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Nombre",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Codigo de Servicio",
            ModoEdicion: modoEdicion,
            Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Nombre",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Tipo de Orden",
            ModoEdicion: modoEdicion,
            Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Nombre",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
    ]
    const showDatosGrupo = [
        {
            Title: "Tour",
            ModoEdicion: modoEdicion,
            Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Nombre",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Guia",
            ModoEdicion: modoEdicion,
            Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Nombre",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Asistencia",
            ModoEdicion: modoEdicion,
            Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Nombre",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Fecha",
            ModoEdicion: modoEdicion,
            Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Nombre",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Numero de Pasajeros",
            ModoEdicion: modoEdicion,
            Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Nombre",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Tranporte",
            ModoEdicion: modoEdicion,
            Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Nombre",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Numero de porteadores",
            ModoEdicion: modoEdicion,
            Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Nombre",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
    ]

    return(
        <div>
            Tipo A
        </div>
    )
}