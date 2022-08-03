import React, { useState, useEffect } from "react";
import Notificaciones from "../components/Notificaciones/Notificaciones";
import { withIronSessionSsr } from "iron-session/next";

// CSS
import styles from "@/globalStyles/login.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import axios from "axios";
import { ironOptions, LONG_SECRET_KEY } from "@/utils/config";

interface Props {
  APIpath: string;
}

export default function loginPrincipal({ APIpath }: Props) {
  return (
    <div className={`${styles.mainContainer}`}>
      <h1 className={styles.loginHeader}>
        Sistema de Gestion Administrativa de Empresas Turisticas
      </h1>
      <div className={styles.notification__container}>
        <Notificaciones APIpath={APIpath} />
      </div>
      <CambioDolar />
      <button
        className={`${botones.button} ${styles.button__logs}`}
        onClick={async (event) => {
          await fetch(APIpath + "/api/Log/getPdfLog")
            .then((response) => {
              return response.text();
            })
            .then((data) => {
              let link = document.createElement("a");
              link.download = "file.pdf";
              link.href = "data:application/octet-stream;base64," + data;
              link.click();
            });
        }}
      >
        Descargar Log
      </button>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const APIpath = process.env.API_DOMAIN;
    const user = req.session.user;
    if (!user) {
      return {
        redirect: {
          permanent: false,
          destination: "/login"
        }
      };
    }

    return {
      props: {
        user: user,
        APIpath: APIpath
      }
    };
  },
  ironOptions
);

const CambioDolar = () => {
  const [EstadoEditado, setEstadoEditado] = useState(false);
  const [ValueDolartoSol, setValueDolartoSol] = useState(0);
  const [ValueDolarSolInit, setValueDolarSolInit] = useState(0);
  const [Loading, setLoading] = useState(false);
  //@ts-ignore
  useEffect(async () => {
    setLoading(true);
    let DolarSol = 0;
    await fetch("/api/DataSistema", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accion: "ObtenerCambioDolar"
      })
    })
      .then((r) => r.json())
      .then((data) => {
        DolarSol = data.value;
      });
    console.log(DolarSol);
    sessionStorage.setItem("CambioDolar", DolarSol.toString());
    setValueDolarSolInit(DolarSol);
    setValueDolartoSol(DolarSol);
    setLoading(false);
  }, []);

  return (
    <div className={styles.opcionesAdmin}>
      <h2>Opciones de Adminstrador</h2>
      <div>
        <span>Cambio soles a dolares</span>
        {EstadoEditado ? (
          <>
            {Loading ? (
              <>
                <span>Guardando ...</span>
              </>
            ) : (
              <>
                <button
                  className={`${botones.buttonGuardar} ${botones.button}`}
                >
                  <img
                    src="/resources/save-black-18dp.svg"
                    onClick={async () => {
                      setLoading(true);
                      await fetch("/api/DataSistema", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          accion: "CambiarCambioDolar",
                          value: ValueDolartoSol
                        })
                      });
                      setValueDolarSolInit(ValueDolartoSol);
                      setEstadoEditado(false);
                      setLoading(false);
                      // ReiniciarData()
                    }}
                  />
                </button>
                <button
                  className={`${botones.buttonCancelar} ${botones.button}`}
                >
                  <img
                    src="/resources/close-black-18dp.svg"
                    onClick={(event) => {
                      setEstadoEditado(false);
                      setValueDolartoSol(ValueDolarSolInit);
                    }}
                  />
                </button>
              </>
            )}
          </>
        ) : (
          <>
            {Loading ? (
              <>
                <span> Cargando ...</span>
              </>
            ) : (
              <button className={botones.enlaceBton}>
                <img
                  src="/resources/edit-black-18dp.svg"
                  onClick={(event) => {
                    setEstadoEditado(true);
                  }}
                />
              </button>
            )}
          </>
        )}
      </div>
      <div>
        {EstadoEditado ? (
          <>
            <span>1 Dolar = </span>
            <input
              type="number"
              value={ValueDolartoSol}
              onChange={(event) => {
                setValueDolartoSol(parseFloat(event.currentTarget.value));
              }}
            />
            <span> Nuevos Soles</span>
          </>
        ) : (
          <>
            <span>1 Dolar = </span>
            <input type="number" value={ValueDolartoSol} readOnly={true} />
            <span> Nuevos Soles</span>
          </>
        )}
      </div>
    </div>
  );
};
