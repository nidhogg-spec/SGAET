import React from "react";
import {
    Table,
    Dialog,
    DialogContent,
    Modal,
    Box,
    Fade,
    Backdrop
  } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";

import globalStyles from "@/globalStyles/modules/global.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import customStyle from "../../Clientes/ModalClientes_Nuevo/ModalClientes_Nuevo.module.css";

import { userInterface } from "@/utils/interfaces/db";
import LoadingComp from "@/components/Loading/Loading";

import { useRouter } from "next/router";

export default function ModalUsuarioNuevo({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Function;
}) {
  const router = useRouter();
  const [abrirSiguientePaso, setAbrirSiguientePaso] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [enlaceUltimoRegistro, setEnlaceUltimoRegistro] = React.useState("");

  const defaultValues = {
    Nombre: "",
    Apellido: "",
    Email: "",
    Contrasena: "",
    TipoUsuario: "Operaciones",
    Estado: "Activo"
  };

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm({ defaultValues, mode: "onBlur" });

  const handleClose = () => {
    setOpen(false);
  };

    const onSubmit = (data: any) => {
        const crear = async () => {

            const { Nombre, Apellido, Email, Contrasena, TipoUsuario, Estado } = data;
            const nuevoUsuario: userInterface = {
                Nombre, Apellido, Email,
                Password: Contrasena,
                IdUser: "",
                TipoUsuario, Estado
            };

            setOpen(false);
            setLoading(true);
            await axios.post("/api/user/users", {
                accion: "create",
                data: nuevoUsuario
            });
        }
        crear();
        setLoading(false);
        setEnlaceUltimoRegistro("/");
        setAbrirSiguientePaso(true);
    }

    return (
        <>
            <LoadingComp Loading={loading} />
            <Dialog
                open={abrirSiguientePaso}
                onClose={() => router.reload()}
                fullWidth
                maxWidth="xs">
                <DialogContent>
                    <div className={customStyle.postRegistro__container}>
                        <h4>Usuario nuevo regisrado</h4>
                        <button onClick={() => router.reload()} className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}>Volver</button>
                    </div>
                </DialogContent>
            </Dialog>
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}>
                <Fade in={open}>
                    <Box className={globalStyles.modal__MainContainer}>
                        <form action="" onSubmit={handleSubmit(onSubmit)}>
                            <div className={globalStyles.title_and_buttons_container}>
                                <h1 className={customStyle.title}>Nuevo Usuario</h1>
                            </div>
                            <div>
                                <button className={`${botones.button} ${botones.buttonGuardar}`} type="submit">Guardar</button>
                            </div>
                            <div>
                                <h2>Datos del Usuario</h2>
                                <div className={`${globalStyles.global_textInput_container}`}>
                                    <label>Nombre</label>
                                    <input type="text" {...register("Nombre", { required: true })}></input>
                                    <span className={`${globalStyles.global_error_message}`}>
                                        {errors.Nombre?.type == "required" && "El nombre de usuario es obligatorio"}
                                    </span>
                                </div>
                                <div className={`${globalStyles.global_textInput_container}`}>
                                    <label htmlFor="">Apellido</label>
                                    <input type="text" {...register("Apellido", { required: true })}></input>
                                    <span className={`${globalStyles.global_error_message}`}>{errors.Apellido?.type == "required" && "El apellido del usuario es obligatorio"}</span>
                                </div>
                                <div className={`${globalStyles.global_textInput_container}`}>
                                    <label htmlFor="">Email</label>
                                    <input type="text" {...register("Email", {
                                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, required: true
                                    })}></input>
                                    <span className={`${globalStyles.global_error_message}`}>{errors.Email?.type == "pattern" || errors.Email?.type == "required" && "El Email del usuario es obligatorio"}</span>
                                </div>
                                <div className={`${globalStyles.global_textInput_container}`}>
                                    <label htmlFor="">Contraseña</label>
                                    <input type="password" {...register("Contrasena", { required: true })}></input>
                                    <span className={`${globalStyles.global_error_message}`}>{errors.Contrasena?.type == "required" && "La contraseña del usuario es obligatoria"}</span>
                                </div>
                                <div className={`${globalStyles.global_textInput_container}`}>
                                    <label htmlFor="">Tipo de usuario</label>
                                    <select {...register("TipoUsuario")} defaultValue="Operaciones">
                                        <option key="Administrador" value="Administrador">Administrador</option>
                                        <option key="Ventas" value="Ventas">Ventas</option>
                                        <option key="Marketing" value="Marketing">Marketing</option>
                                        <option key="Operaciones" value="Operaciones" selected>Operaciones</option>
                                    </select>
                                    <span className={`${globalStyles.global_error_message}`}></span>
                                </div>
                                <div className={`${globalStyles.global_textInput_container}`}>
                                    <label htmlFor="">Estado de usuario</label>
                                    <select {...register("Estado")} defaultValue="Activo">
                                        <option selected key="Activo" value="Activo" >Activo</option>
                                        <option key="Inactivo" value="Inactivo">Inactivo</option>
                                    </select>
                                    <span className={`${globalStyles.global_error_message}`}></span>
                                </div>
                            </div>
                            <div className={`${customStyle.botones_container} ${customStyle.botones_container_final}`}>
                                <button className={`${botones.button} ${botones.buttonGuardar}`} type="submit">Guardar</button>
                            </div>
                        </form>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}