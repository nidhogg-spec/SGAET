import React, { useState, useEffect } from "react";
import styles from "../styles/login.module.css";
import {Auth, API} from 'aws-amplify'
import { withSSRContext } from 'aws-amplify'

export default function loginPrincipal({ authenticated, username }) {
  const [userName, setUserName] = useState(null)
  const [password, setPassword] = useState(null)
  const [user, setUser] = useState(null)

  async function signIn() {
    try {
        await Auth.signIn(
            userName, 
            password);
            console.log('signing in');
    } catch (error) {
        console.log('error signing in', error);
    }
  }
  
  useEffect(()=>{   
    //Acceder a la sesion del usuario en el cliente
    Auth.currentAuthenticatedUser()
        .then(user =>{
            console.log("User: ",user)
            setUser(user)
        })
        .catch(err=> setUser(null))
  } ,[])
  if (!authenticated) {
    return(
      <div>
        <input placeholder="username" onChange={(e)=>setUserName(e.target.value)} name="username"></input>
        <input placeholder="password" onChange={(e)=>setPassword(e.target.value)} name="password"></input>
        <button onClick={signIn}>SignIn</button>
      </div>
    )
  }else if(authenticated){
    return (
      <div>
        {/* <h2>Bienvenido{username}</h2> */}
        {/* <button onClick={signOut}>SignOut</button> */}
        <h1 className={styles.loginHeader}>
          Sistema de Gestion Administrativa de Empresas Turisticas
        </h1>
        <CambioDolar />
      </div>
    );
  }
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
