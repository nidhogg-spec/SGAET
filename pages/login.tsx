import React, { useState, useEffect } from "react";

// CSS
import styles from "@/globalStyles/login.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import axios from "axios";
import router from "next/router";

export default function loginPrincipal() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/user/login`, {
        email: userName,
        password: password
      });
      if (response.data.ok) {
        router.push("/home");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log("error signing in", error);
    }
  }

  useEffect(() => {
    axios.get("/api/initconfig");
  }, []);
  return (
    <div className={`${styles.mainContainer}`}>
      <h1 className={styles.loginHeader}>
        Sistema de Gestion Administrativa de Empresas Turisticas
      </h1>
      <form className={styles.formularioLogin} onSubmit={signIn} method="post">
        <div className={styles.formularioLogin_correo}>
          <label className={styles.formularioLogin_label}>Correo</label>
          <input
            className={styles.formularioLogin_input}
            name="username"
            type="text"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className={styles.formularioLogin_password}>
          <label className={styles.formularioLogin_label}>Contraseña</label>
          <input
            className={styles.formularioLogin_input}
            name="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input
          className={`${botones.button} ${botones.button_primary}`}
          // className={styles.formularioLogin_button}
          type="submit"
          value="Login"
        />
      </form>
    </div>
  );
}
export async function getServerSideProps() {
  const APIpath = process.env.API_DOMAIN;
  // const APIpathGeneral = process.env.API_DOMAIN + "/api/general";

  return {
    props: {
      APIpath: APIpath
      // APIpathGeneral: APIpathGeneral,
    }
  };
}
