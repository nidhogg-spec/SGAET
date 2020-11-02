import styles from "./navLateral.module.css";

//Font awesome

import Link from 'next/link'


export default function NavLateral(){
    return(
        <nav className = {styles.NavLateralSquare}>
                <div className= {styles.NavLateralModulos}><img src="/resources/account_box-black-18dp.svg"/>Clientes<img src="/resources/keyboard_arrow_down-black-18dp.svg"/></div>
                <div className= {styles.NavLateralModulos}><img src="/resources/calendar_today-black-18dp.svg"/>Reservas<img src="/resources/keyboard_arrow_down-black-18dp.svg"/></div>
                <div className= {styles.NavLateralModulos}><img src="/resources/book-black-18dp.svg"/>Proveedores<img src="/resources/keyboard_arrow_down-black-18dp.svg"/></div>
                <div className= {styles.NavLateralModulos}><img src="/resources/playlist_add_check-black-18dp.svg"/>Biblia<img src="/resources/keyboard_arrow_down-black-18dp.svg"/></div>
                <div className= {styles.NavLateralModulos}><img src="/resources/assignment-black-18dp.svg"/>Ordenes de Servicio<img src="/resources/keyboard_arrow_down-black-18dp.svg"/></div>
                <div className= {styles.NavLateralModulos}><img src="/resources/attach_money-black-18dp.svg"/>Finanzas<img src="/resources/keyboard_arrow_down-black-18dp.svg"/></div>
                <div className= {styles.NavLateralModulos}><img src="/resources/supervised_user_circle-black-18dp.svg"/>Administracion<img src="/resources/keyboard_arrow_down-black-18dp.svg"/></div>
        </nav>
    )
}