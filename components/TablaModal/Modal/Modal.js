//Package
import styles from "./Modal.module.css";
import React, { useEffect, useState } from "react";

//Componentes
import CampoTexto from './CampoTexto/CampoTexto'
import TablaBanco from './TablaBeneficiarios/TablaBanco'


export default function Modal(props) {
//Los siguientes datos deberian de estar en props para su correcto funcionamiento:
//     TipoModal
//     Id
//     APIpath
//     Display
//     MostrarModal
//El desarrollador no se hace responsable de su mal uso :v  
  //hooks

 
  const [TipoModal, setTipoModal] = useState(props.TipoModal);
  const [Data, setData] = useState({NombreServicio:""});
  const [APIpath, setAPIpath] = useState(props.APIpath);
  const [Accion, setAccion] = useState("ver");
  console.log(APIpath)

  useEffect(async ()=>{   
    // setId(props.Id)
    // setTipoModal(props.ModalType)
    // setDisplay(props.ModalDisplay)
    if(props.Id){
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
    }
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
      //Variables por version
      const [DevolverDato, setDevolverDato] = useState(false);
      const [TipoProveedor, setTipoProveedor] = useState("Hotel");
      //Funciones por version
      let DataRegist={}
      const RegistrarDato = (keyDato, Dato) =>{
        DataRegist[keyDato]=Dato;
      }
      //hooks
      useEffect(()=>{
        if(DevolverDato==true){
          console.log(DataRegist)
          setDevolverDato(false)
            fetch(APIpath,{
                    method:"POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({
                      tipoProveedor:TipoProveedor,
                      accion: "create",
                      data: DataRegist
                    }),
                  })
                  .then(r=>r.json())
                  .then(data=>{
                    alert(data.message);
                  })
                  props.MostrarModal(false)
        }
      },[DevolverDato])


      return(
      <div id="myModalXD"
        className={styles.Modal}
        onClick={(event) => {
        let modal = document.getElementById("myModalXD");
        if (event.target == modal) {
          props.MostrarModal(false)
        }
      }}>
        <div className={styles.Modal_content}>
          <select onChange={(event)=>{
            setTipoProveedor(event.target.value)
          }}>
            <option value="Hotel" selected>Hotel</option>
            <option value="Agencia">Agencia</option>
            <option value="Guia">Guia</option>
            <option value="Transporte terrestre">Transporte terrestre</option>
            <option value="Restaurante">Restaurante</option>
            <option value="Transporte ferroviario">Transporte ferroviario</option>
            <option value="Otro">Hotel</option>
          </select>
          <img src="/resources/save-black-18dp.svg" onClick={()=>{
            setDevolverDato(true)
          }} />
          <img src="/resources/close-black-18dp.svg"/>
        <div className={styles.divContacto}>
              <span>Datos de Contacto</span>
              <div className={styles.DataContacto}>
                <CampoTexto
                  Title="Razon Social"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="RazonSocial"
                  Dato={""}
                />
                <CampoTexto
                  Title="Numero de telefono"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="celular"
                  Dato={""}
                />
                <CampoTexto
                  Title="Numero de telefono 2"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="celular2"
                  Dato={""}
                />
                <CampoTexto
                  Title="Email"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="email"
                  Dato={""}
                />
                <CampoTexto
                  Title="Email 2"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="email2"
                  Dato={""}
                />
                <CampoTexto
                  Title="Direccion"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="direccionRegistrada"
                  Dato={""}
                />
              </div>
              <TablaBanco
                  datosbanc={{}}
                  ModoEdicion={true}                  
                  KeyDato="DatosBancarios"
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                />
            </div>
        </div>
      </div>);
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
      return <div>Alguio salio mal :V</div>
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
