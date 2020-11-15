import { useRouter } from "next/router";
import styles from "@/globalStyles/Proveedor.module.css";
import TablaProveedores from "../../../components/ContactoProveedor/ContactoProveedor";
import MaterialTable from "material-table";
import React, { useEffect, useState, useCallback } from "react";

//componentes
import TablaBanco from "@/components/TablaModal//Modal/TablaBeneficiarios/TablaBanco";
import CampoTexto from "@/components/TablaModal/Modal/CampoTexto/CampoTexto";




export default function TipoProveedor({ Columnas, Datos, DatosProveedor }) {
  //Variables
  const [Edicion, setEdicion] = useState(false);
  const [DevolverDato, setDevolverDato] = useState(false);
  let DataEdit = {}
  const router = useRouter();
  const { idProveedor, TipoProveedor } = router.query;

  //Funccion
  const RegistrarDato = (keyDato, Dato) =>{
    DataEdit[keyDato]=Dato;
  }
  useEffect(()=>{
    if(DevolverDato==true){
      console.log(DataEdit)
      setDevolverDato(false)
        fetch('http://localhost:3000/api/proveedores/listaProveedores',{
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
        </div>
      );
      break;

    default:
      return <div>Algo salio mal :v</div>;
      break;
  }
}
export async function getServerSideProps(context) {
  let Columnas = [
    { title: "Servicio", field: "servicio" },
    { title: "Precio", field: "precio" },
    { title: "Caracteristicas", field: "descripcion" },
  ];
  let Datos = [];
  let DatosProveedor = {};
  const uruId = context.query.idProveedor;

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
      console.log(data);
      DatosProveedor = data.result;
    });

  await fetch(process.env.API_DOMAIN + "/api/proveedores/restaurante")
    .then((r) => r.json())
    .then((data1) => {
      data1.data.map((datosResult) => {
        if (uruId == datosResult.idProveedor) {
          Datos.push({
            servicio: datosResult.nombreServicio,
            precio: datosResult.precioDolares,
            descripcion: datosResult.descripcionServicio,
          });
        }
      });
    });
  return {
    props: {
      Columnas: Columnas,
      Datos: Datos,
      DatosProveedor: DatosProveedor,
    },
  };
}
