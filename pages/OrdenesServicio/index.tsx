import React, { useState, useEffect, SetStateAction } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import {
  proveedorInterface,
  reservaCotizacionInterface,
  servicioEscogidoInterface
} from "@/utils/interfaces/db";
import { ListarReservaProveedores_get_response as api_response } from "@/utils/interfaces/API/responsesInterface";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/config";

// Componentes
import MaterialTable from "material-table";
import Loader from "@/components/Loading/Loading";
import ModalOSInfo from "@/components/ComponentesUnicos/OrdenServicio/ModalOSInfo/ModalOSInfo";

//CSS
import global_style from "@/globalStyles/modules/global.module.css";
import axios from "axios";
import { Box, Modal, Dialog, DialogContent } from "@mui/material";
import { log } from "console";

const Index = ({}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [ListarReservaProveedores_API, setListarReservaProveedores_API] =
    useState<api_response>();
  const [Loading, setLoading] = useState(false);
  const [DataCotizacion, setDataCotizacion] = useState<
    reservaCotizacionInterface[]
  >([]);
  const [Proveedores, setProveedores] = useState([]);
  const [IdReserva, setIdReserva] = useState("");
  const [ListarInactivos, setListarInactivos] = useState(false);
  const [IdProveedor, setIdProveedor] = useState("");

  useEffect(() => {
    setLoading(true);
    axios.get("/api/reserva/Lista/ListaReserva").then((data) => {
      setDataCotizacion(data.data.AllCotizacion);
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    setLoading(true);
    if (ListarInactivos == true) {
      axios
        .get("/api/reserva/Lista/ListaReserva?inactivos=true")
        .then((data) => {
          setDataCotizacion(data.data.AllCotizacion);
          setLoading(false);
        });
    } else {
      axios.get("/api/reserva/Lista/ListaReserva").then((data) => {
        setDataCotizacion(data.data.AllCotizacion);
        setLoading(false);
      });
    }
  }, [ListarInactivos]);

  const ObtenerProveedoresDeReserva = (
    event: any,
    rowData: reservaCotizacionInterface | reservaCotizacionInterface[]
  ) => {
    setLoading(true);
    setIdReserva(
      (rowData as reservaCotizacionInterface).IdReservaCotizacion as string
    );
    axios
      .get(
        "/api/reserva/ListarReservaProveedores?IdReserva=" +
          (rowData as reservaCotizacionInterface).IdReservaCotizacion
      )
      .then((data) => {
        console.log(data.data);

        setListarReservaProveedores_API(data.data as api_response);
        setProveedores(data.data.tablaProductos);
        setLoading(false);
        try {
          // @ts-ignore
          document
            .getElementById("Titulo_listaProv")
            .scrollIntoView({ behavior: "smooth" });
        } catch (error) {}
      });
  };
  return (
    <div>
      <Loader Loading={Loading} />
      <div className={global_style.main_work_space_container}>
        <h2>
          Lista de Reservas {!ListarInactivos ? "Activas" : "Activas/Inactivas"}
        </h2>
        <ModalOSInfo
          open={open}
          setOpen={setOpen}
          data={ListarReservaProveedores_API}
          IdProveedor={IdProveedor}
          key={IdReserva}
        />
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
            { title: "Id", field: "IdReservaCotizacion" },
            { title: "NombreGrupo", field: "NombreGrupo" },
            { title: "CodGrupo", field: "CodGrupo" },
            {
              title: "FechaIN",
              field: "FechaIN"
            }
          ]}
          data={DataCotizacion}
          title={""}
          actions={[
            {
              icon: () => {
                return <img src="/resources/remove_red_eye-24px.svg" />;
              },
              tooltip: "Mostrar reserva",
              onClick: ObtenerProveedoresDeReserva
            }
          ]}
          options={{
            actionsColumnIndex: -1
          }}
        />
      </div>
      {IdReserva != "" ? (
        <div className={global_style.main_work_space_container}>
          <h2 id="Titulo_listaProv">
            Lista de Proveedores de la Reserva {IdReserva}
          </h2>
          <MaterialTable
            columns={[
              { title: "Nombre Proveedor", field: "NombreProveedor" },
              { title: "Tipo Proveedor", field: "TipoProveedor" },
              { title: "Pago total", field: "PagoTotal" },
              { title: "Moneda", field: "Currency" }
            ]}
            data={Proveedores}
            title={""}
            actions={[
              {
                icon: () => {
                  return <img src="/resources/remove_red_eye-24px.svg" />;
                },
                tooltip: "Mostrar reserva",
                onClick: (event, rowData: any) => {
                  setIdProveedor(rowData.IdProveedor);
                  setOpen(true);
                }
              }
            ]}
            options={{
              actionsColumnIndex: -1
            }}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Index;

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
    //---------------------------------------------------------------------------------------------------------------------
    let DataReservas = [];

    const APIpathGeneral = process.env.API_DOMAIN + "/api/general";

    return {
      props: {
        APIPath: process.env.API_DOMAIN
      }
    };
  },
  ironOptions
);
