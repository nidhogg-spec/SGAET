import MaterialTable from "material-table";
import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/config";
import globalStyles from "@/globalStyles/modules/global.module.css";
import styles from "@/globalStyles/Proveedor.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import { resetServerContext } from "react-beautiful-dnd";
import React from "react";
import { StayCurrentLandscapeSharp } from "@material-ui/icons";
import axios from "axios";

import ModalUsuarioNuevo from "@/components/ComponentesUnicos/Usuarios/ModalUsuarioNuevo/ModalUsuarioNuevo";
import ModalUsuarioLeer from "@/components/ComponentesUnicos/Usuarios/ModalUsuarioLeer/ModalUsuarioLeer";
import router from "next/router";
import { userInterface } from "@/utils/interfaces/db";


function Administracion({ usersData }: { usersData: any }) {

    const columnas = [
        {
            title: "ID",
            field: "IdUser",
            hidden: true
        },
        {
            title: "Nombre",
            field: "Nombre",
        },
        {
            title: "Apellido",
            field: "Apellido",
        },
        {
            title: "Email",
            field: "Email"
        },
        {
            title: "Password",
            field: "Password",
            hidden: true
        },
        {
            title: "Tipo de Usuario",
            field: "TipoUsuario",
            lookup: {
                Administrador: "Administrador",
                Ventas: "Ventas",
                Marketing: "Marketing",
                Operaciones: "Operaciones"
            }
        },
        {
            title: "Estado",
            field: "Estado",
            lookup: {
                Activo: "Activo",
                Inactivo: "Inactivo"
            }
        }
    ];

    const [display, setDisplay] = React.useState<boolean>(false);
    const [displayLeer, setDisplayLeer] = React.useState<boolean>(false);
    const [modelData, setModelData] = React.useState({});
    const [data, setData] = React.useState({});

    const [datosEditables, setDatosEditables] = React.useState(usersData);
    const [editandoUsuario, setEditandoUsuario] = React.useState<boolean>(false);



    const desplegarDisplayAñadirUsuario = () => {
        setDisplay(true);
    }

    const accionMostrarData = (event: any, rowData: any) => {
        const dt = datosEditables.find((value: any) => value.IdUser == rowData.IdUser);
        setData(dt);
        setEditandoUsuario(false);
        setDisplayLeer(true);
    }

    const accionEliminarData = (evento: any, rowData: any) => {
        const eliminar = async () => {
            const { IdUser, Nombre, Apellido, Email, Password, TipoUsuario } = rowData;
            await axios.post(`/api/user/users`, {
                accion: "update",
                idUsuario: IdUser,
                data: {
                    Nombre,
                    Apellido,
                    Email,
                    Password,
                    TipoUsuario,
                    Estado: "Inactivo"

                }
            }
            );
        }

        eliminar();
        axios.get("/api/user/users").then(result => {
            setDatosEditables(result.data.data);
        });

    }

    const acciones = [
        {
            icon: () => <img src="/resources/remove_red_eye-24px.svg" />,
            tooltip: "Mostrar todo",
            onClick: accionMostrarData
        },
        {
            icon: () => <img src="/resources/delete-black-18dp.svg" />,
            tooltip: "Eliminar usuario",
            onClick: accionEliminarData
        }
    ]

    return (
        <div>
            <ModalUsuarioNuevo
                open={display}
                setOpen={setDisplay}
                key="ModalUsuarioNuevo1" />
            <ModalUsuarioLeer
                usuario={data as any}
                open={displayLeer}
                setOpen={setDisplayLeer}
                actualizando={editandoUsuario}
                setActualizando={setEditandoUsuario} />
            <div className={globalStyles.main_work_space_container}>
                <div className={styles.titleContainer}>
                    <h1 className="Titulo">Lista de usuarios del sistema</h1>
                    <div>
                        <button className={`${botones.button} ${botones.buttonGuardar}`} onClick={desplegarDisplayAñadirUsuario}>Añadir usuario</button>
                    </div>
                </div>
                <MaterialTable
                    columns={columnas}
                    data={datosEditables}
                    title=""
                    actions={acciones}
                    options={{ actionsColumnIndex: -1 }}
                />
            </div>
        </div>
    )


}

export default Administracion;

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

        if (user.tipoUsuario !== "Administrador") {
            return {
                redirect: {
                    destination: "/Home"
                }
            };
        }
        const headers = req.headers;
        const dataUsuarios = await axios.get(`${process.env.API_DOMAIN}/api/user/users`, {
            headers
        });

        return {
            props: {
                usersData: dataUsuarios.data.data
            }
        };

    }, ironOptions
)