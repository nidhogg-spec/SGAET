import React, {useState} from 'react';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';
import Router from 'next/router';

//componenetes
import Header from "../components/header/Header"
import NavLateral from "../components/navLateral/NavLateral"


export default function loginPrincipal() {
  //Perteneciente al handle del login
  const [loginError, setLoginError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      }),
    })
      .then((r) => {
        return r.json();
      })
      .then((data) => {
        if (data && data.error) {
          setLoginError(data.message);
        }
        if (data && data.token) {
          //set cookie
          cookie.set('token', data.token, {expires: 1});
          Router.push('/');
        }
      });
  }
  return (
    <div>
      <h1>Sistema de Gestion Administrativa de Empresas Turisticas</h1>

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
        <form onSubmit={handleSubmit}>
          <p>Login</p>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" value="Submit" />
          {loginError && <p style={{color: 'red'}}>{loginError}</p>}
        </form>
          <Link href="/signup">Sign Up</Link>
        </>
      )}
    </div>
  );
}