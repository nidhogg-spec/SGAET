import React, { useState, useEffect, SetStateAction } from "react";
import { useRouter } from "next/router";
import { withSSRContext } from "aws-amplify";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import {
  proveedorInterface,
  reservaCotizacionInterface,
  servicioEscogidoInterface
} from "@/utils/interfaces/db";
import { ListarReservaProveedores_get_response as api_response } from "@/utils/interfaces/API/responsesInterface";

// Componentes
import MaterialTable from "material-table";
import Loader from "@/components/Loading/Loading";
import ModalOSInfo from "@/components/ComponentesUnicos/OrdenServicio/ModalOSInfo/ModalOSInfo";

//CSS
import global_style from "@/globalStyles/modules/global.module.css";
import axios from "axios";
import { Box, Modal, Dialog, DialogContent } from "@material-ui/core";
import { log } from "console";

const Index = ({}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [ListarReservaProveedores_API, setListarReservaProveedores_API]  = useState<api_response>();
  const [Loading, setLoading] = useState(false);
  const [DataCotizacion, setDataCotizacion] = useState<reservaCotizacionInterface[]>([]);
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
    setIdReserva((rowData as reservaCotizacionInterface).IdReservaCotizacion);
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
        <label>
          <input
            type="checkbox"
            onChange={(value) => {
              setListarInactivos(value.target.checked);
            }}
            //@ts-ignore
            value={ListarInactivos}
          />
          <span>Mostrar Inactivos</span>
        </label>
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
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let DataReservas = [];

  const APIpathGeneral = process.env.API_DOMAIN + "/api/general";

  const { Auth } = withSSRContext({ req });
  try {
    const user = await Auth.currentAuthenticatedUser();
  } catch (err) {
    res.writeHead(302, { Location: "/" });
    res.end();
  }
  return {
    props: {
      APIPath: process.env.API_DOMAIN
    }
  };
};
export default Index;
