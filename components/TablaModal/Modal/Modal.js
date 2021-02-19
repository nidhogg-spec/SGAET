//Package
import styles from "./Modal.module.css";
import React, { useEffect, useState } from "react";

//Componentes
import CampoTexto from "./CampoTexto/CampoTexto";
import TablaBanco from "./TablaBeneficiarios/TablaBanco";
import Selector from "./Selector/Selector";

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
  const [Data, setData] = useState({ NombreServicio: "" });
  const [APIpath, setAPIpath] = useState(props.APIpath);
  const [Accion, setAccion] = useState("ver");
  console.log(APIpath);

  useEffect(async () => {
    // setId(props.Id)
    // setTipoModal(props.ModalType)
    // setDisplay(props.ModalDisplay)
    if (props.Id) {
      console.log(APIpath);
      let result = await fetch(APIpath, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idServicio: props.Id,
          type: "modalFindOne"
        })
      }).catch(() => {
        alert("error al obtener datos del servicio escogido");
      });
      result.json().then((data) => {
        if (data.result) {
          setData(data.result);
        } else {
          setData({ NombreServicio: "" });
        }
      });
    }
  }, [props.Id]);
  useEffect(() => {
    let modal = document.getElementById("myModalXD");
    // setDisplay(props.Display)
    if (props.Display == true) {
      modal.style.display = "block";
    } else {
      modal.style.display = "none";
    }
  }, [props.Display]);

  switch (TipoModal) {
    case "Proveedores":
      //Variables por version
      const [DevolverDato, setDevolverDato] = useState(false);
      const [TipoProveedor, setTipoProveedor] = useState("Hotel");
      //Funciones por version
      let DataRegist = {};
      const RegistrarDato = (keyDato, Dato) => {
        DataRegist[keyDato] = Dato;
      };
      //hooks
      useEffect(() => {
        if (DevolverDato == true) {
          console.log(DataRegist);
          setDevolverDato(false);
          console.log(DataRegist);
          fetch(APIpath, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tipoProveedor: DataRegist.tipo,
              accion: "create",
              data: DataRegist
            })
          })
            .then((r) => r.json())
            .then((data) => {
              alert(data.message);
            });
          props.MostrarModal(false);
        }
      }, [DevolverDato]);

      return (
        <div
          id="myModalXD"
          className={styles.Modal}
          onClick={(event) => {
            let modal = document.getElementById("myModalXD");
            if (event.target == modal) {
              props.MostrarModal(false);
            }
          }}
        >
          <div className={styles.Modal_content}>
            <button>
              <img
                src="/resources/save-black-18dp.svg"
                onClick={() => {
                  setDevolverDato(true);
                }}
              />
            </button>
            <button>
              <img src="/resources/close-black-18dp.svg" />
            </button>

            <div className={styles.divContacto}>
              <span>Datos de Contacto</span>
              <div className={styles.DatosProveedor}>
                <CampoTexto
                  Title="Nombre del Proveedor"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="nombre"
                  Dato={""}
                />
                <Selector
                  Title="Tipo de Proveedor"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="tipo"
                  Dato={"Hotel"}
                  SelectOptions={[
                    { value: "Hotel", texto: "Hotel" },
                    { value: "Agencia", texto: "Agencia" },
                    { value: "Guia", texto: "Guia" },
                    {
                      value: "Transporteterrestre",
                      texto: "Transporte Terrestre"
                    },
                    { value: "Restaurante", texto: "Restaurante" },
                    {
                      value: "Transporteferroviario",
                      texto: "Transporte Ferroviario"
                    },
                    { value: "Otro", texto: "Otro" }
                  ]}
                />
                <Selector
                  Title="Tipo de Documento"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="TipoDocumento"
                  Dato={"RUC"}
                  SelectOptions={[
                    { value: "DNI", texto: "DNI" },
                    { value: "RUC", texto: "RUC" }
                  ]}
                />
                <CampoTexto
                  Title="Numero de Documento"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="NroDocumento"
                  Dato={""}
                />
                <Selector
                  Title="Tipo de Moneda"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="TipoMoneda"
                  Dato={"Dolar"}
                  SelectOptions={[
                    { value: "Sol", texto: "Soles" },
                    { value: "Dolar", texto: "Dolares" }
                  ]}
                />
                <CampoTexto
                  Title="Enlace al Documento"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="EnlaceDocumento"
                  Dato={""}
                />
                <CampoTexto
                  Title="Gerente General"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="GerenteGeneral"
                  Dato={""}
                />
                <CampoTexto
                  Title="Numero de estrellas"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="NEstrellas"
                  Dato={""}
                />
                <CampoTexto
                  Title="Enlace a Pagina web"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="Web"
                  Dato={""}
                />
                <CampoTexto
                  Title="Destino donde esta el proveedor"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="Destino"
                  Dato={""}
                />
                <Selector
                  Title="Estado"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="Estado"
                  Dato={1}
                  SelectOptions={[
                    { value: 0, texto: "Inactivo" },
                    { value: 1, texto: "Activo" }
                  ]}
                />
              </div>

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
                  KeyDato="DireccionFiscal"
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
        </div>
      );
      break;
    case "Servicio":
      return (
        <div
          id="myModalXD"
          className={styles.Modal}
          onClick={(event) => {
            let modal = document.getElementById("myModalXD");
            if (event.target == modal) {
              props.MostrarModal(false);
            }
          }}
        >
          <div className={styles.Modal_content}>
            <CampoTexto
              Title="Nombre del Servicio"
              ModoEdicion={false}
              Dato={Data.NombreServicio}
            />
          </div>
        </div>
      );
      break;

    default:
      return <div>Alguio salio mal :V</div>;
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
