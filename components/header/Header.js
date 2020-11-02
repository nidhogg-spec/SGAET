import styles from "./Header.module.css";

//Font awesome

import Link from 'next/link'


export default function Header(){
    return(
        <nav className = {styles.HeaderDiv}>
            <img src='/resources/logo.png' className={styles.HeaderLogo} />
        </nav>
    )
}