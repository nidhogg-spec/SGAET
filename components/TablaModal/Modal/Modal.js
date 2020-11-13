import styles from "./Modal.module.css";
// import fetch from 'isomorphic-unfetch';
import React, { useEffect, useState } from "react";

export default function Modal(props) {
  //hooks
  
  const [TipoModal, setTipoModal] = useState(props.ModalType);
  const [Data, setData] = useState({});
  const [Id, setId] = useState(props.Id);
  const [Coleccion, setColeccion] = useState("");
  const [Accion, setAccion] = useState("");
  const [Display, setDisplay] = useState("none");

  // let Data={};
  
  // useEffect(() => {
  //   console.log("Funciona el use effect weeeeeeeeeeeee")
  //   if(Accion=="ObtenerDatos"){
  //     getData();
  //   }
  // });
  useEffect(async ()=>{
       
    // setId(props.Id)
    // setTipoModal(props.ModalType)
    // setDisplay(props.ModalDisplay)

    let result = await fetch("http://localhost:3000/api/servicios",{
      method:'POST',
      mode:'cors',
      headers: {'Content-Type':'application/json'},
      body:JSON.stringify({
        "idServicio":"001",
        "type":'modalFindOne'
      })
    })
    
    result.json().then(data=>{
      setData(data.result)
    })
    console.log(Data)
    setId(props.Id)
    
  },[props.Id])
  useEffect(()=>{
    let modal = document.getElementById("myModalXD");
    // setDisplay(props.Display)
    if(props.Display==true){
      modal.style.display = "block";
    }else{
      modal.style.display = "none";
    }
  },[props.Display])
  
  return (
    <div
      id="myModalXD"
      className={styles.Modal}
      onClick={(event) => {
        let modal = document.getElementById("myModalXD");
        // console.log(modal);
        if (event.target == modal) {
          // modal.style.display = "none";
          props.MostrarModal(false)
        }
      }}
      // style={`"display: ${Display};"`}
    >
      <div className={styles.Modal_content}>
        {Id}
      </div>
    </div>
  );
}

// class Modal extends Component {

//   componentDidMount(){
//     if(this.state.accion=="sin accion"){

//     }
//   }

//   render() {

//   }
// }

// export default Modal;
// export default Modal = () => {

//   return (
//     <div id="myModalXD" className={styles.Modal} onClick={(event)=>{
//           let modal = document.getElementById("myModalXD");
//           console.log(modal)
//           if (event.target == modal) {
//             modal.style.display = "none";
//           }
//     }}>
//       <div className={styles.Modal_content}>

//       </div>
//     </div>
//   );
// };
