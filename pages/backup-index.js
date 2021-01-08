import React, { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import useSWR from "swr";
import cookie from "js-cookie";
import Router from "next/router";
import styles from "../styles/login.module.css";

export default function loginPrincipal() {
  //Perteneciente al handle del login
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [rol, setRol] = useState('');
  //------------------------------------------------------------------------------------//
  const { data, revalidate } = useSWR("/api/me", async function (args) {
    const res = await fetch(args);
    return res.json();
  });

  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
  }
  function handleSubmit(e) {
    e.preventDefault();
    //call api
    fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        //rol
      }),
    })
      .then((r) => {
        return r.json();
      })
      .then((dataCookie) => {
        // console.log(dataCookie)
        if (dataCookie && dataCookie.error) {
          setLoginError(dataCookie.message);
        }
        if (dataCookie && dataCookie.token) {
          //set cookie
          cookie.set("token", dataCookie.token, { expires: 1 });
          if (dataCookie.rolToken == "admin") {
            // Router.push('/Proovedores');
            Router.push("/");
          } else if (dataCookie.rolToken == "proovedores") {
            Router.push("/");
          } else {
            Router.push("/");
          }
        }
      });
  }
  return (
    <div>
      <h1 className={styles.loginHeader}>
        Sistema de Gestion Administrativa de Empresas Turisticas
      </h1>

      {loggedIn && (
        <>
          {/* <p>Bienvenido {data.email}!</p>
          <button
            onClick={() => {
              cookie.remove('token');
              revalidate();
            }}>
            Logout
          </button> */}
          <CambioDolar />
        </>
      )}
      {!loggedIn && (
        <>
          <form className={styles.formularioLogin} onSubmit={handleSubmit}>
            <div className={styles.formularioLogin_correo}>
              <label className={styles.formularioLogin_label}>Correo</label>
              <input
                className={styles.formularioLogin_input}
                name="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.formularioLogin_password}>
              <label className={styles.formularioLogin_label}>Contraseña</label>
              <input
                className={styles.formularioLogin_input}
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <input
              className={styles.formularioLogin_button}
              type="submit"
              value="Login"
            />
            {loginError && <p style={{ color: "red" }}>{loginError}</p>}
          </form>
          {/*Desactivar en caso se nesecite boton para activar el registro de usuarios*/}
          {/* <Link href="/signup">Sign Up</Link> */}
        </>
      )}
    </div>
  );
}

const CambioDolar = () => {
  const [EstadoEditado, setEstadoEditado] = useState(false);
  const [ValueDolartoSol, setValueDolartoSol] = useState(0);
  const [ValueDolarSolInit, setValueDolarSolInit] = useState(0);
  const [Loading, setLoading] = useState(false);

  useEffect(async () => {
    setLoading(true)
    let DolarSol = 0
    await fetch("/api/DataSistema", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accion: "ObtenerCambioDolar",
      }),
    })
    .then((r) => r.json())
    .then((data) => {
      DolarSol = data.value;
    });
    console.log(DolarSol)
    setValueDolarSolInit(DolarSol);
    setValueDolartoSol(DolarSol);
    setLoading(false)
  }, []);

  return (
    <div>
      <span>Opciones de Adminstrador</span>
      <div>
        <div>
          <span>Cambio soles a dolares</span>
          {EstadoEditado ? (
            <>
              { Loading ? (
                <>
                  <span>Guardando ...</span>
                </>
              ) : (
                <>
                  <img
                  src="/resources/save-black-18dp.svg"
                  onClick={async() => {
                    setLoading(true)
                    await fetch("/api/DataSistema", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        accion: "CambiarCambioDolar",
                        value: ValueDolartoSol,
                      }),
                    });
                    setValueDolarSolInit(ValueDolartoSol)
                    setEstadoEditado(false);
                    setLoading(false)
                    // ReiniciarData()
                  }}
                />
                <img
                  src="/resources/close-black-18dp.svg"
                  onClick={(event) => {
                    setEstadoEditado(false);
                    setValueDolartoSol(ValueDolarSolInit)
                  }}
                />
                </>
              )}
              
            </>
          ) : (
            <>
            { Loading ? (
                <>
                  <span> Cargando ...</span>
                </>
              ) : (
                <>
                  <img
                  src="/resources/edit-black-18dp.svg"
                  onClick={(event) => {
                    setEstadoEditado(true);
                  }}
                />
                </>
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
                  setValueDolartoSol(event.currentTarget.value);
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
    </div>
  );
};
