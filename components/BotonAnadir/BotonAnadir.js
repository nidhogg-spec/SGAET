import styles from "./BotonAnadir.module.css"
const BotonAnadir = (props={
    Accion
}) => {
//Los siguientes datos deberian de estar en props para su correcto funcionamiento:
//     Accion = Accion que debe de realizar el boton
//     
//El desarrollador no se hace responsable de su mal uso :v  
    return ( 
        <button className={styles.BotonAnadir} onClick={props.Accion} title={"Añadir nuevo"}>
            <span>Añadir</span>
            <img src="/resources/add-black-18dp.svg" />
        </button>
     );
}
 
export default BotonAnadir;