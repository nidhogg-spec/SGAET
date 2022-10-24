import React from "react";
import {
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
import customStyle from "../../Clientes/ModalClientes_Leer/ModalClientes_Leer.module.css";

import { TipoAccion, userInterface } from "@/utils/interfaces/db";
import LoadingComp from "@/components/Loading/Loading";

import { useRouter } from "next/router";
import { generarLog } from "@/utils/functions/generarLog";

export default function ModalUsuarioLeer({
  open,
  setOpen,
  usuario,
  actualizando,
  setActualizando
}: {
  open: boolean;
  setOpen: Function;
  usuario: userInterface;
  actualizando: boolean;
  setActualizando: Function;
}) {
  const defaultValues = {
    IdUser: "",
    Nombre: "",
    Apellido: "",
    Email: "",
    Password: "",
    TipoUsuario: "Operaciones",
    Estado: 1
  };

  const router = useRouter();
  const [abrirSiguientePaso, setAbrirSiguientePaso] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset
  } = useForm({ defaultValues, mode: "onBlur" });

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data: any) => {
    const actualizar = async () => {
      const { Nombre, Apellido, Password, TipoUsuario, IdUser } = data;
      const usuario = {
        Nombre,
        Apellido,
        Password,
        TipoUsuario
      };
      setOpen(false);
      setLoading(true);
      await axios.post("/api/user/users", {
        accion: "update",
        idUsuario: IdUser,
        data: usuario
      });
      generarLog(TipoAccion.UPDATE, "usuario actualizado - " + IdUser);
    };
    actualizar();
    setLoading(false);
    setAbrirSiguientePaso(true);
  };

  React.useEffect(() => {
    reset({
      IdUser: usuario.IdUser || "",
      Nombre: usuario.Nombre || "",
      Apellido: usuario.Apellido || "",
      Email: usuario.Email || "",
      Password: usuario.Password || "",
      TipoUsuario: usuario.TipoUsuario || "",
      Estado: usuario.Estado || 1
    });
  }, [usuario]);

  return (
    <>
      <LoadingComp Loading={loading} />
      <Dialog
        open={abrirSiguientePaso}
        onClose={() => router.reload()}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent>
          <div className={customStyle.postRegistro__container}>
            <h4>Usuario actualizado</h4>
            <button
              onClick={() => router.reload()}
              className={`${botones.button_border} ${botones.button} ${botones.GenericButton}`}
            >
              Volver
            </button>
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
          <Box className={globalStyles.modal__MainContainer}>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <div className={globalStyles.title_and_buttons_container}>
                <h1 className={customStyle.title}>Usuario</h1>
              </div>
              <div className={customStyle.botones_container}>
                {!actualizando && (
                  <button
                    className={`${botones.button} ${botones.buttonGuardar}`}
                    type="button"
                    onClick={() => setActualizando(true)}
                  >
                    Actualizar
                  </button>
                )}
              </div>
              <div>
                <h2>Datos del Usuario</h2>
                <div className={globalStyles.global_textInput_container}>
                  <label>Nombre del usuario</label>
                  <input
                    disabled={!actualizando}
                    type="text"
                    {...register("Nombre", { required: true })}
                  ></input>
                  <span className={globalStyles.global_error_message}>
                    {errors.Nombre?.type == "required" &&
                      "El nombre del usuario es obligatorio"}
                  </span>
                </div>
                <div className={globalStyles.global_textInput_container}>
                  <label>Apellido del Usuario</label>
                  <input
                    disabled={!actualizando}
                    type="text"
                    {...register("Apellido", { required: true })}
                  ></input>
                  <span className={globalStyles.global_error_message}>
                    {errors.Apellido?.type == "required" &&
                      "El apellido del usuario es obligatorio"}
                  </span>
                </div>
                <div className={globalStyles.global_textInput_container}>
                  <label>Contraseña</label>
                  <input
                    disabled={!actualizando}
                    type="password"
                    {...register("Password", { required: true })}
                  ></input>
                  <span className={globalStyles.global_error_message}>
                    {errors.Password?.type == "required" &&
                      "La contraseña es obligatoria"}
                  </span>
                </div>
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label htmlFor="">Tipo de usuario</label>
                  <select
                    {...register("TipoUsuario")}
                    disabled={!actualizando}
                    defaultValue="Operaciones"
                  >
                    <option key="Administrador" value="Administrador">
                      Administrador
                    </option>
                    <option key="Ventas" value="Ventas">
                      Ventas
                    </option>
                    <option key="Marketing" value="Marketing">
                      Marketing
                    </option>
                    <option key="Operaciones" value="Operaciones" selected>
                      Operaciones
                    </option>
                  </select>
                  <span
                    className={`${globalStyles.global_error_message}`}
                  ></span>
                </div>
              </div>
              {actualizando && (
                <div
                  className={`${customStyle.botones_container} ${customStyle.botones_container_final}`}
                >
                  <button
                    className={`${botones.button} ${botones.buttonGuardar}`}
                    type="submit"
                  >
                    Guardar
                  </button>
                </div>
              )}
            </form>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
