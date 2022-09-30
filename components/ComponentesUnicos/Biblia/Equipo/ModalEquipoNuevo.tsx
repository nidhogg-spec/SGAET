import { Backdrop, Dialog, DialogContent, Modal, Box, Fade } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import globalStyles from "@/globalStyles/modules/global.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import customStyle from "../../Clientes/ModalClientes_Nuevo/ModalClientes_Nuevo.module.css";
import { useRouter } from "next/router";
import LoadingComp from "@/components/Loading/Loading";
import { v4 } from "uuid";
import equipoForm from "@/components/ComponentesUnicos/Biblia/Equipo/equipoForm.module.css";

export default function ModalEquipoNuevo({open, setOpen, agregarEquipo } : {open : boolean, setOpen : Function, agregarEquipo : Function }) {
    const router = useRouter();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [abrirSiguientePaso, setAbrirSiguientePaso] = React.useState(false);

    const defaultValues = {
        NombreEquipo: "",
        Descripcion: "",
        Cantidad: 0
    };
    const { register, reset, handleSubmit, formState: { errors }} = useForm({ defaultValues, mode: "onBlur"});

    const handleClose = () => {
        setOpen(false);
    }

    const onSubmit = (data : any) => {
        setLoading(true);
        const nuevoEquipo = {
            ...data,
            IdEquipo: v4()
        };
        agregarEquipo(nuevoEquipo);
        setOpen(false);
        setLoading(false);
    }

    React.useEffect(() => {
        if (open) {
            reset({ NombreEquipo: "", Descripcion: "", Cantidad: 0 });
        }
    }, [open]);
    
    return (
        <>
            <LoadingComp Loading={loading} />
            <Dialog
                open={abrirSiguientePaso}
                onClose={() => router.reload()}
                maxWidth="lg">
                    <DialogContent>
                        <div>
                            <h4>Equipo registrado</h4>
                            <button onClick={() => router.reload()} className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}>Volver</button>
                        </div>
                    </DialogContent>
            </Dialog>
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={open}>
                    <Box className={`${globalStyles.modal__MainContainer} ${equipoForm.form__container}`}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            
                            <div>
                                <h2 className={`${globalStyles.global_textInput_container}`}>Datos de Equipo</h2>
                                <div className={`${globalStyles.global_textInput_container}`}>
                                    <label>Nombre de Equipo</label>
                                    <input type="text" {...register("NombreEquipo", { required: true})}></input>
                                    <span className={`${globalStyles.global_error_message}`}>{errors.NombreEquipo?.type == "required" && "El nombre del equipo es obligatorio"}</span>
                                </div>
                                <div className={`${globalStyles.global_textInput_container}`}>
                                    <label>Descripcion</label>
                                    <input type="text" {...register("Descripcion", { required: true})}></input>
                                    <span className={`${globalStyles.global_error_message}`}>{errors.Descripcion?.type == "required" && "Una descripcion del equipo es obligatoria"}</span>
                                </div>
                                <div className={`${globalStyles.global_textInput_container}`}>
                                    <label>Cantidad</label>
                                    <input type="number" {...register("Cantidad", { required: true})}></input>
                                    <span className={`${globalStyles.global_error_message}`}>{errors.Cantidad?.type == "required" && "La cantidad es obligatoria"}</span>
                                </div>
                            </div>
                            <div className={`${customStyle.botones_container} ${customStyle.botones_container_final}`}>
                                <button className={`${botones.button} ${botones.buttonGuardar} ${equipoForm.btn__guardar}`} type="submit">Guardar</button>
                            </div>
                        </form>

                    </Box>
                </Fade>
                
            </Modal>
        </>
    )
}