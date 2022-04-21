import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { withSSRContext } from "aws-amplify";
import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { GetServerSideProps } from "next";
import { resetServerContext } from "react-beautiful-dnd";

//Componentes
import MaterialTable from "material-table";
import BotonAnadir from "@/components/BotonAnadir/BotonAnadir";
import ModalProveedores_NuevoProv from "@/components/ComponentesUnicos/Proveedores/ModalProveedores_NuevoProv/ModalProveedores_NuevoProv";

//CSS
import styles from "@/globalStyles/Proveedor.module.css";

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
  const [open, setOpen] = useState(false);

  const HandleAnadir = () => {
    // router.push("/Proveedores/NuevoProveedor");
    setOpen(true);
  };

  return (
    <div className={styles.mainContainer}>
      <ModalProveedores_NuevoProv
        open={open}
        setOpen={setOpen}
      />
      <div className={styles.titleContainer}>
        <h1 className="Titulo">Lista de Proveedores</h1>
        <div>
          <BotonAnadir Accion={HandleAnadir} />
        </div>
      </div>
      <div className="">
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
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { Auth } = withSSRContext({ req });
  try {
    const user = await Auth.currentAuthenticatedUser();
  } catch (err) {
    res.writeHead(302, { Location: "/" });
    res.end();
  }
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
};
