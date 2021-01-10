//componentes
import styles from "./Header.module.css";

//modulos
import { withSSRContext,Auth } from 'aws-amplify'

import Router from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from "react";


export default function Header({ authenticated, username }){
   const [data,setData]=useState()
  // const {data, revalidate} = useSWR('/api/me', async function(args) {
  //   const res = await fetch(args);
  //   return res.json();
  // })co
  useEffect(()=>{
    Auth.currentAuthenticatedUser()
      .then(x=>{
        setData(x)
      })
      .catch(err => setData(null))
  },[])

  if (!data) return(
    <nav className = {styles.HeaderDiv}>
        <img src='/resources/logo.png' className={styles.HeaderLogo} />
    </nav>
  )
  let loggedIn = false;
  if (data.username) {
    loggedIn = true;
  }else{
    if(Router.route!="/"){
      Router.push("/")
    }
  }
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
          {loggedIn && (
            <div>
              <p>Bienvenido {data.username}!</p>
              <button
                onClick={() => {
                  signOut()
                }}>
                Logout
              </button>
            </div>
          )}
      </header>
  )
}
export async function getServerSideProps(context) {
  console.log("fsdfsdf")
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