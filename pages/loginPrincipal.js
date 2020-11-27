import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import cookie from 'js-cookie';
import Router from 'next/router';
import styles from '../styles/login.module.css'

export default function loginPrincipal() {
  //Perteneciente al handle del login
  const [loginError, setLoginError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [rol, setRol] = useState('');
  //------------------------------------------------------------------------------------//
  const {data, revalidate} = useSWR('/api/me', async function(args) {
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
    fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
          cookie.set('token', dataCookie.token, {expires: 1});
          if(dataCookie.rolToken == "admin"){
            // Router.push('/Proovedores');
            Router.push('/');
          }else if(dataCookie.rolToken == "proovedores"){
            Router.push('/');
          }else{
            Router.push('/');
          }
        }
      });
  }
  return (
    <div>
      <h1 className={styles.loginHeader}>Sistema de Gestion Administrativa de Empresas Turisticas</h1>

      {loggedIn && (
        <>
          <p>Bienvenido {data.email}!</p>
          <button
            onClick={() => {
              cookie.remove('token');
              revalidate();
            }}>
            Logout
          </button>
        </>
      )}
      {!loggedIn && (
        <>
        <form className={styles.formularioLogin} onSubmit={handleSubmit}>
          <div className={styles.formularioLogin_correo}>
            <label className={styles.formularioLogin_label}>
              Correo
            </label>
            <input
              className={styles.formularioLogin_input}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.formularioLogin_password}>
            <label className={styles.formularioLogin_label}>
              Contraseña
            </label>
            <input
              className={styles.formularioLogin_input}
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <input className={styles.formularioLogin_button} type="submit" value="Login" />
          {loginError && <p style={{color: 'red'}}>{loginError}</p>}
        </form>
          {/*Desactivar en caso se nesecite boton para activar el registro de usuarios*/}
          {/* <Link href="/signup">Sign Up</Link> */}
        </>
      )}
    </div>
  );
}