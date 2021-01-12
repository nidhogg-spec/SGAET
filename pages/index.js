import React, { useState, useEffect } from "react";
import styles from "../styles/login.module.css";
import {Auth, API} from 'aws-amplify'
import {useRouter} from "next/router";
import {useAppContext} from '@/components/Contexto'

export default function loginPrincipal(props) {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [nombre, setNewNombre] = useState("")
  const [[loged,setLogged]] = useAppContext()

  const Router = useRouter()
  async function signIn(e) {
    try {
      e.preventDefault()
      await Auth.signIn(userName,password)
        .then(user=>{
          if(user.challengeName  === 'NEW_PASSWORD_REQUIRED'){
            const { requiredAttributes } = user.challengeParam
            // console.log(userName)
            // console.log(newPassword)
            Auth.completeNewPassword(user, newPassword,{name:nombre})
            .then(user=>{
              setLogged(true)
              console.log(user)
            })
            .catch(err=>console.log(err))
          }
          setLogged(true)
          console.log('signing in');
        })
        .catch(err=>console.log(err))
    } catch (error) {
        setLogged(false)
        console.log('error signing in', error);
    }
  }
  // useEffect(()=>{   
  //   //Acceder a la sesion del usuario en el cliente
  //   Auth.currentAuthenticatedUser()
  //       .then(user =>{
  //           console.log("User: ",user)
  //           setUser(user)
  //       })
  //       .catch(err=> setUser(null))
  // } ,[])
  return(
    <div>
      <h1 className={styles.loginHeader}>
        Sistema de Gestion Administrativa de Empresas Turisticas
      </h1>

      {loged && (
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
      {!loged && (
        <>
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
            <div className={styles.formularioLogin_correo}>
              <label className={styles.formularioLogin_label}>Ingrese su Nombre</label>
              <input
                className={styles.formularioLogin_input}
                name="nombre"
                type="text"
                onChange={(e) => setNewNombre(e.target.value)}
              />
            </div>
            <div className={styles.formularioLogin_password}>
              <label className={styles.formularioLogin_label}>Nueva Contraseña</label>
              <input
                className={styles.formularioLogin_input}
                name="password"
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <input
              className={styles.formularioLogin_button}
              type="submit"
              value="Login"
            />
          </form>
          {/*Desactivar en caso se nesecite boton para activar el registro de usuarios*/}
          {/* <Link href="/signup">Sign Up</Link> */}
        </>
      )}
    </div>
  )
}
// export async function getServerSideProps({ req, res }) {
//   const { Auth } = withSSRContext({ req })
//   try {
//     const user = await Auth.currentAuthenticatedUser()
//     return {
//       props: {
//         authenticated: true,
//         username: user.username
//       }
//     }
//   } catch (err) {
//     res.writeHead(302, { Location: '/' })
//     res.end()
//   }
//   return {props: {}}
// }
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
    sessionStorage.setItem('CambioDolar',DolarSol)
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
