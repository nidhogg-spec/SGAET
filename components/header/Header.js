//componentes
import styles from "./Header.module.css";

//modulos
import { Auth } from 'aws-amplify'

import Router from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from "react";


export default function Header(){
  const [data,setData]=useState(false)
  const [loged,setLoged]=useState(false)
  let loggedIn = false
  useEffect( async ()=>{
    await Auth.currentAuthenticatedUser()
      .then((x)=>{
        setData(x)
        setLoged(true)
        loggedIn=true
      })
      .catch(err => {
        loggedIn=false
        setData(null)
      })
      if (loggedIn==false) {
        if(Router.route != "/"){
          console.log("gg")
          window.location.replace("/");
        }
      }
  },[])

  if (!data) return(
    <nav className = {styles.HeaderDiv}>
        <img src='/resources/logo.png' className={styles.HeaderLogo} />
    </nav>
  )
  async function signOut() {
    try {
        await Auth.signOut();
        console.log('signing out');
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }
  return(
      <header className = {styles.HeaderDiv}>
          <img src='/resources/logo.png' className={styles.HeaderLogo} />
          <span className={styles.HeaderSideName} >{window.location.pathname.split("/")[1]}  </span>
          {loged && (
            <div>
              <p>Bienvenido {data.username}!</p>
              <form onSubmit={signOut} method="post">
                <input
                  className={styles.formularioLogin_button}
                  type="submit"
                  value="Logout"
                />
              </form>
              {/* <button
                onClick={() => {
                  signOut()
                }}>
                Logout
              </button> */}
            </div>
          )}
      </header>
  )
}