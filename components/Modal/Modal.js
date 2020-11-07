import styles from "./Modal.module.css";


const Modal = () => {
  return (
    <div id="myModalXD" className={styles.Modal} onClick={(event)=>{
          let modal = document.getElementById("myModalXD");
          console.log(modal)
          if (event.target == modal) {
            modal.style.display = "none";
          }
    }}>
      <div className={styles.Modal_content}>
          {/* {()=>{
              
              window.onclick = function (event) {
                let modal = document.getElementById("myModalXD");
                console.log(modal)
                if (event.target == modal) {
                  modal.style.display = "none";
                }
              };
          }} */}
        <p>Some text in the Modal..</p>
      </div>
    </div>
  );
};

export default Modal;
