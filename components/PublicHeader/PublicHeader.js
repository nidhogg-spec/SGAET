//componentes
import styles from "./PublicHeader.module.css";
import botonStyle from "@/globalStyles/modules/boton.module.css"

//modulos
import Router, { useRouter } from 'next/router';

export default function PublicHeader() {
  const router = useRouter()
  return (
    <header className={styles.HeaderDiv}>
      <img src='/resources/logo.png' className={styles.HeaderLogo} />
      <div className={styles.MainTittleContainer}>
        <span className={styles.HeaderSideName} >Sistema Interno</span>
      </div>
    </header>
  )
}
