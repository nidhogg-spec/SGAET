import { useRouter } from "next/router";
import styles from "@/globalStyles/Proveedor.module.css";
import TablaProveedores from "../../../components/ContactoProveedor/ContactoProveedor";
import MaterialTable from "material-table";
import React, { useEffect, useState, useCallback } from "react";
import { MongoClient } from "mongodb";

//componentes
import TablaBanco from "@/components/TablaModal//Modal/TablaBeneficiarios/TablaBanco";
import CampoTexto from "@/components/TablaModal/Modal/CampoTexto/CampoTexto";

import { dark } from "@material-ui/core/styles/createPalette";

const APIpath = process.env.API_DOMAIN+"/api/proveedores/listaProveedores";


export default function TipoProveedor({ Datos, DatosProveedor }) {
  //Variables
  const [Edicion, setEdicion] = useState(false);
  const [DevolverDato, setDevolverDato] = useState(false);
  const [datosEditables, setDatosEditables] = useState(Datos)
  
  let Columnas = []
  let DataEdit = {}
  const router = useRouter();

  const { idProveedor, TipoProveedor } = router.query;

  const provDinamico = TipoProveedor.toLowerCase()


  switch(provDinamico){
    case "hotel":
      Columnas= [
        // { title: "Destino", field: "destino", defaultGroupOrder: 0 },
        { title: "tipoTarifa", field: "tipoTarifa" },
        { title: "TipoHabitacion", field: "tipoHabitacion" },
        { title: "Precio Publicado", field: "precioPubli" },
        { title: "Precio Confidencial", field: "precioConfi" },
        { title: "IGV", field: "igv" },
      ]
      break;
    case "restauranet":
      Columnas= [
        { title: "Servicio", field: "servicio" },
        { title: "Precio", field: "precio" },
        { title: "Caracteristicas", field: "caracte" },
      ]
      break;
    case "transporte":
      Columnas=[
        { title: "Servicio", field: "servicio", defaultGroupOrder: 0 },
        { title: "Horario", field: "horario" },
        { title: "Tipo de Vehiculo", field: "tipvehiculo" },
        { title: "Precio Soles", field: "PrecioSoles" },
        { title: "Precio Dolares", field: "PrecioDolares" },
      ]
      break;
    case "guia":
      Columnas=[
        { title: "Direccion", field: "direccion" },
        { title: "DNI", field: "dni" },
        { title: "Idiomas", field: "idiomas" },
        { title: "Asociacion", field: "asociacion" },
        { title: "N° Carne", field: "carne" },
        { title: "Fecha Expedicion", field: "fecExpedi" },
        { title: "Fecha Caducidad", field: "fecCaduc" }
      ]
      break;
    case "agencia":
      Columnas=[
        { title: "Servicio", field: "servicio" },
        { title: "Precio Confidencial", field: "precioConfi" },
        { title: "Precio Publicado", field: "precioPubli" },
        { title: "Incluye", field: "incluye" },
        { title: "Duracion", field: "duracion" },
        { title: "Observacion", field: "observacion" }
      ]
      break;
    case "transferroviario":
      Columnas=[
        { title: "Servicio", field: "servicio" },
        { title: "Precio Confidencial", field: "precioConfi" },
        { title: "Precio Publicado", field: "precioPubli" },
        { title: "Incluye", field: "incluye" },
        { title: "Duracion", field: "duracion" },
        { title: "Observacion", field: "observacion" }
      ]
      break;
  }
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
              {/* <TablaBanco
                datosbanc={DatosProveedor.DatosBancarios}
                Edicion={Edicion}
                DevolverDatoFunct={RegistrarDato}
                KeyDato="DatosBancarios"
                DarDato={DevolverDato}
              /> */}
            </div>
          </div>
          <div>
            <MaterialTable
              columns={Columnas}
              data={datosEditables}
              title="Productos del hotel"
                editable={{
                onRowAdd: newData =>
                new Promise ((resolve,reject) => {
                  setTimeout(() => {

                    fetch('http://localhost:3000/api/proveedores/hotel',{
                      method:"POST",
                      headers:{"Content-Type": "application/json"},
                      body: JSON.stringify({
                        data: newData,
                        accion: "create",
                      }),
                    })
                  .then(r=>r.json())
                  .then(data=>{
                  })
                    setDatosEditables([...datosEditables, newData])
                    
                    resolve();

                  }, 1000)
                }),
                onRowUpdate: (newData, oldData)=>
                  new Promise((resolve, reject)=>{
                    setTimeout(()=>{
                      const dataUpdate = [...datosEditables];
                      const index = oldData.tableData.id;
                      dataUpdate[index] = newData;
                      setDatosEditables([...dataUpdate])

                      fetch('http://localhost:3000/api/proveedores/hotel',{
                        method:"POST",
                        headers:{"Content-Type": "application/json"},
                        body: JSON.stringify({
                          data: newData,
                          idProveedor: idProveedor,
                          accion: "update",
                        }),
                      })
                      resolve();

                    },1000)
                  }),
                onRowDelete: oldData=>
                  new Promise((resolve,reject)=>{
                    setTimeout(() => {
                      
                    }, 1000);
                  })
              }}
              options={{
                actionsColumnIndex: -1,
              }}
            />
            {/* <TablaProveedores/> */}
          </div>
         </div>
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
                // grouping: true
              }}
            ></MaterialTable>
            {/* <TablaProveedores/> */}
          </div>
        // </div>
      );
      break;
      case "Guia" :
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
            {/* <div className={styles.divCuentasBancarias}>
              <TablaBanco
                datosbanc={DatosProveedor.DatosBancarios}
                Edicion={Edicion}
              />
            </div> */}
          </div>
          <div>
            <MaterialTable
              columns={Columnas}
              data={Datos}
              title="Productos de Tranporte"
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
      case "Agencia" :
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
              {/* <div className={styles.divCuentasBancarias}>
                <TablaBanco
                  datosbanc={DatosProveedor.DatosBancarios}
                  Edicion={Edicion}
                />
              </div> */}
            </div>
            <div>
              <MaterialTable
                columns={Columnas}
                data={Datos}
                title="Productos de Tranporte"
                editable={{
                  isEditable: rowData => rowData
                }}
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

  var Datos = [];

  let DatosProveedor = {};

  const uruId = context.query.idProveedor;

  const provDinamico = context.query.TipoProveedor.toLowerCase()

  /*---------------------------------------------------------------------------------*/
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let collectionName=""
  try {
    console.log('mongo xdxdxdxd')
    await client.connect()
    let collection = client.db(dbName).collection('Proveedor');
    let result = await collection.findOne(
      { idProveedor: uruId, }
    );
    // DatosProveedor = JSON.stringify(result);
    result._id=JSON.stringify(result._id)
    DatosProveedor = result

  } catch (error) {
    console.log("Error cliente Mongo 1 => "+error)
  } finally{
    client.close()
  }
  
  switch (provDinamico) {
    case 'hotel':
      collectionName='ProductoHoteles'
      break;
    case 'restaurante':
      collectionName='ProductoRestaurantes'
      break;
    case 'transporte':
      collectionName='ProductoTranportes'
      break;
    case 'guia':
      collectionName='ProductoGuias'
      break;
    case 'agencia':
      collectionName='ProductoAgencias'
      break;
    default:
      collectionName='ProductoOtros'
      break;
  }
  try {
    console.log('mongo 2 xdxdxdxd')
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect()
    let collection = client.db(dbName).collection(collectionName);
    let result = await collection.find({}).toArray();

    // DatosProveedor = JSON.stringify(result);
    // Datos = JSON.stringify(result)

    result.map(x => {
       x._id= JSON.stringify(x._id)
    })
    Datos=result

    // console.log(Datos)
  } catch (error) {
    console.log("Error cliente Mongo 2 => "+error)
  } finally{
    client.close()
  }
  return {
    props: {
      Datos: Datos,
      DatosProveedor: DatosProveedor,
    },
  };
}
