import React from "react";
import MaterialTable from "material-table";
import globalStyles from "@/globalStyles/modules/global.module.css";
import styles from "@/globalStyles/Proveedor.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/config";

import TextField from "@material-ui/core/TextField";
import ModalFinanzaLeer from "@/components/ComponentesUnicos/Finanzas/ModalFinanzaLeer/ModalFinanzaLeer";
import { useForm } from "react-hook-form";
import { fechaMes } from "@/utils/API/generarId";
import LoadingComp from "@/components/Loading/Loading";

export default function IngresosEgresos({ ingresos, egresos, fechaInicio, fechaFin }: { ingresos: any[], egresos: any[], fechaInicio : string, fechaFin : string }) {
    const columnas = [
        {
            title: "Total",
            field: "Total"
        },
        {
            title: "Total Neto",
            field: "TotalNeto"
        },
        {
            title: "Comision",
            field: "Comision"
        },
        {
            title: "Adelanto",
            field: "Adelanto"
        },
        {
            title: "Metodo de Pago",
            field: "MetodoPago"
        },
        {
            title: "Fecha de Creacion",
            field: "FechaCreacion"
        },
        {
            title: "Fecha de Modificacion",
            field: "FechaModificacion"
        },
        {
            title: "Reserva Cotizacion",
            field: "ReservaCotizacion"
        }
    
    ]

    const [loading, setLoading] = React.useState<boolean>(false);
    const [displayLeer, setDisplayLeer] = React.useState<boolean>(false);
    const [finanza, setFinanza] = React.useState({});
    const [ingresosEditables, setIngresosEditables] = React.useState(ingresos);
    const [egresosEditables, setEgresosEditables] = React.useState(egresos);


    const defaultValues = {
        fechaInicio,
        fechaFin
    };

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues, mode: "onBlur" 
    });

    const obtenerNombreReserva = async (idReservaCotizacion : string) => {
        const params = { idReservaCotizacion };
        const data = await axios.get("/api/reserva/DataReserva/CRUDReservaCotizacion", { params });
        const nombre = `${data.data.data[0]?.NombreGrupo || ""} / ${data.data.data[0]?.NombrePrograma || ""}`;
        return nombre;
    }


    const getMaterialTable = (tipo: string) => {
        switch (tipo) {
            case "ingresos":
                const columnasIngresos = [{
                    title: "IdIngreso",
                    field: "IdIngreso",
                    hidden: true
                }, ...columnas];
                const accionMostrarIngreso = async (event: any, rowData: any) => {
                    const dt = ingresosEditables.find((value: any) => value.IdIngreso === rowData.IdIngreso);
                    const reservaCotizacion : string = await obtenerNombreReserva(dt.ReservaCotizacion);
                    setFinanza({
                        ...dt,
                        ReservaCotizacion: reservaCotizacion
                    });
                    setDisplayLeer(true);
                }
                const accionesIngreso = [
                    {
                        icon: () => <img src="/resources/remove_red_eye-24px.svg" />,
                        tooltip: "Mostrar todo",
                        onClick: accionMostrarIngreso
                    }
                ]
                return (
                    <MaterialTable
                        columns={columnasIngresos}
                        data={ingresosEditables}
                        title=""
                        actions={accionesIngreso}
                        options={{ actionsColumnIndex: -1 }}
                    />
                )
            case "egresos":
                const columnasEgresos = [{
                    title: "IdEgreso",
                    field: "IdEgreso",
                    hidden: true
                }, ...columnas];
                const accionMostrarEgreso = async (event: any, rowData: any) => {
                    const dt = egresosEditables.find((value: any) => value.IdEgreso === rowData.IdEgreso);
                    const reservaCotizacion = await obtenerNombreReserva(dt.ReservaCotizacion);
                    setFinanza({
                        ...dt,
                        ReservaCotizacion: reservaCotizacion
                    });
                    setDisplayLeer(true);
                }
                const accionesEgreso = [
                    {
                        icon: () => <img src="/resources/remove_red_eye-24px.svg" />,
                        tooltip: "Mostrar todo",
                        onClick: accionMostrarEgreso
                    }
                ]
                return (
                    <MaterialTable
                        columns={columnasEgresos}
                        data={egresosEditables}
                        title=""
                        actions={accionesEgreso}
                        options={{ actionsColumnIndex: -1 }}
                    />
                )
        }
    }

    const onSubmit = (data : any) => {
        setLoading(true);
        const buscar = async () => {
            const { fechaInicio, fechaFin } = data;
            const fechaFinDate = new Date(fechaFin);
            fechaFinDate.setDate(fechaFinDate.getDate() + 1);
    
            if (new Date(fechaInicio) > new Date(fechaFin)) {
                setIngresosEditables([]);
                setEgresosEditables([]);
                setLoading(false);
                return;
            }
    
            const params = {
                fechaInicio,
                fechaFin: fechaFinDate
            };
            const peticion = Promise.all([
                axios.get("/api/finanzas/ingresos", { params }),
                axios.get("/api/finanzas/egresos", { params })
            ]);
    
            const [dataIngresos, dataEgresos] = await peticion;
            setIngresosEditables(dataIngresos.data.data);
            setEgresosEditables(dataEgresos.data.data);
            setLoading(false);
        }
        buscar();
    }

    React.useEffect(() => {
        reset({
            fechaInicio,
            fechaFin
        });
    }, [])


    return (
        <div>
            <LoadingComp Loading={loading} />
            { displayLeer && <ModalFinanzaLeer
                open={displayLeer}
                setOpen={setDisplayLeer}
                finanza={finanza}
            />} 

            <div className={globalStyles.main_work_space_container}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.titleContainer}>
                    <h1 className="Titulo">Lista de Ingresos y Egresos del sistema</h1>

                    <TextField
                        label="Fecha de inicio"
                        type="date"
                        {...register("fechaInicio", { required: true})}
                        InputLabelProps={{ shrink: true }} >

                    </TextField>
                    <TextField
                        label="Fecha fin"
                        type="date"
                        {...register("fechaFin", { required: true })}
                        InputLabelProps={{ shrink: true }} >

                    </TextField>
                    <div>
                        <button className={`${botones.button} ${botones.buttonGuardar}`}>Buscar ingresos y egresos</button>

                    </div>

                </form>
                <h2>Ingresos</h2>
                {getMaterialTable("ingresos")}
                <h2>Egresos</h2>
                {getMaterialTable("egresos")}

            </div>

        </div>
    )
}


export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req, res }) {
        const user = req.session.user;
        if (!user) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/login"
                }
            };
        }

        const headers = req.headers;
        const mes = new Date().getMonth() + 1;
        const anio = new Date().getFullYear();
        const params = {
            mes,
            anio
        };

        const data = Promise.all([
            axios.get(`${process.env.API_DOMAIN}/api/finanzas/ingresos`, { params, headers }),
            axios.get(`${process.env.API_DOMAIN}/api/finanzas/egresos`, { params, headers })
        ]);

        const [dataIngresos, dataEgresos] = await data;

        const ingresos = dataIngresos.data.data;
        const egresos = dataEgresos.data.data;
        const fechaInicio = fechaMes(true);
        const fechaFin = fechaMes(false);

        return {
            props: {
                ingresos,    
                egresos,
                fechaInicio,
                fechaFin
            }
        }

    }, ironOptions
)