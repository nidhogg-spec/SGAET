import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { withSSRContext } from 'aws-amplify'

import MaterialTable from "material-table";
import Loader from '@/components/Loading/Loading'

//CSS
import global_style from '@/globalStyles/modules/global.module.css'
import styles from "@/globalStyles/Biblia.module.css";

const Index = ({
    APIPath
}) => {
    const router = useRouter()
    const [Loading, setLoading] = useState(false);
    const [DataCotizacion, setDataCotizacion] = useState([]);
    const [BibliaData_pasajeros, setBibliaData_pasajeros] = useState([]);

    useEffect(async () => {
        setLoading(true)
        await fetch(APIPath + '/api/reserva/Lista/ListaReserva')
            .then((r) => r.json())
            .then((data) => {
                setDataCotizacion(data.AllCotizacion);
            });
        setLoading(false);
    }, []);


    return (
        <div>
            <Loader Loading={Loading} />
            <div className={global_style.main_work_space_container}>
                <h1>Biblia</h1>
                <br />
                <h2>Lista de Reservas activas</h2>
                <MaterialTable
                    columns={
                        [{ title: "Id", field: "IdReservaCotizacion" },
                        { title: "Nombre de Grupo", field: "NombreGrupo" },
                        { title: "Codigo de Grupo", field: "CodGrupo" },
                        {
                            title: "Fecha IN",
                            field: "FechaIN",
                        },
                        {
                            title: "Fecha OUT",
                            field: "FechaOUT",
                        }]}
                    data={DataCotizacion}
                    title={null}
                    actions={
                        [
                            {
                                icon: () => {
                                    return <img src="/resources/remove_red_eye-24px.svg" />;
                                },
                                tooltip: "Ver mas datos",
                                onClick: (event, rowData) => {
                                    setBibliaData_pasajeros([

                                    ])
                                    document.getElementById("Extra_info").scrollIntoView({ behavior: 'smooth' });
                                },
                            },
                        ]}
                    options={{
                        actionsColumnIndex: -1,
                    }}
                />



            </div>
            <section id='Extra_info' ></section>
            <div className={global_style.main_work_space_container} >
                <h1>Datos de Reserva</h1>
                <br />
                <h2>Lista de clientes</h2>
                <MaterialTable
                    columns={
                        [{ title: "Id", field: "" },
                        { title: "Nombres", field: "" },
                        { title: "Apellidos", field: "" },
                        {
                            title: "Edad",
                            field: "",
                        }, {
                            title: "Numero de Pasajeros",
                            field: "",
                        }, {
                            title: "Nacionalidad",
                            field: "",
                        }, {
                            title: "Fecha de NAcimiento",
                            field: "",
                        }, {
                            title: "Etapa",
                            field: "",
                        }, {
                            title: "Vegetariano",
                            field: "",
                        }, {
                            title: "Alergia",
                            field: "",
                        }, {
                            title: "Noche extra",
                            field: "",
                        }]}
                    data={BibliaData_pasajeros}
                    title={null}
                />
                <div className={styles.second__biblia_data_container}>
                    <div>
                        <h2>Entradas</h2>
                        <MaterialTable
                            columns={
                                [{ title: "Id", field: "IdReservaCotizacion" },
                                { title: "Nombre Entrada", field: "" },
                                { title: "Fecha", field: "" },
                                {
                                    title: "Codigo",
                                    field: "",
                                }]}
                            data={DataCotizacion}
                            title={null}
                        />
                        <h2>Transporte</h2>
                        <MaterialTable
                            columns={[
                                { title: "Id", field: "IdReservaCotizacion" },
                                { title: "Inicio", field: "" },
                                { title: "Llegada", field: "" },
                                { title: "Fecha y Hora", field: "" }
                            ]}
                            data={DataCotizacion}
                            title={null}
                        />
                    </div>
                    <div>
                        <h2>Briefing</h2>
                        <MaterialTable
                            columns={[
                                { title: "Id", field: "IdReservaCotizacion" },
                                { title: "Inicio", field: "" },
                                { title: "Llegada", field: "" },
                                { title: "Tipo", field: "" },
                                { title: "Fecha y Hora", field: "" }
                            ]}
                            data={DataCotizacion}
                            title={null}
                        />
                        <h2>Equipo</h2>
                        <MaterialTable
                            columns={[
                                { title: "Id", field: "IdReservaCotizacion" },
                                { title: "Nombre de equipo", field: "" },
                                { title: "Cantidad", field: "" },
                                { title: "Descripcion", field: "" },
                            ]}
                            data={DataCotizacion}
                            title={null}
                        />
                        <h2>Observaciones</h2>
                        <MaterialTable
                            columns={[
                                { title: "Id", field: "IdReservaCotizacion" },
                                { title: "Nombre", field: "" },
                                { title: "Descripcion", field: "" },
                                { title: "Otro", field: "" },
                            ]}
                            data={DataCotizacion}
                            title={null}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

}
export async function getServerSideProps({ req, res }) {
    let DataReservas = []

    const APIpathGeneral = process.env.API_DOMAIN + "/api/general";

    const { Auth } = withSSRContext({ req })
    try {
        const user = await Auth.currentAuthenticatedUser()
    } catch (err) {
        res.writeHead(302, { Location: '/' })
        res.end()
    }
    return ({
        props: {
            APIPath: process.env.API_DOMAIN
        }
    })
}
export default Index;