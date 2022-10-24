import React from "react";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { estadosReservaCotizacion } from "@/utils/dominio";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/config";

import Loader from "@/components/Loading/Loading";
import MaterialTable, { Column } from "material-table";
import axios from "axios";
import { resetServerContext } from "react-beautiful-dnd";
import { Modal } from "@mui/material";
import { useForm } from "react-hook-form"

import styles from "@/globalStyles/DetalleReservaCotizacion.module.css";
import formStyles from "@/components/Formulario_V2/AutoFormulario/AutoFormulario.module.css";
import campoTextoStyles from "@/components/Formulario_V2/CampoTexto/CampoTexto.module.css";
import selectStyles from "@/components/Formulario_V2/Selector/Selector.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import globalStyles from "@/globalStyles/modules/global.module.css";
import ModalPasajeros from "@/components/ComponentesUnicos/Biblia/Pasajeros/ModalPasajero";
import { BreakfastDining, DisabledByDefault } from "@mui/icons-material";

const estadosReservaCotizacion_array: any[] = Object.values(estadosReservaCotizacion);

const columnasPasajero: any[] = [
    { title: "Nombre", field: "Nombre" },
    { title: "Apellido", field: "Apellido" },
    { title: "Tipo de documento", field: "TipoDocumento" },
    { title: "Numero de documento", field: "NroDocumento" },
    { title: "Sexo", field: "Sexo" },
    { title: "Celular", field: "Celular" },
    { title: "Nacionalidad", field: "Nacionalidad" }
];

const ReservaCotizacion = ({ APIPatch }: { APIPatch: string }) => {
    const router: NextRouter = useRouter();
    const { IdReservaCotizacion } = router.query;

    const [reservaCotizacion, setReservaCotizacion] = React.useState<any>({});
    const [serviciosEscogidos, setServiciosEscogidos] = React.useState<any[]>([]);
    const [allServiciosProductos, setAllServiciosProductos] = React.useState<any[]>([]);
    const [clienteCotizacion, setClienteCotizacion] = React.useState<any>({});
    const [estado, setEstado] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [modoEdicion, setModoEdicion] = React.useState<boolean>(false);
    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const refPago: React.MutableRefObject<any> = React.useRef(null);

    const [currency, setCurrency] = React.useState<string>("Dolar");
    const [montoTotal, setMontoTotal] = React.useState<number>(0);
    const [cambioDolar, setCambioDolar] = React.useState<number>(0);
    const refEstado: React.MutableRefObject<any> = React.useRef(null);

    const [display, setDisplay] = React.useState<boolean>(false);
    const [pasajeroSeleccionado, setPasajeroSeleccionado] = React.useState(null);

    const defaultValuesServicioCotizacion = {
        CodGrupo: "",
        NombreGrupo: "",
        NpasajerosAdult: 0,
        NpasajerosChild: 0,
        FechaIN: "",
        FechaOUT: "",
        Voucher: "",
        Idioma: "",
        FechaEntrega: ""
    };

    const defaultValuesClienteCotizacion = {
        NombreCompleto: "",
        TipoDocumento: "DNI",
        NroDocumento: "",
        Celular: "",
        Email: ""
    }

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: defaultValuesServicioCotizacion, mode: "onBlur" });


    const { register: registerCliente, reset: resetCliente, handleSubmit : handleSubmitClienteCotizacion } = useForm({
        defaultValues: defaultValuesClienteCotizacion, mode: "onBlur"
    });

    React.useEffect(() => {
        reset({
            CodGrupo: reservaCotizacion.CodGrupo ?? "",
            NombreGrupo: reservaCotizacion.NombreGrupo ?? "",
            NpasajerosAdult: reservaCotizacion.NpasajerosAdult ?? 0,
            NpasajerosChild: reservaCotizacion.NpasajerosChild ?? 0,
            FechaIN: reservaCotizacion.FechaIN ?? "",
            FechaOUT: reservaCotizacion.FechaOUT ?? "",
            Voucher: reservaCotizacion.Voucher ?? "",
            Idioma: reservaCotizacion.Idioma ?? "",
            FechaEntrega: reservaCotizacion.FechaEntrega ?? ""
        });
    }, [reservaCotizacion])

    React.useEffect(() => {
        resetCliente({
            NombreCompleto: clienteCotizacion.NombreCompleto ?? "",
            TipoDocumento: clienteCotizacion.TipoDocumento ?? "",
            NroDocumento: clienteCotizacion.NroDocumento ?? "",
            Celular: clienteCotizacion.Celular ?? "",
            Email: clienteCotizacion.Email ?? ""
        });
    }, [clienteCotizacion])

    const obtenerData = async () => {
        setLoading(true);
        const [reserva, servicios, valor] = await Promise.all([
            axios.get(`${APIPatch}/api/reserva/DataReserva/${IdReservaCotizacion}`),
            axios.get(`${APIPatch}/api/Cotizacion/ObtenerTodosServicios`),
            axios.post(`${APIPatch}/api/DataSistema`, {
                accion: "ObtenerCambioDolar"
            })
        ]);
        const { data: dataReserva } = reserva;
        setReservaCotizacion(dataReserva.reservaCotizacion);
        setServiciosEscogidos(dataReserva.reservaCotizacion?.ServicioProducto ?? []);
        setClienteCotizacion(dataReserva.clienteProspecto);
        dataReserva.reservaCotizacion["Estado"] ? setEstado(dataReserva.reservaCotizacion["Estado"]) : setEstado(0);

        const { data: dataServicios } = servicios;
        setAllServiciosProductos(dataServicios.data);

        const { data: dataValor } = valor;
        setCambioDolar(dataValor["value"]);
        setLoading(false);
    }

    React.useEffect(() => {
        obtenerData();
    }, [])

    const calcularTotal = (): number => {
        let tempMontoTotal: number = 0;
        let currencyTotal: string = currency;
        if (serviciosEscogidos !== undefined) {
            switch (currencyTotal) {
                case "Dolar":
                    serviciosEscogidos.map((cotiServicio: any) => {
                        switch (cotiServicio["Currency"] || "Dolar") {
                            case "Dolar":
                                tempMontoTotal += parseFloat(cotiServicio["PrecioCotiTotal"]);
                                break;
                            case "Sol":
                                tempMontoTotal += parseFloat(cotiServicio["PrecioCotiTotal"]) / cambioDolar;
                                break;
                        }
                    });
                    break;
                case "Sol":
                    serviciosEscogidos.map((cotiServicio: any) => {
                        switch (cotiServicio["Currency"]) {
                            case "Dolar":
                                tempMontoTotal += parseFloat(cotiServicio["PrecioCotiTotal"]) * cambioDolar;
                                break;
                            case "Sol":
                                tempMontoTotal += parseFloat(cotiServicio["PrecioCotiTotal"]);
                                break;
                        }
                    });
                    break;
            }
        }
        return tempMontoTotal;
    }

    React.useEffect(() => {
        setMontoTotal(calcularTotal());
    }, [serviciosEscogidos, currency])


    // Funcionamiento de la tabla devolucion
    const [devolucion, setDevolucion] = React.useState<any[]>([]);
    const handlePagadoSubmit = async () => {
        const formData = new FormData(refPago.current)!;
        const data = {
            Adelanto: parseFloat(parseFloat(formData.get("Adelanto") as string).toFixed(2)),
            MetodoPago: formData.get("MetodoPago")
        };
        let arrayData = Object.values(data);
        if (arrayData.includes("") || arrayData.includes(null) || arrayData.includes(NaN)) {
            alert("Faltan datos");
        } else {
            const tempMontoTotal: number = calcularTotal();
            setModalOpen(false);
            setLoading(true);
            const estadoVal: number = parseInt(refEstado.current.value);
            const [crudReservaCotizacion, ingresos] = await Promise.all([
                axios.post(`${APIPatch}/api/reserva/DataReserva/CRUDReservaCotizacion`, {
                    data: { Estado: estadoVal },
                    idProducto: IdReservaCotizacion,
                    accion: "update"
                }),
                axios.post(`${APIPatch}/api/finanzas/ingresos`, {
                    accion: "create",
                    data: {
                        Npasajeros: (reservaCotizacion["NpasajerosAdult"] || 0) + (reservaCotizacion["NpasajerosChild"] || 0),
                        Total: tempMontoTotal,
                        TotalNeto: 0,
                        Comision: 0,
                        IdReservaCotizacion: IdReservaCotizacion,
                        ...data
                    }
                })
            ]);
            setLoading(false);
        }
    }

    let idEncripted: string = "";
    if (reservaCotizacion?.URLLlenadoPasajeros) {
        idEncripted = reservaCotizacion.URLLlenadoPasajeros.split("LlenadoPasajeros/");
        idEncripted = idEncripted[1] ?? "";
    }

    const accionesPasajeros = [
        {
            icon: () => <img src="/resources/remove_red_eye-24px.svg" />,
            tooltip: "Ver mas detalles",
            onClick: async (event: any, rowData: any) => {
                setPasajeroSeleccionado(rowData);
                setDisplay(true);
            }
        }
    ]

    const accionGuardar = async (data : any) => {
        setLoading(true);
        await Promise.all([
            new Promise<void>(async (resolve, reject) => {
                let tempServiciosEscogidos = [...serviciosEscogidos];
                tempServiciosEscogidos.map((servicio : any) => {
                    servicio["IdReservaCotizacion"] = IdReservaCotizacion;
                });
                await axios.put(`${APIPatch}/api/reserva/DataServicio/CRUD`, {
                    ServicioEscogido: tempServiciosEscogidos,
                    Accion: "UpdateMany"
                });
                resolve();
            }),
            new Promise<void>(async (resolve, reject) => {
                await axios.post(`${APIPatch}/api/reserva/DataReserva/CRUDReservaCotizacion`, {
                    data: data,
                    idProducto: IdReservaCotizacion,
                    accion: "update"
                });
                resolve();
            })
        ]);
        setLoading(false);
    }

    const accionCancelar = () => {
        setModoEdicion(false);
    }

    const accionVoucher = async () => {
        setLoading(true);
        const pdf = await axios.get(`${APIPatch}/api/reserva/Voucher/GetVocher/${IdReservaCotizacion}`);
        const { data } = pdf;
        const link = document.createElement("a");
        link.download = "file.pdf";
        link.href = "data:application/octet-stream;base64," + data.data;
        link.click();
        setLoading(false);
    }

    const onSelectChange = async () => {
        setLoading(true);
        const estadoVal = parseInt(refEstado.current.value);
        if (estadoVal > estado) {
            if (confirm("¿Esta seguro de cambiar de estado?")) {
                setEstado(estadoVal);
                if (estadoVal == 2) {
                    setModalOpen(true);
                } else {
                    await axios.post(`${APIPatch}/api/reserva/DataReserva/CRUDReservaCotizacion`, {
                        data: { Estado: estadoVal },
                        idProducto: IdReservaCotizacion,
                        accion: "update"
                    });
                }
            }
        }
        setLoading(false);
    }

    return (

        <>
            <Loader Loading={loading} />
            <div className={globalStyles.main_work_space_container}>
                <div className={styles.title_container}>
                    <h1>Reserva/Cotizacion</h1>
                    {modoEdicion ? (
                        <>
                            <button className={`${botones.button} ${botones.buttonGuardar}`} onClick={handleSubmit(accionGuardar)}>
                                Guardar <img src="/resources/save-black-18dp.svg" />
                            </button>
                            <button className={`${botones.button} ${botones.buttonCancelar}`} onClick={accionCancelar}>
                                Cancelar <img src="/resources/close-black-18dp.svg" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`} onClick={() => setModoEdicion(true)}>
                                Editar <img src="/resources/edit-black-18dp.svg" />
                            </button>
                        </>
                    )}
                    <button className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`} onClick={accionVoucher}> Descargar Voucher</button>
                </div>

                <Modal open={modalOpen} className={styles.modal}>
                    <div className={styles.ModalMainContainer}>
                        <form ref={refPago}>
                            <input type="number" min="0.00" step="0.10" placeholder="Adelanto" name="Adelanto"></input>
                            <input placeholder="Metodo de Pago" name="MetodoPago"></input>
                            <button onClick={handlePagadoSubmit}>Continuar</button>
                        </form>
                    </div>
                </Modal>

                <div className={styles.Estado_Input_container}>
                    <h3>Estado de Reserva/Cotizacion</h3>
                    <select value={estado} ref={refEstado} onChange={onSelectChange}>
                        {estadosReservaCotizacion_array.map((estado: any) => <option value={estado.numero}>{estado.estado}</option>)}
                    </select>
                </div>

                <div>
                    <div>
                        <h3>Datos de Reserva/Cotizacion</h3>
                        <div className={formStyles.Modal_content}>

                            <form onSubmit={handleSubmit(accionGuardar)}>
                                <div className={campoTextoStyles.divMadre}>
                                    <span>Codigo de grupo</span>
                                    <input type="text" {...register("CodGrupo")} disabled={!modoEdicion}></input>
                                </div>
                                <div className={campoTextoStyles.divMadre}>
                                    <span>Nombre de grupo</span>
                                    <input type="text" {...register("NombreGrupo")} disabled={!modoEdicion}></input>
                                </div>
                                <div className={campoTextoStyles.divMadre}>
                                    <span>Numero de pasajeros adultos</span>
                                    <input type="number" {...register("NpasajerosAdult")} disabled={!modoEdicion}></input>
                                </div>
                                <div className={campoTextoStyles.divMadre}>
                                    <span>Numero de pasajeros niños</span>
                                    <input type="number" {...register("NpasajerosChild")} disabled={!modoEdicion}></input>
                                </div>
                                <div className={campoTextoStyles.divMadre}>
                                    <span>Fecha IN</span>
                                    <input type="date" {...register("FechaIN")} disabled={!modoEdicion}></input>
                                </div>
                                <div className={campoTextoStyles.divMadre}>
                                    <span>Fecha OUT</span>
                                    <input type="date" {...register("FechaOUT")} disabled={!modoEdicion}></input>
                                </div>
                                <div className={campoTextoStyles.divMadre}>
                                    <span>Voucher</span>
                                    <input type="text" {...register("Voucher")} disabled={!modoEdicion}></input>
                                </div>
                                <div className={campoTextoStyles.divMadre}>
                                    <span>Idioma</span>
                                    <input type="text" {...register("Idioma")} disabled={!modoEdicion}></input>
                                </div>
                                <div className={campoTextoStyles.divMadre}>
                                    <span>Fecha de entrega de voucher</span>
                                    <input type="date" {...register("FechaEntrega")} disabled={!modoEdicion}></input>
                                </div>
                            </form>
                        </div>

                        <div className={globalStyles.global_textInput_container}>
                            <span>Moneda</span>
                            <select onChange={(event) => setCurrency(event.target.value)}>
                                <option value="Dolar" selected>Dolares</option>
                                <option value="Sol" selected>Soles</option>
                            </select>
                        </div>
                        <div className={globalStyles.global_textInput_container}>
                            <span>Precio</span>
                            <input value={`$ ${montoTotal.toFixed(2)}`} type="text" disabled></input>
                        </div>
                    </div>

                    <div>
                        <h3>Llenado de pasajeros</h3>
                        <div className={styles.Pasajeros_Input_container}>
                            <span>Link de Formulario de pasajeros</span>
                            <input value={reservaCotizacion.URLLenadoPasajeros ?? ""} disabled></input>
                            <Link href={`/LlenadoPasajeros/${idEncripted}`}>
                                <a className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}>Llenar lista de pasajeros</a>
                            </Link>
                        </div>

                        <h3>Datos del cotizante</h3>
                        <div className={formStyles.Modal_content}>
                            <form>
                                <div className={campoTextoStyles.divMadre}>
                                    <span>Nombre completo</span>
                                    <input type="text" {...registerCliente("NombreCompleto")} disabled={!modoEdicion}></input>
                                </div>
                                <div className={selectStyles.divMadre}>
                                    <span>Tipo de documento</span>
                                    <select {...registerCliente("TipoDocumento")} disabled={!modoEdicion} defaultValue="DNI">
                                        <option value={0} selected>DNI</option>
                                        <option value={1}>RUC</option>
                                        <option value={2}>Pasaporte</option>
                                        <option value={3}>Carné de Extranjería</option>
                                    </select>
                                </div>
                                <div className={campoTextoStyles.divMadre}>
                                    <span>Nro de documento</span>
                                    <input type="text" {...registerCliente("NroDocumento")} disabled={!modoEdicion}></input>
                                </div>
                                <div className={campoTextoStyles.divMadre}>
                                    <span>Celular principal</span>
                                    <input type="text" {...registerCliente("Celular")} disabled={!modoEdicion}></input>
                                </div>
                                <div className={campoTextoStyles.divMadre}>
                                    <span>Email principal</span>
                                    <input type="text" {...registerCliente("Email")} disabled={!modoEdicion}></input>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div></div>
                    <div>
                        <h3>Lista de pasajeros</h3>
                        <ModalPasajeros
                            open={display}
                            setOpen={setDisplay}
                            pasajero={pasajeroSeleccionado}
                        />
                        <MaterialTable
                            title=""
                            columns={columnasPasajero}
                            data={reservaCotizacion?.ListaPasajeros}
                            actions={accionesPasajeros}
                            options={{ actionsColumnIndex: -1 }}
                        />
                    </div>
                    <div>
                        <TablaServicioCotizacion
                            Title="Servicios/Productos de la Reserva/Cotizacion"
                            setCotiServicio={setServiciosEscogidos}
                            CotiServicio={serviciosEscogidos || []}
                            ListaServiciosProductos={allServiciosProductos || []}
                            FechaIN={reservaCotizacion["FechaIN"]}
                            setMontoTotal={setMontoTotal}
                            APIPatch={APIPatch}
                            IdReservaCotizacion={IdReservaCotizacion!}
                        />
                    </div>
                </div>

            </div>
        </>

    )


}

export default ReservaCotizacion;

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps(context: any) {
        const user = context.req.session.user;
        if (!user) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/login"
                }
            };
        }
        resetServerContext();
        const APIPatch = process.env.API_DOMAIN;
        return {
            props: {
                APIPatch
            }
        };
    }, ironOptions
);

const TablaServicioCotizacion = (
    props: {
        Title: string,
        setCotiServicio: Function,
        CotiServicio: any[],
        ListaServiciosProductos: any[],
        FechaIN: string,
        setMontoTotal: Function,
        APIPatch: string,
        IdReservaCotizacion: string | string[]
    }
) => {
    const columnasTablaServicioCotizacion : any = [
        {
            field: "IdServicioProducto",
            title: "IdServicioProducto",
            editable: "never",
            hidden: true
        },
        {
            field: "PrecioConfiUnitario",
            title: "Precio Confidencial Unitario",
            editable: "never",
            type: "numeric",
            hidden: true
        },
        {
            field: "NombreServicio",
            title: "Nombre",
            editable: "never"
        },
        {
            field: "Dia",
            title: "Dia",
            editable: "always",
            type: "numeric"
        },
        {
            field: "FechaReserva",
            title: "Fecha de Reserva",
            editable: "never",
            type: "date"
        },
        {
            field: "Cantidad",
            title: "Cantidad",
            editable: "always",
            type: "numeric"
        },
        {
            field: "Currency",
            title: "Moneda",
            editable: "never",
            lookup: { Dolar: "Dolares", Sol: "Nuevos Soles" }
        },
        {
            field: "PrecioCotiUnitario",
            title: "Precio Cotizacion Unitario",
            editable: "always",
            type: "numeric"
        },
        {
            field: "PrecioPublicado",
            title: "Precio Publicado",
            editable: "never",
            type: "numeric"
        },
        {
            field: "IGV",
            title: "¿IGV incluido?",
            editable: "always",
            type: "boolean"
        },
        {
            field: "PrecioCotiTotal",
            title: "Precio Cotizacion Total",
            editable: "never",
            type: "numeric"
        },
        {
            field: "PrecioConfiTotal",
            title: "Precio Confidencial Total",
            editable: "never",
            type: "numeric"
        }
    ];

    resetServerContext();
    const router = useRouter();
    const [currencyTotal, setCurrencyTotal] = React.useState<string>("Dolar");
    const [montoTotal, setMontoTotal] = React.useState<number>(0);
    const [cambioDolar, setCambioDolar] = React.useState<number>(0);
    const notAgain = React.useRef(true);

    React.useEffect(() => {
        if (notAgain.current) {
            notAgain.current = false;
            return;
        }
        let tempMontoTotal: number = 0;
        if (props.CotiServicio !== undefined) {
            switch (currencyTotal) {
                case "Dolar":
                    props.CotiServicio.map((uniCotiServicio: any) => {
                        switch (uniCotiServicio["Currency"] || "Dolar") {
                            case "Dolar":
                                tempMontoTotal += parseFloat(uniCotiServicio["PrecioCotiTotal"]);
                                break;
                            case "Sol":
                                tempMontoTotal += parseFloat(uniCotiServicio["PrecioCotiTotal"]) / cambioDolar;
                                break;
                        }
                    });
                    break;
                case "Sol":
                    props.CotiServicio.map((uniCotiServicio) => {
                        switch (uniCotiServicio["Currency"]) {
                            case "Dolar":
                                tempMontoTotal += parseFloat(uniCotiServicio["PrecioCotiTotal"]) * cambioDolar;
                                break;
                            case "Sol":
                                tempMontoTotal += parseFloat(uniCotiServicio["PrecioCotiTotal"]);
                                break;
                        }
                    });
                    break;
            }
        }
        notAgain.current = true;
        setMontoTotal(tempMontoTotal);
        props.setMontoTotal(tempMontoTotal);
        ActualizarFechas();
    }, [props.CotiServicio, currencyTotal]);

    const peticionCambioDolar = async () => {
        const respuesta = await axios.post("/api/DataSistema", {
            accion: "ObtenerCambioDolar"
        });
        const { data } = respuesta;
        setCambioDolar(data.value);
        sessionStorage.setItem("CambioDolar", data.value);
    }

    React.useEffect(() => {
        const cambioDolarTemp = sessionStorage.getItem("CambioDolar");
        if (cambioDolarTemp) {
            setCambioDolar(JSON.parse(cambioDolarTemp));
        } else {
            peticionCambioDolar();
        }

    }, [])

    React.useEffect(() => {
        ActualizarFechas();
    }, [props.FechaIN])

    const ActualizarFechas = () => {
        const fechaInicio: Date = new Date(props.FechaIN);
        let tempCotiServicio = [...props.CotiServicio];
        tempCotiServicio.map((item: any) => {
            let tempDate: Date = new Date(fechaInicio);
            if (item["Dia"]) {
                let dt = tempDate.getDate() + parseInt(item["Dia"]);
                tempDate.setDate(dt);
                item["FechaReserva"] = tempDate.toLocaleDateString();
            } else {
                let dt = tempDate.getDate() + 1;
                tempDate.setDate(dt);
                item["FechaReserva"] = tempDate.toLocaleDateString();
            }
            props.setCotiServicio(tempCotiServicio);
        });
    }

    const materialTableUpdate = (cambios: any) => new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            let tempCotiServicio = [...props.CotiServicio];
            Object.entries(cambios).map((cambio: any) => {
                let tempNewData = cambio[1]["newData"];
                let id = tempNewData["tableData"]["id"];
                tempCotiServicio[id]["Cantidad"] = tempNewData["Cantidad"]
                tempCotiServicio[id]["Dia"] = tempNewData["Dia"];
                tempCotiServicio[id]["IGV"] = tempNewData["IGV"];
                if (tempCotiServicio[id]["IGV"]) {
                    tempCotiServicio[id]["PrecioCotiTotal"] = (tempNewData["Cantidad"] * tempNewData["PrecioCotiUnitario"] * 1.18).toFixed(2);
                    tempCotiServicio[id]["PrecioConfiTotal"] = (tempNewData["Cantidad"] * tempNewData["PrecioConfiUnitario"] * 1.18).toFixed(2);
                } else {
                    tempCotiServicio[id]["PrecioCotiTotal"] = (tempNewData["Cantidad"] * tempNewData["PrecioCotiUnitario"]).toFixed(2);
                    tempCotiServicio[id]["PrecioConfiTotal"] = (tempNewData["Cantidad"] * tempNewData["PrecioConfiUnitario"]).toFixed(2);
                }
                tempCotiServicio[id]["PrecioCotiUnitario"] = tempNewData["PrecioCotiUnitario"];
                axios.put(`${props.APIPatch}/api/ServicioEscogido/CRUD/${tempCotiServicio[id]["IdServicioEscogido"]}`, { ServicioEscogido: tempCotiServicio[id] });
            });
            props.setCotiServicio(tempCotiServicio);
            resolve();
        }, 1000);
    });

    const materialTableDelete = (oldData : any) => new Promise<void>((resolve, reject) => {
        setTimeout(async () => {
            const dataDelete = [...props.CotiServicio];
            const index = oldData.tableData.id;
            dataDelete.splice(index, 1);
            props.setCotiServicio([...dataDelete]);
            const result = await axios.delete(`${props.APIPatch}/api/ServicioEscogido/CRUD/${oldData["IdServicioEscogido"]}`);
            resolve();
        }, 1000);
    })

    /* const materialTableActions = [
        {
            icon: () => <img src="/resource/remove_red_eye-24px.svg" />,
            tooltip: "Mostrar reserva",
            onClick: (event : any, rowData : any) => {
                router.push(`/reservas/servicio/${rowData.IdServicioEscogido}`);
            }
        }
    ] */

    const columnasServicioAnadir : any = [
        {
            field: "IdServicioProducto",
            title: "IdServicioProducto",
            editable: "never",
            hidden: true
        },
        {
            field: "TipoServicio",
            title: "Tipo de servicio",
            editable: "never"
        },
        {
            field: "Nombre", title: "Nombre", editable: "never"
        },
        {
            field: "NombreProveedor", title: "Nombre del proveedor"
        },
        {
            field: "PuntajeProveedor", title: "Puntaje del proveedor"
        },
        {
            field: "Descripcion", title: "Descripcion", editable: "never"
        },
        {
            field: "Currency", title: "Moneda", editable: "never", lookup: { Dolar: "dolares", Sol: "Nuevos Soles" }
        },
        {
            field: "Precio",
            title: "Precio cotizacion",
            editable: "never",
            type: "numeric"
        },
        {
            field: "Costo",
            title: "Precio confidencial",
            editable: "never",
            type: "numeric"
        },
        {
            field: "PrecioPublicado",
            title: "Precio publicado",
            editable: "never",
            type: "numeric"
        }
    ];

    const accionesServicio = [
        {
            icon: "add",
            tooltip: "Añadir servicio a cotizacion",
            onClick: async (event : any, rowData : any) => {
                let x = [...props.CotiServicio];
                x.push({
                    IdServicioProducto: rowData["IdServicioProducto"],
                    TipoServicio: rowData["TipoServicio"],
                    PrecioConfiUnitario: rowData["Costo"],
                    NombreServicio: rowData["Nombre"],
                    Dia: 1,
                    Cantidad: 1,
                    PrecioCotiUnitario: rowData["Precio"],
                    IGV: false,
                    PrecioCotiTotal: rowData["Precio"],
                    PrecioConfiTotal: rowData["Costo"],
                    Currency: rowData["Currency"],
                    PrecioPublicado: rowData["PrecioPublicado"]
                });
                await axios.post(`${props.APIPatch}/api/ServicioEscogido/CRUD/0`, {
                    ServicioEscogido: {
                        IdServicioProducto: rowData["IdServicioProducto"],
                        TipoServicio: rowData["TipoServicio"],
                        PrecioConfiUnitario: rowData["Costo"],
                        NombreServicio: rowData["Nombre"],
                        Dia: 1,
                        Cantidad: 1,
                        PrecioCotiUnitario: rowData["Precio"],
                        IGV: false,
                        PrecioCotiTotal: rowData["Precio"],
                        PrecioConfiTotal: rowData["Costo"],
                        Currency: rowData["Currency"],
                        PrecioPublicado: rowData["PrecioPublicado"],
                        IdReservaCotizacion: props.IdReservaCotizacion
                    }
                });
                let getAllServiciosEscogido = await axios.get(`${props.APIPatch}/api/reserva/DataServicio/${props.IdReservaCotizacion}`);
                props.setCotiServicio(getAllServiciosEscogido.data.AllServicioEscogido)
            }
        }
    ]

    return (
        <div>
            <h3>{props.Title}</h3>
            <div>
                <MaterialTable
                    title={props.Title}
                    columns={columnasTablaServicioCotizacion}
                    data={props.CotiServicio}
                    editable={{
                        onBulkUpdate: materialTableUpdate,
                        onRowDelete: materialTableDelete
                    }}
                ></MaterialTable>
                <div className={styles.total_container}>
                    <select onChange={(event) => setCurrencyTotal(event.target.value)} className={styles.moneda_select_container}>
                        <option value="Dolar" selected>Dolares</option>
                        <option value="Sol">Soles</option>
                    </select>
                    <span>El precio total es: {currencyTotal === "Dolar" ? "$" : "S/."} {montoTotal.toFixed(2)}</span>
                </div>
            </div>
            <div>
                <h3>Servicios para añadir</h3>
                <MaterialTable
                    title=""
                    columns={columnasServicioAnadir}
                    data={props.ListaServiciosProductos}
                    actions={accionesServicio}
                ></MaterialTable>
            </div>
        </div>
    )
}