import React, { useState, useEffect } from "react";
import styles from "../styles/login.module.css";
import {Auth, API} from 'aws-amplify'
import {useRouter} from "next/router";
import { withSSRContext } from 'aws-amplify'

export default function loginPrincipal({ authenticated }) {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const Router = useRouter()

  async function signIn() {
    try {
      await Auth.signIn(
        userName, 
        password);
        console.log('signing in');
        Router.push("/")
    } catch (error) {
        console.log('error signing in', error);
    }
  }
  return(
    <div>
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
            className={styles.formularioLogin_button}
            type="submit"
            value="Login"
        />
        </form>
    </div>
  )
}
export async function getServerSideProps(context) {
  const { Auth } = withSSRContext(context)
  try {
    const user = await Auth.currentAuthenticatedUser()

    return {
      props: {
        authenticated: true, username: user.username
      }
    }
  } catch (err) {
    return {
      props: {
        authenticated: false
      }
    }
  }
}