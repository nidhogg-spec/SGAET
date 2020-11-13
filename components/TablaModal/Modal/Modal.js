//Package
import styles from "./Modal.module.css";
import React, { useEffect, useState } from "react";

//Componentes
import CampoTexto from './CampoTexto/CampoTexto'


export default function Modal(props) {
//Los siguientes datos deberian de estar en props para su correcto funcionamiento:
//     TipoModal
//     Id
//     APIpath
//     
//El desarrollador no se hace responsable de su mal uso :v  
  //hooks

 
  const [TipoModal, setTipoModal] = useState(props.TipoModal);
  const [Data, setData] = useState({NombreServicio:""});
  // const [Id, setId] = useState(props.Id);
  const [APIpath, setAPIpath] = useState(props.APIpath);
  const [Accion, setAccion] = useState("ver");
  // const [Display, setDisplay] = useState(props.Display);
  console.log(APIpath)

  useEffect(async ()=>{   
    // setId(props.Id)
    // setTipoModal(props.ModalType)
    // setDisplay(props.ModalDisplay)
    console.log(APIpath)
    let result = await fetch(APIpath,{
      method:'POST',
      mode:'cors',
      headers: {'Content-Type':'application/json'},
      body:JSON.stringify({
        "idServicio":props.Id,
        "type":'modalFindOne'
      })
    }).catch(()=>{
      alert("error al obtener datos del servicio escogido");
      
    })
    result.json().then(data=>{
      if(data.result){
        setData(data.result)
      }else{
        setData({NombreServicio:""})
      }
      
    })
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
  
  switch (TipoModal) {
    case "Proveedores":
      return ;
      break;
    case "Servicio":
      return(<div
        id="myModalXD"
        className={styles.Modal}
        onClick={(event) => {
          let modal = document.getElementById("myModalXD");
          if (event.target == modal) {
            props.MostrarModal(false)
          }
        }}
      >
        <div className={styles.Modal_content}>
          <CampoTexto Title="Nombre del Servicio" ModoEdicion={false} Dato={Data.NombreServicio} />
        </div>
      </div>
      );
      break;
  
    default:
      return <div></div>
      break;
  }
  // return (
  //   <div
  //     id="myModalXD"
  //     className={styles.Modal}
  //     onClick={(event) => {
  //       let modal = document.getElementById("myModalXD");
  //       if (event.target == modal) {
  //         props.MostrarModal(false)
  //       }
  //     }}
  //   >
  //     <div className={styles.Modal_content}>
  //       <CampoTexto Title="Nombre del Servicio" ModoEdicion={false} Dato={Data.NombreServicio} />
  //     </div>
  //   </div>
  // );
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
