import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { GetServerSideProps } from "next";
import { resetServerContext } from "react-beautiful-dnd";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/config";

//Componentes
import MaterialTable from "material-table";
import BotonAnadir from "@/components/BotonAnadir/BotonAnadir";
import ModalProveedores_NuevoProv from "@/components/ComponentesUnicos/Proveedores/ModalProveedores_NuevoProv/ModalProveedores_NuevoProv";
import Loader from "@/components/Loading/Loading";

//CSS
import styles from "@/globalStyles/Proveedor.module.css";
import global_style from "@/globalStyles/modules/global.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import axios from "axios";

interface proveedorList {
  id: string;
  proveedor: string;
  ubicacion: string;
  tipo: string;
}
interface Props {
  proveedores: proveedorList[];
}

export default function Home({ proveedores }: Props) {
  const router = useRouter();
  const [TablaDatos, setTablaDatos] = useState(proveedores);
  const [ListarInactivos, setListarInactivos] = useState(false);
  const [open, setOpen] = useState(false);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (ListarInactivos == true) {
      axios
        .post("/api/proveedores/listaProveedores?inactivos=true", {
          accion: "find"
        })
        .then((data) => {
          setTablaDatos(data.data.ListaProveedores);
          setLoading(false);
        });
    } else {
      axios
        .post("/api/proveedores/listaProveedores", {
          accion: "find"
        })
        .then((data) => {
          setTablaDatos(data.data.ListaProveedores);
          setLoading(false);
        });
    }
  }, [ListarInactivos]);

  const HandleAnadir = () => {
    setOpen(true);
  };

  return (
    <div className={styles.mainContainer}>
      <Loader Loading={Loading} />
      <ModalProveedores_NuevoProv open={open} setOpen={setOpen} />
      <div className={styles.titleContainer}>
        <h1 className="Titulo">Lista de Proveedores</h1>
        <div>
          <button
            className={`${botones.button} ${botones.buttonGuardar}`}
            onClick={HandleAnadir}
          >
            Añadir Proveedor
          </button>
        </div>
      </div>
      <div className="">
        <div className={global_style.checkbox_container}>
          <label className={global_style.checkbox_switch}>
            <input
              type="checkbox"
              onChange={(value) => {
                setListarInactivos(value.target.checked);
              }}
              //@ts-ignore
              value={ListarInactivos}
            />
            <span
              className={`${global_style.checkbox_switch_slider} ${global_style.checkbox_switch_slider_round}`}
            ></span>
          </label>
          <span className={global_style.checkbox_label}>Mostrar Inactivos</span>
        </div>
        <MaterialTable
          columns={[
            { title: "ID", field: "id", filtering: false, hidden: true },
            {
              title: "Nombre Comercial",
              field: "proveedor",
              filtering: false
            },
            {
              title: "Ubicacion",
              field: "ubicacion",
              filtering: false
            },
            {
              title: "Tipo de Proovedor",
              field: "tipo",
              lookup: {
                Hotel: "Hotel",
                Agencia: "Agencia",
                Guia: "Guia",
                TransporteTerrestre: "Transporte Terrestre",
                Restaurante: "Restaurante",
                SitioTuristico: "Sitio Turistico",
                TransporteFerroviario: "Transporte Ferroviario",
                Otro: "Otro"
              }
            }
          ]}
          data={TablaDatos}
          title={""}
          actions={[
            {
              icon: () => {
                return <img src="/resources/delete-black-18dp.svg" />;
              },
              tooltip: "Delete Proveedor",
              onClick: (event, rowData) => {
                fetch("/api/proveedores/listaProveedores", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    IdProveedor: (rowData as proveedorList).id,
                    accion: "delete"
                  })
                })
                  .then((r) => r.json())
                  .then((data) => {
                    alert(data.message);
                  });
              }
            },
            (rowData) => ({
              icon: () => {
                return (
                  <Link href={`/Proveedores/${rowData.tipo}/${rowData.id}`}>
                    <a>
                      <img src="/resources/remove_red_eye-24px.svg" />
                    </a>
                  </Link>
                );
              },
              tooltip: "Ver detalle de proveedor",
              onClick: () => {
                router.push(`/Proveedores/${rowData.tipo}/${rowData.id}`);
              }
            })
          ]}
          options={{
            actionsColumnIndex: -1,
            filtering: true
          }}
        />
      </div>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res, query }) {
    const user = req.session.user;
    if (!user) {
      return {
        redirect: {
          permanent: false,
          destination: "/login"
        }
      };
    }
    //---------------------------------------------------------------------------------------------------------------------
    resetServerContext();
    //----------------------Obtener datos de proveedores-------------------------------------------
    const coleccion = "Proveedor";
    let Datos: proveedorList[] = [];
    await connectToDatabase().then(async (connectedObject) => {
      let collection = connectedObject.db.collection(coleccion);
      let data = await collection.find({}).toArray();
      data.map((datosResult) => {
        Datos.push({
          id: datosResult.IdProveedor,
          proveedor: datosResult.nombre,
          ubicacion: datosResult.DireccionFiscal,
          tipo: datosResult.tipo
        });
      });
    });

    //----------------------------------------------------------------------------
    return {
      props: {
        proveedores: Datos
      }
    };
  },
  ironOptions
);
