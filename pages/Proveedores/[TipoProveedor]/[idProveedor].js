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
        { 
          title: "Tipo Pasajero", 
          field: "TipoPaxs" ,
          lookup: {
            Nacional: "Nacional",
            Extranjero: "Extranjero",
            Unico: "Unico",
          }
        },
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
        { title: "Precio Cotizacion", field: "precioCoti", type: "numeric" },
      ]
      break;
    case "restaurante":
      Columnas= [
        { 
          title: "Tipo Pasajero", 
          field: "TipoPaxs" ,
          lookup: {
            Nacional: "Nacional",
            Extranjero: "Extranjero",
            Unico: "Unico",
          }
        },
        { title: "Servicio", field: "servicio" },
        { title: "Codigo", field: "codServicio" },
        { title: "Caracteristicas", field: "caracte" },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Precio Cotizacion", field: "precioCoti", type: "numeric" },
      ]
      break;
    case "transporteterrestre":
      Columnas=[
        { 
          title: "Tipo Pasajero", 
          field: "TipoPaxs" ,
          lookup: {
            Nacional: "Nacional",
            Extranjero: "Extranjero",
            Unico: "Unico",
          }
        },
        { title: "Codigo", field: "codServicio" },
        { title: "Servicio", field: "servicio" },
        { title: "Horario", field: "horario" },
        { title: "Tipo de Vehiculo", field: "tipvehiculo" },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Precio Cotizacion", field: "precioCoti", type: "numeric" },
      ]
      break;
    case "guia":
      Columnas=[
        { 
          title: "Tipo Pasajero", 
          field: "TipoPaxs" ,
          lookup: {
            Nacional: "Nacional",
            Extranjero: "Extranjero",
            Unico: "Unico",
          }
        },
        { title: "Codigo", field: "codServicio" },
        { title: "Direccion", field: "direccion" },
        { title: "DNI", field: "dni" },
        { title: "Idiomas", field: "idiomas" },
        { title: "Gremio", field: "gremio" },
        { title: "N° Carne", field: "carne" },
        { title: "Fecha Expedicion", field: "fecExpedi" , type: "date"   },
        { title: "Fecha Caducidad", field: "fecCaduc" , type: "date" },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Precio Cotizacion", field: "precioCoti", type: "numeric" },
      ]
      break;
    case "agencia":
      Columnas=[
        { 
          title: "Tipo Pasajero", 
          field: "TipoPaxs" ,
          lookup: {
            Nacional: "Nacional",
            Extranjero: "Extranjero",
            Unico: "Unico",
          }
        },
        { title: "Nombre del Servicio", field: "servicio" },
        { title: "codigo del Servicio", field: "codServicio" },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Precio Cotizacion", field: "precioCoti", type: "numeric" },
        { title: "Incluye", field: "incluye" },
        { title: "Duracion", field: "duracion" },
        { title: "Observacion", field: "observacion" }
      ]
      break;
    case "transporteferroviario":
      Columnas=[
        { 
          title: "Tipo Pasajero", 
          field: "TipoPaxs" ,
          lookup: {
            Nacional: "Nacional",
            Extranjero: "Extranjero",
            Unico: "Unico",
          }
        },
        { title: "Ruta", field: "ruta" },
        { title: "Hora Salida", field: "salida" },
        { title: "Hora Llegada", field: "llegada" },
        { 
          title: "Tipo de Tren", 
          field: "tipoTren"
         },
         { 
          title: "Etapa Pasajero", 
          field: "EtapaPaxs" ,
          lookup: {
            Adulto: "Adulto",
            Niño: "Niño",
            Guia: "Guia",
          }
        },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Precio Cotizacion", field: "precioCoti", type: "numeric" },
        // { title: "Precio Guia Confi", field: "precioGuiaConfi" , type: "numeric" },
        // { title: "Precio Adulto Publi", field: "precioAdultoPubli" , type: "numeric" },
        // { title: "Precio Niño Publi", field: "precioNiñoPubli" , type: "numeric" },
        // { title: "Precio Guia Publi", field: "precioGuiaPubli" , type: "numeric" }
      ]
      break;
      case "sitioturistico":
        Columnas=[
          {
            title: "Nombre del Servicio", 
            field: "NomServicio" ,
          },
          { 
            title: "Categoria", 
            field: "Categoria",
            lookup: {
              Adulto: "Adulto",
              Niño: "Niño",
              AdultoMayor: "Adulto Mayor",
            }
          },
          { title: "Horario de Atencion", field: "HoraAtencion" },
          { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
          { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
          { title: "Precio Cotizacion", field: "precioCoti", type: "numeric" },
        ]
        break;
      case "otro":
      Columnas=[
        {
          title: "Tipo Pasajero", 
          field: "TipoPaxs" ,
          lookup: {
            Nacional: "Nacional",
            Extranjero: "Extranjero",
            Unico: "Unico",
          }
        },
        { title: "Nombre del Servicio o Producto", field: "servicio" },
        { title: "codigo del Servicio o Producto", field: "codServicio" },
        { title: "Descripcion", field: "Descripcion" },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Precio Cotizacion", field: "precioCoti", type: "numeric" },
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


  /* Para la funcion de duplicar un columna */
  const materialTableRef = React.createRef();
  const [initialFormData, setinitialFormData] = useState({});
  
  function validarDuplicado (){

  }
  return (
    <div>
      <h1>{DatosProveedor.nombre}</h1>
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
      <a href='#ProductoServicio_area'>Productos/Servicios</a>
      <div className={styles.divDatosPrincipal}>
        <div className={styles.DatosProveedor}>
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
              { value: "SitioTuristico", texto: "Sitio Turistico" },
              {
                value: "TransporteFerroviario",
                texto: "Transporte Ferroviario",
              },
              { value: "Otro", texto: "Otro" },
            ]}
          />
          <CampoTexto
            Title="Razon Social"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="RazonSocial"
            Dato={DatosProveedor.RazonSocial || ""}
          />
          <CampoTexto
            Title="Nombre Comercial"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="nombre"
            Dato={DatosProveedor.nombre || ""}
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
              { value: "CarnetExtranjeria", texto: "Carnet de Extranjeria" },
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
          <CampoTexto
            Title="Direccion fiscal"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="DomicilioFiscal"
            Dato={DatosProveedor.DomicilioFiscal || ""}
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
            Title="Numero de telefono o celular principal"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="NumeroPrincipal"
            Dato={DatosProveedor.NumeroPrincipal || ""}
          />
          <CampoTexto
            Title="Email principal"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="EmailPrincipal"
            Dato={DatosProveedor.EmailPrincipal || ""}
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

          <h2>Representantante Legal</h2>
          <CampoTexto
            Title="Nombre del Gerente General"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="NombreRepresentanteLegal"
            Dato={DatosProveedor.NombreRepresentanteLegal || ""}
          />
          <CampoTexto
            Title="Numero del documento de identidad"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="NroDocIdentRepresentanteLegal"
            Dato={DatosProveedor.NroDocIdentRepresentanteLegal || ""}
          />

          <h2>Otros datos</h2>

          {
          provDinamico =='hotel' 
            ? 
            <Selector
              Title="Numero de estrellas"
              ModoEdicion={Edicion}
              DevolverDatoFunct={RegistrarDato}
              DarDato={DevolverDato}
              KeyDato="NEstrellas"
              Dato={DatosProveedor.NEstrellas || ""}
              SelectOptions={[
                { value: 0, texto: "0" },
                { value: 1, texto: "1" },
                { value: 2, texto: "2" },
                { value: 3, texto: "3" },
                { value: 4, texto: "4" },
                { value: 5, texto: "5" },
              ]}
            />
            :
          provDinamico =='restaurante' 
          ? 
          <Selector
            Title="Numero de Tenedores"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="NTenedores"
            Dato={DatosProveedor.NTenedores || ""}
            SelectOptions={[
              { value: 0, texto: "0" },
              { value: 1, texto: "1" },
              { value: 2, texto: "2" },
              { value: 3, texto: "3" },
              { value: 4, texto: "4" },
              { value: 5, texto: "5" },
            ]}
          />
          :
          null}
          
          <CampoTexto
            Title="Enlace a Pagina web"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="Web"
            Dato={DatosProveedor.Web || ""}
          />

          {/* <CampoTexto
            Title="Destino donde esta el proveedor"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="Destino"
            Dato={DatosProveedor.Destino || ""}
          /> */}
          
        </div>
        <div className={styles.divContacto}>
          <span>Datos de Contacto</span>
          
            <TablaSimple
            Title="Contactos"
            ModoEdicion={Edicion}
            DevolverDatoFunct={RegistrarDato}
            DarDato={DevolverDato}
            KeyDato="Contacto"
            Dato={DatosProveedor.Contacto || []}
            Reiniciar={false}
            columnas={[
              { field: "NombreContac", title: "Nombre del Contacto" },
                { field: "Area", title: "Area de trabajo" },
                { field: "Numero", title: "Telefono/Celular" },
                { field: "Email", title: "Email" },
            ]}
          />
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
                { field: "TipoCuenta", title: "Tipo de Cuenta Bancaria" },
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

      <div id='ProductoServicio_area'>
        <MaterialTable
          columns={Columnas}
          data={datosEditables}
          title={tittle}
          //------------ Funcion de duplicado ----------------------------------------------
          tableRef={materialTableRef}
          initialFormData={initialFormData}
          actions={[
            {
              icon: 'library_add',
              tooltip: 'Duplicate User',
              onClick: (event, rowData) => {
                const materialTable = materialTableRef.current;
                console.log(materialTable)
                console.log(initialFormData)
                setinitialFormData({...rowData})
                materialTable.dataManager.changeRowEditing();
                materialTable.setState({
                  ...materialTable.dataManager.getRenderState(),
                  showAddRow: true,
                });
              }
            }
          ]}
          //-------------------------------------------------------------------------
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {    
                  let duplicados = false             
                  for (const keyDuplicar in initialFormData) 
                    if 
                    (
                      /*Caso de Hotel Solo*/
                      keyDuplicar == "descripcionHabitacion" | 
                      /*Caso de Hotel Solo*/
                      keyDuplicar == "NomServicio" |
                      /*Caso de Restaurante,TransporteTerrestre*/
                      keyDuplicar == "servicio" | 
                      /*Caso de Restaurante,TransporteTerrestre,Guia,Agencia*/
                      keyDuplicar == "codServicio" |
                      keyDuplicar == "caracte" | 
                      /*Caso de Guia solo*/
                      keyDuplicar == "carne" | 
                      /*Caso de TrasnporteFerroviario solo*/
                      keyDuplicar == "llegada" | 
                       /*Caso de TrasnporteFerroviario solo*/
                      keyDuplicar == "salida" | 
                      /*Caso de Guia solo*/
                      keyDuplicar == "dni"
                    ) 
                    {
                      if (initialFormData[keyDuplicar]!=newData[keyDuplicar]) {

                        setDatosEditables([...datosEditables, newData]);
                        duplicados=true
                        setinitialFormData({})     

                      }else{

                        alert("Existen Datos Duplicados: "+ newData[keyDuplicar])

                      }
                    }
                    if(duplicados){
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
                    }
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

                  let IdKey = ''
                  
                  switch (provDinamico) {
                    case "hotel":
                      IdKey = "IdProductoHoteles";
                      break;
                    case "restaurante":
                      IdKey = "IdProductoRestaurantes";
                      break;
                    case "transporteterrestre":
                      IdKey = "IdProductoTransportes";
                      break;
                    case "transporteferroviario":
                      IdKey = "IdProductoTransFerroviario";
                      break;
                    case "sitioturistico":
                      IdKey = "IdProductoSitioTuristico";
                      break;
                    case "guia":
                      IdKey = "IdProductoGuias";
                      break;
                    case "agencia":
                      IdKey = "IdProductoAgencias";
                      break;
                    default:
                      IdKey = "IdProductoOtros";
                      break;
                  }
                  fetch(`http://localhost:3000/api/proveedores/${provDinamico}`,{
                    method:"POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({
                      idProducto: dataUpdate[index][IdKey],
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

                  let IdKey = ''
                  switch (provDinamico) {
                    case "hotel":
                      IdKey = "IdProductoHoteles";
                      break;
                    case "restaurante":
                      IdKey = "IdProductoRestaurantes";
                      break;
                    case "transporteterrestre":
                      IdKey = "IdProductoTransportes";
                      break;
                    case "transporteferroviario":
                      IdKey = "IdProductoTransFerroviario";
                      break;
                    case "sitioturistico":
                      IdKey = "IdProductoSitioTuristico";
                      break;
                    case "guia":
                      IdKey = "IdProductoGuias";
                      break;
                    case "agencia":
                      IdKey = "IdProductoAgencias";
                      break;
                    default:
                      IdKey = "IdProductoOtros";
                      break;
                  }
                  fetch(`http://localhost:3000/api/proveedores/${provDinamico}`,{
                    method:"POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({
                      idProducto: dataDelete[index][IdKey],
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
      collectionName = "ProductoTransportes";
      break;
    case "transporteferroviario":
      collectionName = "ProductoTransFerroviario";
      break;
    case "sitioturistico":
      collectionName = "ProductoSitioTuristico";
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
