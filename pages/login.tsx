import React, { useState, useEffect } from "react";

// CSS
import styles from "@/globalStyles/login.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import axios from "axios";
import router from "next/router";
import { ironOptions } from "@/utils/config";
import { withIronSessionSsr } from "iron-session/next";
import LoadingComp from "@/components/Loading/Loading";

export default function loginPrincipal() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: ""
  });

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/user/login`,
        {
          email: userName,
          password: password
        },
        {
          validateStatus: function (status) {
            return status < 500; // Resuelve solo si el código de estado es menor que 500
          }
        }
      );
      if (response.data.ok) {
        router.push("/home");
      } else {
        setLoading(false);
        setError({
          error: true,
          message: "Usuario o contraseña incorrectos"
        });
      }
    } catch (error) {
      setLoading(false);
      setError({
        error: true,
        message: "Error al iniciar sesión"
      });
    }
  }

  useEffect(() => {
    axios.get("/api/initconfig");
  }, []);
  return (
    <div className={`${styles.mainContainer}`}>
      <LoadingComp Loading={loading} key={"loading_1"} />
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
        <button
          className={`${botones.buttonLogin_conf} ${botones.GenerickButton}`}
          // className={styles.formularioLogin_button}
          type="submit"
        >
          <span>Login</span>
        </button>
        {error.error && (
          <span className={styles.errorMessage}>{error.message}</span>
        )}
      </form>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    if (user) {
      return {
        redirect: {
          permanent: false,
          destination: "/home"
        }
      };
    }
    return {
      props: {
        publicPage: true
        // APIpathGeneral: APIpathGeneral,
      }
    };
  },
  ironOptions
);
