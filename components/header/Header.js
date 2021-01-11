//componentes
import styles from "./Header.module.css";

//modulos
import { Auth,withSSRContext } from 'aws-amplify'

import {useRouter} from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from "react";


export default function Header({username}){
  const [data,setData]=useState(false)
  const [loged,setLoged]=useState(false)
  const router = useRouter()

  useEffect( async ()=>{
    console.log(username)
    await Auth.currentAuthenticatedUser()
      .then((x)=>{
        setData(x)
        setLoged(true)
      })
      .catch(err => {
        router.push('/')
        setData(null)
      })
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
export async function getInitialProps({ req, res }) {
  const { Auth } = withSSRContext({ req })
  try {
    const user = await Auth.currentAuthenticatedUser()
    return {
      props: {
        authenticated: true,
        username: user.username
      }
    }
  } catch (err) {
    res.writeHead(302, { Location: '/' })
    res.end()
  }
  return {props: {}}
}