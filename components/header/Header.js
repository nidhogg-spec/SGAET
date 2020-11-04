//componentes
import styles from "./Header.module.css";

//modulos
import cookie from 'js-cookie';
import useSWR from 'swr';
import Router from 'next/router';
import Link from 'next/link';


export default function Header(){
   
  const {data, revalidate} = useSWR('/api/me', async function(args) {
    const res = await fetch(args);
    return res.json();
  })
  
  if (!data) return(
    <nav className = {styles.HeaderDiv}>
        <img src='/resources/logo.png' className={styles.HeaderLogo} />
    </nav>
  )
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
  }
  
    return(
        <nav className = {styles.HeaderDiv}>
            <img src='/resources/logo.png' className={styles.HeaderLogo} />
            {loggedIn && (
                <p>Bienvenido {data.email}!</p>
            )}
            {!loggedIn &&(
                    <Link href="/loginPrincipal">Loguearse</Link>
            )}
        </nav>
    )
}