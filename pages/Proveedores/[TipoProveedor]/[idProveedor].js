import { useRouter } from "next/router";
import styles from "@/globalStyles/Proveedor.module.css";
import TablaProveedores from "../../../components/ContactoProveedor/ContactoProveedor";
import MaterialTable from "material-table";
import React, { useEffect, useState, useCallback } from "react";

//componentes
import TablaBanco from "@/components/TablaModal//Modal/TablaBeneficiarios/TablaBanco";
import CampoTexto from "@/components/TablaModal/Modal/CampoTexto/CampoTexto";

import { dark } from "@material-ui/core/styles/createPalette";

const APIpath = process.env.API_DOMAIN+"/api/proveedores/listaProveedores";


export default function TipoProveedor({ Columnas, Datos, DatosProveedor }) {
  //Variables
  const [Edicion, setEdicion] = useState(false);
  const [DevolverDato, setDevolverDato] = useState(false);
  let DataEdit = {}
  const router = useRouter();
  const { idProveedor, TipoProveedor } = router.query;

  //Funciones
  const RegistrarDato = (keyDato, Dato) =>{
    DataEdit[keyDato]=Dato;
  }
  useEffect(()=>{
    if(DevolverDato==true){
      console.log(DataEdit)
      setDevolverDato(false)
        fetch(APIpath,{
                method:"POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({
                  idProveedor: idProveedor,
                  accion: "update",
                  data: DataEdit
                }),
              })
              .then(r=>r.json())
              .then(data=>{
                alert(data.message);
              })
    }
  },[DevolverDato])
  
  switch (TipoProveedor) {
    case "Hotel":
      return (
        <div>
          <span>{DatosProveedor.nombre}</span> 
          <img src="/resources/save-black-18dp.svg" onClick={()=>{
            setEdicion(false)
            setDevolverDato(true)
          }} 
          />
          <img src="/resources/edit-black-18dp.svg" onClick={(event)=>{
            if(Edicion==false){
              event.target.src="/resources/close-black-18dp.svg"
              setEdicion(true)
            }else{
              event.target.src="/resources/edit-black-18dp.svg"
              setEdicion(false)
            }
            
          }} 
          />
          <div className = {styles.divDatosPrincipal}>
            <div className={styles.ServiciosPersonalizados}>
              <span>Servicios Personalizados</span>
              <textarea value={DatosProveedor.ServiciosPersonalizados} />
            </div>
            <div className={styles.divContacto}>
              <span>Datos de Contacto</span>
              <div className={styles.DataContacto}>
                <CampoTexto
                  Title="Razon Social"
                  ModoEdicion={Edicion}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="RazonSocial"
                  Dato={DatosProveedor.RazonSocial || "Not fofund"}
                />
                <CampoTexto
                  Title="Numero de telefono"
                  ModoEdicion={Edicion}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="celular"
                  Dato={DatosProveedor.celular || "Not fofund"}
                />
                <CampoTexto
                  Title="Numero de telefono 2"
                  ModoEdicion={Edicion}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="celular2"
                  Dato={DatosProveedor.celular2 || "Not fofund"}
                />
                <CampoTexto
                  Title="Email"
                  ModoEdicion={true}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="email"
                  Dato={DatosProveedor.email || "Not fofund"}
                />
                <CampoTexto
                  Title="Email 2"
                  ModoEdicion={Edicion}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="email2"
                  Dato={DatosProveedor.email2 || "Not fofund"}
                />
                <CampoTexto
                  Title="Direccion"
                  ModoEdicion={Edicion}
                  DevolverDatoFunct={RegistrarDato}
                  DarDato={DevolverDato}
                  KeyDato="direccionRegistrada"
                  Dato={DatosProveedor.direccionRegistrada || "Not fofund"}
                />
              </div>
            </div>
            <div className={styles.divCuentasBancarias}>
              <TablaBanco
                datosbanc={DatosProveedor.DatosBancarios}
                Edicion={Edicion}
                DevolverDatoFunct={RegistrarDato}
                KeyDato="DatosBancarios"
                DarDato={DevolverDato}
              />
            </div>
          </div>

          <div>
            <MaterialTable
              columns={Columnas}
              data={Datos}
              title="Productos del hotel"
              actions={[
                {
                  icon: () => {
                    return <img src="/resources/edit-black-18dp.svg" />;
                  },
                  tooltip: "Edit Proveedor",
                  // onClick: (event, rowData) => alert("You saved " + rowData.name)
                },
                {
                  icon: () => {
                    return <img src="/resources/delete-black-18dp.svg" />;
                  },
                  tooltip: "Delete Proveedor",
                  // onClick: (event, rowData) => alert("You saved " + rowData.name)
                },
              ]}
              options={{
                actionsColumnIndex: -1,
              }}
            ></MaterialTable>
            {/* <TablaProveedores/> */}
          </div>
        // </div>
      );
      break;
    case "Restaurante" :
      return(
        <div>
          <span>{DatosProveedor.nombre}</span>
          <div className = {styles.divDatosPrincipal}>
            <div className={styles.ServiciosPersonalizados}>
              <span>Servicios Personalizados</span>
              <textarea />
            </div>
            <div className={styles.divContacto}>
              <span>Datos de Contacto</span>
              <div className={styles.DataContacto}>
                <CampoTexto
                  Title="Razon Social"
                  ModoEdicion={false}
                  Dato={DatosProveedor.RazonSocial || "Not fofund"}
                />
                <CampoTexto
                  Title="Numero de telefono"
                  ModoEdicion={false}
                  Dato={DatosProveedor.celular || "Not fofund"}
                />
                <CampoTexto
                  Title="Numero de telefono 2"
                  ModoEdicion={false}
                  Dato={DatosProveedor.celular2 || "Not fofund"}
                />
                <CampoTexto
                  Title="Email"
                  ModoEdicion={false}
                  Dato={DatosProveedor.email || "Not fofund"}
                />
                <CampoTexto
                  Title="Email 2"
                  ModoEdicion={false}
                  Dato={DatosProveedor.email2 || "Not fofund"}
                />
                <CampoTexto
                  Title="Direccion"
                  ModoEdicion={false}
                  Dato={DatosProveedor.direccionRegistrada || "Not fofund"}
                />
              </div>
            </div>
            <div className={styles.divCuentasBancarias}>
              <TablaBanco
                datosbanc={DatosProveedor.DatosBancarios}
                Edicion={Edicion}
              />
            </div>
          </div>
          <div>
            <MaterialTable
              columns={Columnas}
              data={Datos}
              title="Productos del hotel"
              actions={[
                {
                  icon: () => {
                    return <img src="/resources/edit-black-18dp.svg" />;
                  },
                  tooltip: "Edit Proveedor",
                  // onClick: (event, rowData) => alert("You saved " + rowData.name)
                },
                {
                  icon: () => {
                    return <img src="/resources/delete-black-18dp.svg" />;
                  },
                  tooltip: "Delete Proveedor",
                  // onClick: (event, rowData) => alert("You saved " + rowData.name)
                },
              ]}
              options={{
                actionsColumnIndex: -1,
              }}
            ></MaterialTable>
            {/* <TablaProveedores/> */}
          </div>
        // </div>
      );
      break;
    default:
      return <div>Algo salio mal :v</div>;
      break;
  }
}
export async function getServerSideProps(context) {
 
  let Datos = [];
  let DatosProveedor = {};
  const uruId = context.query.idProveedor;
  const provDinamico = context.query.TipoProveedor.toLowerCase()
  /*----------------------------------------------------------------*/
  /*Variables para capturar valores de los hoteles debido a que estan en documentos separados en mongo*/
  let dest = ""
  let tiptar = ""
  let ig  = ""
  /*----------------------------------------------------------------*/
  let Columnas = [];

  if(provDinamico=="hotel"){
    Columnas= [
      { title: "Destino", field: "destino" },
      { title: "tipoTarifa", field: "tipoTarifa" },
      { title: "TipoHabitacion", field: "tipoHabitacion" },
      { title: "Precio Publicado", field: "precioPubli" },
      { title: "Precio Confidencial", field: "precioConfi" },
      { title: "IGV", field: "igv" },
    ]

  }else if(provDinamico=="restaurante"){
    Columnas= [
      { title: "Servicio", field: "servicio" },
      { title: "Precio", field: "precio" },
      { title: "Caracteristicas", field: "caracte" },
    ]
  }
  
  // switch (provDinamico){
  //   case "hotel":
      
  // }

  await fetch(process.env.API_DOMAIN + "/api/proveedores/listaProveedores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idProveedor: uruId,
      accion: "findOne",
    }),
  })
    .then((r) => r.json())
    .then((data) => {
      // console.log(data);
      DatosProveedor = data.result;
    });
  await fetch(process.env.API_DOMAIN + `/api/proveedores/${provDinamico}`)
    .then((r) => r.json())
    .then((data1) => {
      if(provDinamico=="hotel"){
        data1.data.map((datosResult) => {
          if (uruId == datosResult.idProveedor) {
            if(datosResult.PrecioConfi == undefined){
              dest = datosResult.destino
              tiptar = datosResult.tipoTarifa
              ig = datosResult.IGV
            }
            if(datosResult.PrecioPubli !== undefined && datosResult.PrecioConfi !== undefined){
              Datos.push({
                destino: dest,
                tipoTarifa: tiptar,
                igv: ig,
                tipoHabitacion: datosResult.TipoHabitacion,
                precioPubli: datosResult.PrecioPubli,
                precioConfi: datosResult.PrecioConfi
              });
            } 
          }
          
        }); 
      }else if(provDinamico=="restaurante"){
        data1.data.map((datosResult)=>{
          if (uruId == datosResult.idProveedor) {
            Datos.push({
              servicio: datosResult.nombreServicio,
              precio: datosResult.precioDolares,
              caracte: datosResult.descripcionServicio
            })
          }
        })
      }
    });
  return {
    props: {
      Columnas: Columnas,
      Datos: Datos,
      DatosProveedor: DatosProveedor,
    },
  };
}
