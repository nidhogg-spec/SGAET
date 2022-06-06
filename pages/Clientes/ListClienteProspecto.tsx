import MaterialTable from "material-table";
import { connectToDatabase } from "@/utils/API/connectMongo-v2";

import Router from "next/router";
import { withSSRContext } from "aws-amplify";
import { useEffect, useState, createContext } from "react";

//Componentes
import AutoModal_v2 from "@/components/AutoModal_v2/AutoModal_v2";
import { Suspense } from "react";

// Estilos
import globalStyles from "@/globalStyles/modules/global.module.css";
import styles from "@/globalStyles/Proveedor.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import axios from "axios";
import { GetServerSideProps } from "next";
import ModalClientes_Nuevo from "@/components/ComponentesUnicos/Clientes/ModalClientes_Nuevo/ModalClientes_Nuevo";
import { resetServerContext } from "react-beautiful-dnd";
import ModalClientes_Leer from "@/components/ComponentesUnicos/Clientes/ModalClientes_Leer/ModalClientes_Leer";
interface Props {
  Datos: any[];
  api_general: string;
}

/*
Campos de ClientesProspectos
 - IdClienteProspecto
 - NombreCompleto
 - TipoCliente
 - Estado
 - TipoDocumento
 - NroDocumento
 - ContactoCelular
 - ContactoEmail
 - Seguimiento
*/

export default function Home({ Datos, api_general }: Props) {
  // let Display_out =false
  const [datosEditables, setDatosEditables] = useState(Datos);
  const [EditandoCliente, setEditandoCliente] = useState(false);

  let Columnas = [
    { title: "ID", field: "IdClienteProspecto", hidden: true },
    { title: "Nombre completo", field: "NombreCompleto" },

    {
      title: "Tipo de Cliente",
      field: "TipoCliente",
      lookup: { Corporativo: "Corporativo", Directo: "Directo" }
    },
    {
      title: "Estado",
      field: "Estado",
      lookup: { Prospecto: "Prospecto", Cliente: "Cliente" }
    },
    {
      title: "Tipo de Documento",
      field: "TipoDocumento",
      lookup: { DNI: "DNI", RUC: "RUC" }
    },
    { title: "Nro Documento", field: "NroDocumento" }
  ];

  //------------------------------------------------
  const [Display, setDisplay] = useState(false);
  const [Display_Leer, setDisplay_Leer] = useState(false);
  const [ModalData, setModalData] = useState({});
  const [Data, setData] = useState({});
  //------------------------------------------------

  return (
    <div>
      <ModalClientes_Nuevo
        ListaServiciosProductos={[]}
        open={Display}
        setOpen={setDisplay}
        key={"ModalClientes_Nuevo_01"}
      />
      <ModalClientes_Leer
        ClienteProspecto={Data as any}
        open={Display_Leer}
        setOpen={setDisplay_Leer}
        Actualizando={EditandoCliente}
        setActualizando={setEditandoCliente}
      />
      <div className={`${globalStyles.main_work_space_container}`}>
        <div className={styles.titleContainer}>
          <h1 className="Titulo">Lista de clientes/Prospectos</h1>
          <div>
            <button
              className={`${botones.button} ${botones.buttonGuardar}`}
              onClick={() => {
                setDisplay(true);
              }}
            >
              Añadir Cliente/Prospecto
            </button>
          </div>
        </div>
        <MaterialTable
          columns={Columnas}
          data={datosEditables}
          title={""}
          actions={[
            {
              icon: () => {
                return <img src="/resources/remove_red_eye-24px.svg" />;
              },
              tooltip: "Mostrar todo",
              onClick: (event, rowData) => {
                let dt = datosEditables.find((value) => {
                  return (
                    value["IdClienteProspecto"] == rowData["IdClienteProspecto"]
                  );
                });
                console.log(dt);
                setData(dt);
                setEditandoCliente(false);
                setDisplay_Leer(true);
              }
            }
          ]}
          options={{
            actionsColumnIndex: -1
          }}
        />
      </div>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const api_general = process.env.API_DOMAIN + "/api/general";
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  let Datos: any[] = [];

  const { Auth } = withSSRContext({ req });
  try {
    const user = await Auth.currentAuthenticatedUser();
  } catch (err) {
    res.writeHead(302, { Location: "/" });
    res.end();
  }
  resetServerContext();

  try {
    await connectToDatabase().then(async (connectedObject) => {
      let collection = connectedObject.db.collection("ClienteProspecto");
      let result = await collection.find({}).project({ _id: 0 }).toArray();
      // DatosProveedor = JSON.stringify(result);

      //@ts-ignore
      result._id = JSON.stringify(result._id);
      Datos = result;
    });
  } catch (error) {
    console.log("Error cliente Mongo 1 => " + error);
  }

  return {
    props: {
      Datos: Datos,
      api_general: api_general
    }
  };
};

// const ConstrutorModal = ({ Display, setDisplay }) => {

//   return (
//     <>
//       {/* <Suspense fallback={<span>Cargando Data ...</span>}> */}

//       {/* </Suspense> */}
//     </>
//   );
// };
