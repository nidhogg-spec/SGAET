import styles from "./BotonAnadir.module.css"
const BotonAnadir = () => {
    return ( 
        <div className={styles.BotonAnadir}>
            <span>Añadir</span>
            <img src="/resources/add-black-18dp.svg" />
        </div>
     );
}
 
export default BotonAnadir;