import { useRouter } from "next/router";
import styles from "@/globalStyles/Proveedor.module.css";
import TablaProveedores from "../../../components/ContactoProveedor/ContactoProveedor";
import MaterialTable from "material-table";
import React, { useEffect, useState, useCallback } from "react";
import { MongoClient } from "mongodb";

//componentes
import TablaBanco from "@/components/TablaModal//Modal/TablaBeneficiarios/TablaBanco";
import CampoTexto from "@/components/TablaModal/Modal/CampoTexto/CampoTexto";
import Selector from '@/components/TablaModal/Modal/Selector/Selector'
import TablaSimple from '@/components/Formulario/TablaSimple/TablaSimple'

export default function TipoProveedor({ Datos, DatosProveedor,APIpath }) {
  //Variables
  const [Edicion, setEdicion] = useState(false);
  const [DevolverDato, setDevolverDato] = useState(false);
  const [datosEditables, setDatosEditables] = useState(Datos)

  const router = useRouter();

  const { idProveedor, TipoProveedor } = router.query;
  const provDinamico = TipoProveedor.toLowerCase()

  let Columnas = []
  let DataEdit = {};
  let tittle = "Servicios de "+ TipoProveedor

  switch(provDinamico){
    case "hotel":
      Columnas= [
        // { title: "ID Producto Hotel", field: "IdProductoHotel" },
        { title: "tipoTarifa", field: "tipoTarifa" },
        { 
          title: "TipoHabitacion", 
          field: "tipoHabitacion",
          lookup: {Simple: "Simple",Doble: "Doble",Mwfamiliar: "Mw familiar",Triple: "Triple",Familiar: "Familiar",Suit: "Suit",Semisuit: "Semisuit"}
        },
        { title: "DescripHabitacion", field: "descripcionHabitacion" },
        { 
          title: "Cama Adicional", 
          field: "camAdic",
          type: "boolean"

        },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "IGV", field: "igv" },
      ]
      break;
    case "restaurante":
      Columnas= [
        { title: "Servicio", field: "servicio" },
        { title: "Precio", field: "precio" },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Caracteristicas", field: "caracte" },
      ]
      break;
    case "transporteterrestre":
      Columnas=[
        { title: "Servicio", field: "servicio" },
        { title: "Horario", field: "horario" },
        { title: "Tipo de Vehiculo", field: "tipvehiculo" },
        { title: "Precio Soles", field: "PrecioSoles" },
      ]
      break;
    case "guia":
      Columnas=[
        { title: "Direccion", field: "direccion" },
        { title: "DNI", field: "dni" },
        { title: "Idiomas", field: "idiomas" },
        { title: "Gremio", field: "gremio" },
        { title: "N° Carne", field: "carne" },
        { title: "Fecha Expedicion", field: "fecExpedi" , type: "date"   },
        { title: "Fecha Caducidad", field: "fecCaduc" , type: "date" }
      ]
      break;
    case "agencia":
      Columnas=[
        { title: "Nombre del Servicio", field: "servicio" },
        { title: "codigo del Servicio", field: "codServicio" },
        { title: "Precio Confidencial", field: "precioConfi" , type: "numeric" },
        { title: "Precio Publicado", field: "precioPubli" , type: "numeric" },
        { title: "Incluye", field: "incluye" },
        { title: "Duracion", field: "duracion" },
        { title: "Observacion", field: "observacion" }
      ]
      break;
    case "transporteferroviario":
      Columnas=[
        { title: "Ruta", field: "ruta" },
        { title: "Hora Salida", field: "salida" },
        { title: "Hora Llegada", field: "llegada" },
        { 
          title: "Tipo de Tren", 
          field: "tipoTren"
         },
        { title: "Precio Adulto Confi", field: "precioAdultoConfi" , type: "numeric" },
        { title: "Precio Niño Confi", field: "precioNiñoConfi", type: "numeric"  },
        { title: "Precio Guia Confi", field: "precioGuiaConfi" , type: "numeric" },
        { title: "Precio Adulto Publi", field: "precioAdultoPubli" , type: "numeric" },
        { title: "Precio Niño Publi", field: "precioNiñoPubli" , type: "numeric" },
        { title: "Precio Guia Publi", field: "precioGuiaPubli" , type: "numeric" }
      ]
      break;
      case "otro":
      Columnas=[
        { title: "Nombre del Servicio o Producto", field: "servicio" },
        { title: "codigo del Servicio o Producto", field: "codServicio" },
        { title: "Precio Confidencial", field: "precioConfi" , type: "numeric" },
        { title: "Precio Publicado", field: "precioPubli" , type: "numeric" },
      ]
      break;
  }
  //Funciones
  const RegistrarDato = (keyDato, Dato) => {
    DataEdit[keyDato] = Dato;
  };
  useEffect(() => {
    if (DevolverDato == true) {
      console.log(APIpath);
      setDevolverDato(false);
      fetch(APIpath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idProveedor: idProveedor,
          accion: "update",
          data: DataEdit,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          alert(data.message);
        });
    }
  }, [DevolverDato]);

  return (
    <div>
      <span>{DatosProveedor.nombre}</span>
      <img
        src="/resources/save-black-18dp.svg"
        onClick={() => {
          setEdicion(false);
          setDevolverDato(true);
        }}
      />
      <img
        src="/resources/edit-black-18dp.svg"
        onClick={(event) => {
          if (Edicion == false) {
            event.target.src = "/resources/close-black-18dp.svg";
            setEdicion(true);
          } else {
            event.target.src = "/resources/edit-black-18dp.svg";
            setEdicion(false);
          }
        }}
      />
      <div className={styles.divDatosPrincipal}>
        <div className={styles.ServiciosPersonalizados}>
          <span>Servicios Personalizados</span>
          <textarea value={DatosProveedor.ServiciosPersonalizados} />
        </div>
        <div className={styles.DatosProveedor}>
          <CampoTexto
            Title="Nombre del Proveedor"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="nombre"
            Dato={DatosProveedor.nombre || ""}
          />
          <Selector
            Title="Tipo de Proveedor"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="tipo"
            Dato={DatosProveedor.tipo || ""}
            SelectOptions={[
              { value: "Hotel", texto: "Hotel" },
              { value: "Agencia", texto: "Agencia" },
              { value: "Guia", texto: "Guia" },
              { value: "TransporteTerrestre", texto: "Transporte Terrestre" },
              { value: "Restaurante", texto: "Restaurante" },
              {
                value: "TransporteFerroviario",
                texto: "Transporte Ferroviario",
              },
              { value: "Otro", texto: "Otro" },
            ]}
          />
          <Selector
            Title="Tipo de Documento"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="TipoDocumento"
            Dato={DatosProveedor.TipoDocumento || ""}
            SelectOptions={[
              { value: "DNI", texto: "DNI" },
              { value: "RUC", texto: "RUC" },
            ]}
          />
          <CampoTexto
            Title="Numero de Documento"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="NroDocumento"
            Dato={DatosProveedor.NroDocumento || ""}
          />
          <Selector
            Title="Tipo de Moneda"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="TipoMoneda"
            Dato={DatosProveedor.TipoMoneda || ""}
            SelectOptions={[
              { value: "Sol", texto: "Soles" },
              { value: "Dolar", texto: "Dolares" },
            ]}
          />
          <CampoTexto
            Title="Enlace al Documento"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="EnlaceDocumento"
            Dato={DatosProveedor.EnlaceDocumento || ""}
          />
          <CampoTexto
            Title="Gerente General"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="GerenteGeneral"
            Dato={DatosProveedor.GerenteGeneral || ""}
          />
          <CampoTexto
            Title="Numero de estrellas"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="NEstrellas"
            Dato={DatosProveedor.NEstrellas || ""}
          />
          <CampoTexto
            Title="Enlace a Pagina web"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="Web"
            Dato={DatosProveedor.Web || ""}
          />
          <CampoTexto
            Title="Destino donde esta el proveedor"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="Destino"
            Dato={DatosProveedor.Destino || ""}
          />
          <Selector
            Title="Estado"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="Estado"
            Dato={DatosProveedor.Estado || ""}
            SelectOptions={[
              { value: 0, texto: "Inactivo" },
              { value: 1, texto: "Activo" },
            ]}
          />
        </div>
        <div className={styles.divContacto}>
          <span>Datos de Contacto</span>
          <div className={styles.DataContacto}>
            <TablaSimple
            Title="Numeros de Contacto"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="NumContac"
            Dato={DatosProveedor.NumContac || []}
            Reiniciar={false}
            columnas={[
              {field: "NombreContac", title: "Nombre del Contacto"},
              {field: "Numero", title: "Numero de Contacto"},
            ]}
          />
          <TablaSimple
            Title="Correos electronicos"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="Email"
            Dato={DatosProveedor.Email || []}
            Reiniciar={false}
            columnas={[
              {field: "NombreContac", title: "Nombre del Contacto"},
                {field: "Email", title: "Email"},
            ]}
          />
          
            {/* <CampoTexto
              Title="Numero de telefono"
              ModoEdicion={Edicion}
              DevolverDatoFunct={RegistrarDato}
              DarDato={DevolverDato}
              KeyDato="celular"
              Dato={DatosProveedor.celular || ""}
            />
            <CampoTexto
              Title="Numero de telefono 2"
              ModoEdicion={Edicion}
              DevolverDatoFunct={RegistrarDato}
              DarDato={DevolverDato}
              KeyDato="celular2"
              Dato={DatosProveedor.celular2 || ""}
            />
            <CampoTexto
              Title="Email"
              ModoEdicion={Edicion}
              DevolverDatoFunct={RegistrarDato}
              DarDato={DevolverDato}
              KeyDato="email"
              Dato={DatosProveedor.email || ""}
            />
            <CampoTexto
              Title="Email 2"
              ModoEdicion={Edicion}
              DevolverDatoFunct={RegistrarDato}
              DarDato={DevolverDato}
              KeyDato="email2"
              Dato={DatosProveedor.email2 || ""}
            /> */}
            
          </div>
        </div>
        <div className={styles.divCuentasBancarias}>
        <TablaSimple
            Title="Datos de Cuentas Bancarias"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="DatosBancarios"
            Dato={DatosProveedor.DatosBancarios || []}
            Reiniciar={false}
            columnas={[
              {field: "Banco", title: "Banco"},
                {field: "Beneficiario", title: "Beneficiario"},
                {field: "TipoDocumento", title: "Tipo de Documento", lookup:{RUC:'RUC',DNI:'DNI'}},
                {field: "NumDoc", title: "Numero de Documento"},
                {field: "Cuenta", title: "Numero de Cuenta"},
                {field: "CCI", title: "CCI"}
            ]}
          />
          {/* <TablaBanco
            datosbanc={DatosProveedor.DatosBancarios}
            ModoEdicion={Edicion}
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
          title={tittle}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                    let x
                    let idprov= DatosProveedor.idProveedor
                    newData.idProveedor = idprov
                    fetch(`http://localhost:3000/api/proveedores/${provDinamico}`,{
                      method:"POST",
                      headers:{"Content-Type": "application/json"},
                      body: JSON.stringify({
                        data: newData,
                        accion: "create",
                      }),
                    })
                    .then(r=>r.json())
                    .then(data=>{
                      alert(data.message);
                    })
                  setDatosEditables([...datosEditables, newData]);
                  resolve();
                }, 1000)
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataUpdate = [...datosEditables];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  setDatosEditables([...dataUpdate]);
                  
                  delete dataUpdate[index]._id

                  // console.log(dataUpdate[index])
                  // console.log(dataUpdate[index].IdProductoHotel)
                  // console.log("este dato weeee"+index)
                  // console.log()
                  
                  fetch(`http://localhost:3000/api/proveedores/${provDinamico}`,{
                    method:"POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({
                      idProducto: dataUpdate[index].IdProductoHotel,
                      data: dataUpdate[index],
                      accion: "update",
                    }),
                  })
                  .then(r=>r.json())
                  .then(data=>{
                    alert(data.message);
                  })
                  
                  resolve();
                }, 1000)
              }),
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...datosEditables];
                  const index = oldData.tableData.id;

                  console.log(dataDelete[index])
                  console.log(dataDelete[index].IdProductoHotel)

                  fetch(`http://localhost:3000/api/proveedores/${provDinamico}`,{
                    method:"POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({
                      idProducto: dataDelete[index].IdProductoHotel,
                      accion: "delete",
                    }),
                  })
                  .then(r=>r.json())
                  .then(data=>{
                    alert(data.message);
                  })

                  dataDelete.splice(index, 1);
                  setDatosEditables([...dataDelete]);

                  resolve()
                }, 1000)
              }),
          }}
          options={{
            actionsColumnIndex: -1,
          }}
        ></MaterialTable>
        {/* <TablaProveedores/> */}
      </div>
    </div>
  );
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
    console.log("mongo xdxdxdxd");
    await client.connect();
    let collection = client.db(dbName).collection("Proveedor");
    let result = await collection.findOne({ idProveedor: uruId });
    // DatosProveedor = JSON.stringify(result);
    result._id = JSON.stringify(result._id);
    DatosProveedor = result;
  } catch (error) {
    console.log("Error cliente Mongo 1 => " + error);
  } finally {
    client.close();
  }
  
  switch (provDinamico) {
    
    case "hotel":
      collectionName = "ProductoHoteles";
      break;
    case "restaurante":
      collectionName = "ProductoRestaurantes";
      break;
    case "transporteterrestre":
      collectionName = "ProductoTranportes";
      break;
    case "transporteferroviario":
      collectionName = "ProductoTransFerroviario";
      break;
    case "guia":
      collectionName = "ProductoGuias";
      break;
    case "agencia":
      collectionName = "ProductoAgencias";
      break;
    default:
      collectionName = "ProductoOtros";
      break;
  }
  try {
    console.log('mongo 2 xdxdxdxd')
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    let collection = client.db(dbName).collection(collectionName);
    let result = await collection.find({idProveedor: uruId}).project({
      "_id":0, 
    }).toArray()

    // result.map(x => {
    //    x._id= JSON.stringify(x._id)
    // })
    Datos=result

  } catch (error) {
    console.log("Error cliente Mongo 2 => "+error)
  } finally{
    client.close()
  }
  // console.log(DatosProveedor.idProveedor)
  const APIpath = process.env.API_DOMAIN+"/api/proveedores/listaProveedores";
  return {
    props: {
      Datos: Datos,
      DatosProveedor: DatosProveedor,
      APIpath:APIpath
    },
  };
}
