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
import { egresoInterface, ingresoInterface } from "@/utils/interfaces/db";

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


const obtenerFinMes = (mes: string, anio: string): string => {
    const numeroAnio: number = +anio;
    if (["01", "03", "05", "07", "08", "10", "12"].includes(mes)) {
        return "31";
    } else if (["04", "06", "09", "11"].includes(mes)) {
        return "30";
    }

    if (mes === "02" && !(numeroAnio % 4)) {
        if (!(numeroAnio % 100)) {
            return !(numeroAnio % 400) ? "29" : "28";
        } else {
            return "29";
        }
    } else {
        return "28";
    }
}


const fechaMes = (inicio: boolean) => {
    const hoy: Date = new Date();
    const mes: string = (hoy.getMonth() + 1).toString().padStart(2, "0");
    const anio: string = hoy.getFullYear().toString();
    return inicio ? [
        anio,
        mes,
        "01"
    ].join("-") : [
        anio,
        mes,
        obtenerFinMes(mes, anio)
    ].join("-");
}

const procesarDatos = (dataIngresos : any, dataEgresos : any) => {
    const formatearFecha = (fecha : string) => {
                
        const formato = Intl.DateTimeFormat("es-pe", {
            dateStyle: "full",
            timeStyle: "short"
        });
        const fechaObjeto = new Date(fecha);
        return formato.format(fechaObjeto); 
    }
    const ingresos = dataIngresos.map((ingreso : any) => (
        {
            ...ingreso,
            ReservaCotizacion: ingreso.ListaRelacionesId?.idReservaCotizacion,
            FechaCreacion: formatearFecha(ingreso.FechaCreacion),
            FechaModificacion: formatearFecha(ingreso.FechaModificacion)
        }
    ));

    const egresos = dataEgresos.map((egreso : any) => (
        {
            ...egreso,
            ReservaCotizacion: egreso.ListaRelacionesId?.idReservaCotizacion,
            FechaCreacion: formatearFecha(egreso.FechaCreacion),
            FechaModificacion: formatearFecha(egreso.FechaModificacion)
        }
    ));
    return [ingresos, egresos];
}


export default function IngresosEgresos({ ingresos, egresos }: { ingresos: any[], egresos: any[] }) {


    const [display, setDisplay] = React.useState<boolean>(false);
    const [displayLeer, setDisplayLeer] = React.useState<boolean>(false);
    const [finanza, setFinanza] = React.useState({});
    const [ingresosEditables, setIngresosEditables] = React.useState(ingresos);
    const [egresosEditables, setEgresosEditables] = React.useState(egresos);

    const [fechas, setFechas] = React.useState<{ fechaInicio: string, fechaFin: string }>({
        fechaInicio: fechaMes(true),
        fechaFin: fechaMes(false)
    });

    const obtenerNombreReserva = async (idReservaCotizacion : string) => {
        const params = { idReservaCotizacion };
        const data = await axios.get("/api/reserva/DataReserva/CRUDReservaCotizacion", { params });
        const nombre = `${data.data.data[0].NombreGrupo || ""} / ${data.data.data[0].NombrePrograma || ""}`;
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

    const handleSubmit = async () => {
        
        const fechaFin = new Date(fechas.fechaFin);
        fechaFin.setDate(fechaFin.getDate() + 1);

        if (new Date(fechas.fechaInicio) > new Date(fechas.fechaFin)) {
            return;
        }

        const params = {
            fechaInicio: fechas.fechaInicio,
            fechaFin
        };
        const peticion = Promise.all([
            axios.get("/api/finanzas/ingresos", { params }),
            axios.get("/api/finanzas/egresos", { params })
        ]);

        const [dataIngresos, dataEgresos] = await peticion;
        const [nuevosIngresos, nuevosEgresos] = procesarDatos(dataIngresos.data.data, dataEgresos.data.data);
        setIngresosEditables(nuevosIngresos);
        setEgresosEditables(nuevosEgresos);
    }


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const { value, name } = event.target;
        setFechas((old: any) => {
            return {
                ...old,
                [name]: value
            };
        });
    }

    return (
        <div>
            <ModalFinanzaLeer
                open={displayLeer}
                setOpen={setDisplayLeer}
                finanza={finanza}
            />

            <div className={globalStyles.main_work_space_container}>
                <div className={styles.titleContainer}>
                    <h1 className="Titulo">Lista de Ingresos y Egresos del sistema</h1>

                    <TextField
                        name="fechaInicio"
                        label="Fecha de inicio"
                        type="date"
                        value={fechas?.fechaInicio}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }} >

                    </TextField>
                    <TextField
                        name="fechaFin"
                        label="Fecha fin"
                        type="date"
                        value={fechas?.fechaFin}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }} >

                    </TextField>
                    <div>
                        <button className={`${botones.button} ${botones.buttonGuardar}`} onClick={handleSubmit}>Buscar ingresos y egresos</button>

                    </div>

                </div>

                {getMaterialTable("ingresos")}

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

        const [ingresos, egresos] = procesarDatos(dataIngresos.data.data, dataEgresos.data.data);

        return {
            props: {
                ingresos,    
                egresos
            }
        }

    }, ironOptions
)