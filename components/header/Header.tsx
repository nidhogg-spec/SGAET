//componentes
import styles from "./Header.module.css";
import botonStyle from "@/globalStyles/modules/boton.module.css";

import { ArrowBack } from "@material-ui/icons";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { useAppContext } from "@/components/Contexto";
import axios from "axios";

export default function Header() {
  const { User, SetUser } = useAppContext();
  const router = useRouter();
  // const [Logged, setLogged] = useContext(LogState)

  //@ts-ignore
  useEffect(async () => {
    console.log("hola");

    if (User.Nombre == null) {
      const userInfo = await axios.get("/api/user/user-info");
      if (userInfo.data.user) {
        SetUser({
          Nombre: userInfo.data.user.Nombre,
          Apellido: userInfo.data.user.Apellido,
          Email: userInfo.data.user.Email,
          TipoUsuario: userInfo.data.user.TipoUsuario,
          Estado: userInfo.data.user.Estado,
          IdUser: userInfo.data.user.IdUser
        });
      } else {
        if (router.pathname != "/login") {
          Router.push("/login");
        }
      }
    }
  });
  async function signOut() {
    try {
      const response = await axios.post("/api/user/logout");
      SetUser({} as any);
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  return (
    <header className={styles.HeaderDiv}>
      <img
        src="/resources/logo.png"
        className={styles.HeaderLogo}
        onClick={() => {
          router.push("/");
        }}
      />
      <div className={styles.MainTittleContainer}>
        <button
          onClick={() => {
            history.go(-1);
          }}
          className={`${botonStyle.BackButton} ${botonStyle.button}`}
        >
          <ArrowBack className={styles.HeaderArrowBack} />
        </button>
        {/* <span className={styles.HeaderSideName}>
          {window.location.pathname.split("/")[1]}{" "}
        </span> */}
      </div>
      {User.Nombre && (
        <div className={styles.NameLoginContainer_up}>
          <form
            className={styles.NameLoginContainer}
            onSubmit={signOut}
            method="post"
          >
            <p>Bienvenido {User.Nombre}!</p>
            <input
              className={`${botonStyle.button} ${botonStyle.buttonLogin}`}
              type="submit"
              value="Logout"
            />
          </form>
        </div>
      )}
    </header>
  );
}
