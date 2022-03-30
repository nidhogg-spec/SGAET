//componentes
import styles from "./Header.module.css";
import botonStyle from "@/globalStyles/modules/boton.module.css"

//modulos
import { Auth,withSSRContext } from 'aws-amplify'

import { ArrowBack } from "@material-ui/icons";
import Router,{useRouter} from 'next/router';
import Link from 'next/link';
import { useEffect, useState, useContext } from "react";
import {useAppContext} from '@/components/Contexto'


export default function Header(){
  const [data,setData]=useState(false)
  const [[Logged,setLogged]]=useAppContext()
  const router = useRouter()
  // const [Logged, setLogged] = useContext(LogState)
  
  useEffect( async ()=>{
    await Auth.currentAuthenticatedUser()
      .then((x)=>{
        setData(x)
        setLogged(true)
      })
      .catch(err => {
        setLogged(false)
        router.push('/')
        setData(null)
      })      
  },[Logged])

  /*Activar para impedir el redireccionamiento por url en la etapa de deployment*/
  
  // useEffect(()=>{
  //   fetch    
  //   if(Logged==false){
  //     if(Router.route != "/"){
  //       console.log(Router.route)
  //       Router.push("/")
  //     }
  //   }
  // },[])

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
          <img src='/resources/logo.png' className={styles.HeaderLogo} onClick={()=>{router.push('/')}} />
          <div className = {styles.MainTittleContainer}>
            <button onClick={()=>{history.go(-1)}} className={`${botonStyle.BackButton} ${botonStyle.button}`}>
              <ArrowBack className={styles.HeaderArrowBack} />
            </button>
            <span className={styles.HeaderSideName} >{window.location.pathname.split("/")[1]}  </span>
          </div>
          {Logged && (
            <div className = {styles.NameLoginContainer_up}>
              <form className = {styles.NameLoginContainer} onSubmit={signOut} method="post">
                <p>Bienvenido {data.username}!</p>
                <input
                  className={`${botonStyle.button} ${botonStyle.buttonLogin}`}
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
