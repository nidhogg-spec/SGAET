import React from "react";
import { Modal, Box, Fade, Backdrop } from "@material-ui/core";
import { useForm } from "react-hook-form";
import globalStyles from "@/globalStyles/modules/global.module.css";
import customStyle from "../../Clientes/ModalClientes_Leer/ModalClientes_Leer.module.css";

import LoadingComp from "@/components/Loading/Loading";


export default function ModalFinanzaLeer({
    open, setOpen, finanza
}: { open: boolean, setOpen: Function, finanza: any }) {
    
    const [loading, setLoading] = React.useState(false);
        
    const defaultValues = {
        Total: 0,
        TotalNeto: 0,
        Comision: 0,
        Adelanto: 0,
        MetodoPago: "",
        FechaCreacion: "",
        FechaModificacion: "",
        ReservaCotizacion: "",
        Servicio: "",
        Proveedor: ""
    };
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues, mode: "onBlur" });
    
    const handleClose = () => {
        setOpen(false);
    }

    React.useEffect(() => {
        const finanzaDatos = {
            Total: finanza.Total || 0,
            TotalNeto: finanza.TotalNeto || 0,
            Comision: finanza.Comision || 0,
            Adelanto: finanza.Adelanto || 0,
            MetodoPago: finanza.MetodoPago || "",
            FechaCreacion: finanza.FechaCreacion || "",
            FechaModificacion: finanza.FechaModificacion || "",
            ReservaCotizacion: finanza.ReservaCotizacion || ""
        };
        const { ListaRelacionesId : ids } = finanza;
        if (finanza.hasOwnProperty("IdIngreso")) {
            const ingreso = { ...finanzaDatos, Servicio: ids.idServicios.join(", ")}
            reset(ingreso);
        } else if (finanza.hasOwnProperty("IdEgreso")) {
            const egreso = { ...finanzaDatos, Servicio: ids.idServicios.join(", "), Proveedor: ids.idProveedor}
            reset(egreso);
        }

    }, [finanza])


    return (
        <>
            <LoadingComp Loading={loading} />
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}>

                <Fade in={open}>
                    <Box className={globalStyles.modal__MainContainer}>
                        <div>
                            <div className={globalStyles.title_and_buttons_container}>
                                <h1 className={customStyle.title}>Finanzas</h1>
                            </div>
                            <div>
                                <h2>Datos</h2>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Total</label>
                                    <input disabled type="text" {...register("Total")}></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Total Neto</label>
                                    <input disabled type="text" {...register("TotalNeto")}></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Comision</label>
                                    <input disabled type="text" {...register("Comision")}></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Adelanto</label>
                                    <input disabled type="text" {...register("Adelanto")}></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Metodo de pago</label>
                                    <input disabled type="text" {...register("MetodoPago")}></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Nombre de la reserva</label>
                                    <input disabled type="text" {...register("ReservaCotizacion")}></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Fecha de creacion</label>
                                    <input disabled type="text" {...register("FechaCreacion")}></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Fecha de modificacion</label>
                                    <input disabled type="text" {...register("FechaModificacion")}></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Servicios</label>
                                    <input disabled type="text" {...register("Servicio")}></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Proveedor</label>
                                    <input disabled type="text" {...register("Proveedor")}></input>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>

        </>
    )

}