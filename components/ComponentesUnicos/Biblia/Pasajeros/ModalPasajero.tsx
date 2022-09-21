import React from "react";
import globalStyles from "@/globalStyles/modules/global.module.css";
import customStyle from "../../Clientes/ModalClientes_Nuevo/ModalClientes_Nuevo.module.css";
import { useRouter } from "next/router";
import LoadingComp from "@/components/Loading/Loading";
import { Backdrop, Box, Fade, Modal } from "@mui/material";
import equipoForm from "@/components/ComponentesUnicos/Biblia/Equipo/equipoForm.module.css";

export default function ModalPasajeros({ open, setOpen, pasajero }: any) {
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleClose = () => {
        setOpen(false);
    }
    return (
        <>
            <LoadingComp Loading={loading} />
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 5000 }}>
                <Fade in={open}>
                    <Box className={`${globalStyles.modal__MainContainer} ${equipoForm.form__container}`} >
                        <div>
                            <div>
                                <h2 className={globalStyles.global_textInput_container}>Detalles del pasajero</h2>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Nombre del pasajero</label>
                                    <input type="input" defaultValue={pasajero?.Nombre || pasajero?.Nombres} disabled></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Apellido del pasajero</label>
                                    <input type="input" defaultValue={pasajero?.Apellidos} disabled></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Tipo de documento</label>
                                    <input type="input" defaultValue={pasajero?.TipoDocumento} disabled></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Numero de documento</label>
                                    <input type="input" defaultValue={pasajero?.NroDocumento} disabled></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Sexo</label>
                                    <input type="input" defaultValue={pasajero?.Sexo} disabled></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Fecha de nacimiento</label>
                                    <input type="input" defaultValue={pasajero?.FechaNacimiento} disabled></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Celular</label>
                                    <input type="input" defaultValue={pasajero?.Celular} disabled></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Email</label>
                                    <input type="input" defaultValue={pasajero?.Email} disabled></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Nacionalidad</label>
                                    <input type="input" defaultValue={pasajero?.Nacionalidad} disabled></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Documentos</label>
                                    <input type="input" defaultValue={pasajero?.UrlDocumentos?.join(", ")} disabled></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Descripcion del Regimen alimenticio</label>
                                    <input type="input" defaultValue={pasajero?.RegimenAlimenticioDescripcion} disabled></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Tiene regimen alimenticio especial</label>
                                    <input type="input" defaultValue={pasajero?.RegimenAlimenticioEspecial ? "Si" : "No"} disabled></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Tiene problemas medicos</label>
                                    <input type="input" defaultValue={pasajero?.ProblemasMedicos ? "Si" : "No"} disabled></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Numero del pasajero</label>
                                    <input type="input" defaultValue={pasajero?.NumPasajero} disabled></input>
                                </div>
                                <div className={globalStyles.global_textInput_container}>
                                    <label>Descripcion de los problemas medicos</label>
                                    <textarea defaultValue={pasajero?.ProblemasMedicosDescripcion} disabled style={{ resize: "none"}}></textarea>
                                </div>
                            </div>
                        </div>

                    </Box>
                </Fade>
            </Modal>
        </>
    )

} 
