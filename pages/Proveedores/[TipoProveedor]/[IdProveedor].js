import { useRouter } from "next/router";
import styles from "@/globalStyles/Proveedor.module.css";
import TablaProveedores from "../../../components/ContactoProveedor/ContactoProveedor";
import MaterialTable from "material-table";
import React, { useEffect, useState, useCallback } from "react";
import { MongoClient } from "mongodb";
import axios from "axios";

//componentes
import AutoFormulario from "@/components/Formulario_V2/AutoFormulario/AutoFormulario";
import { resetServerContext } from "react-beautiful-dnd";
resetServerContext();

export default function TipoProveedor(
  props = { ServicioProducto, Proveedor, APIpath }
) {
  //Variables
  const [Edicion, setEdicion] = useState(false);
  const [DevolverDato, setDevolverDato] = useState(false);
  const [datosEditables, setDatosEditables] = useState(props.ServicioProducto);
  const [Proveedor, setProveedor] = useState(props.Proveedor);
  const [ProveedorContacto, setProveedorContacto] = useState(
    Proveedor.Contacto
  );
  const [ProveedorBanco, setProveedorBanco] = useState(
    Proveedor.DatosBancarios
  );
  let UltimoIngresado = {};
  const [ServicioProducto, setServicioProducto] = useState(
    props.ServicioProducto
  );
  const router = useRouter();

  const { IdProveedor, TipoProveedor } = router.query;
  const provDinamico = TipoProveedor.toLowerCase();

  /* Para la funcion de duplicar un columna */
  const materialTableRef = React.createRef();
  const [initialFormData, setinitialFormData] = useState({});

  let Columnas = [];
  let DataEdit = {};

  switch (provDinamico) {
    case "hotel":
      Columnas = [
        // { title: "ID Producto Hotel", field: "IdProductoHotel" },
        {
          title: "Tipo de Pasajero",
          field: "TipoPaxs",
          lookup: {
            Nacional: "Nacional",
            Extranjero: "Extranjero",
            Unico: "Unico"
          }
        },
        {
          title: "Tipo de Habitacion",
          field: "tipoHabitacion",
          lookup: {
            Simple: "Simple",
            Doble: "Doble",
            Mwfamiliar: "Mw familiar",
            Triple: "Triple",
            Familiar: "Familiar",
            Suit: "Suit",
            Semisuit: "Semisuit"
          }
        },
        {
          title: "Descripcion de Habitacion",
          field: "descripcionHabitacion",
          emptyValue: "Prueba"
        },
        {
          title: "Cama Adicional",
          field: "camAdic",
          type: "boolean",
          initialEditValue: false
        },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Precio Cotizacion", field: "precioCoti", type: "numeric" }
      ];
      break;
    case "restaurante":
      Columnas = [
        {
          title: "Tipo Pasajero",
          field: "TipoPaxs",
          lookup: {
            Nacional: "Nacional",
            Extranjero: "Extranjero",
            Unico: "Unico"
          }
        },
        { title: "Servicio", field: "servicio" },
        { title: "Codigo", field: "codServicio" },
        { title: "Caracteristicas", field: "caracte" },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Precio Cotizacion", field: "precioCoti", type: "numeric" }
      ];
      break;
    case "transporteterrestre":
      Columnas = [
        {
          title: "Tipo Pasajero",
          field: "TipoPaxs",
          lookup: {
            Nacional: "Nacional",
            Extranjero: "Extranjero",
            Unico: "Unico"
          }
        },
        { title: "Codigo", field: "codServicio" },
        { title: "Servicio", field: "servicio" },
        { title: "Horario", field: "horario" },
        { title: "Tipo de Vehiculo", field: "tipvehiculo" },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Precio Cotizacion", field: "precioCoti", type: "numeric" }
      ];
      break;
    case "guia":
      Columnas = [
        {
          title: "Tipo Pasajero",
          field: "TipoPaxs",
          lookup: {
            Nacional: "Nacional",
            Extranjero: "Extranjero",
            Unico: "Unico"
          }
        },
        { title: "Codigo", field: "codServicio" },
        { title: "Direccion", field: "direccion" },
        { title: "DNI", field: "dni" },
        { title: "Idiomas", field: "idiomas" },
        { title: "Gremio", field: "gremio" },
        { title: "N° Carne", field: "carne" },
        { title: "Fecha Expedicion", field: "fecExpedi", type: "date" },
        { title: "Fecha Caducidad", field: "fecCaduc", type: "date" },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Precio Cotizacion", field: "precioCoti", type: "numeric" }
      ];
      break;
    case "agencia":
      Columnas = [
        {
          title: "Tipo Pasajero",
          field: "TipoPaxs",
          lookup: {
            Nacional: "Nacional",
            Extranjero: "Extranjero",
            Unico: "Unico"
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
      ];
      break;
    case "transporteferroviario":
      Columnas = [
        {
          title: "Tipo Pasajero",
          field: "TipoPaxs",
          lookup: {
            Nacional: "Nacional",
            Extranjero: "Extranjero",
            Unico: "Unico"
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
          field: "EtapaPaxs",
          lookup: {
            Adulto: "Adulto",
            Niño: "Niño",
            Guia: "Guia"
          }
        },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Precio Cotizacion", field: "precioCoti", type: "numeric" }
        // { title: "Precio Guia Confi", field: "precioGuiaConfi" , type: "numeric" },
        // { title: "Precio Adulto Publi", field: "precioAdultoPubli" , type: "numeric" },
        // { title: "Precio Niño Publi", field: "precioNiñoPubli" , type: "numeric" },
        // { title: "Precio Guia Publi", field: "precioGuiaPubli" , type: "numeric" }
      ];
      break;
    case "sitioturistico":
      Columnas = [
        {
          title: "Nombre del Servicio",
          field: "NomServicio"
        },
        {
          title: "Categoria",
          field: "Categoria",
          lookup: {
            Adulto: "Adulto",
            Niño: "Niño",
            AdultoMayor: "Adulto Mayor"
          }
        },
        { title: "Horario de Atencion", field: "HoraAtencion" },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Precio Cotizacion", field: "precioCoti", type: "numeric" }
      ];
      break;
    case "otro":
      Columnas = [
        {
          title: "Tipo Pasajero",
          field: "TipoPaxs",
          lookup: {
            Nacional: "Nacional",
            Extranjero: "Extranjero",
            Unico: "Unico"
          }
        },
        { title: "Nombre del Servicio o Producto", field: "servicio" },
        { title: "codigo del Servicio o Producto", field: "codServicio" },
        { title: "Descripcion", field: "Descripcion" },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Precio Cotizacion", field: "precioCoti", type: "numeric" }
      ];
      break;
  }
  //Funciones
  const RegistrarDato = (keyDato, Dato) => {
    DataEdit[keyDato] = Dato;
  };
  useEffect(() => {
    if (DevolverDato == true) {
      setDevolverDato(false);
      Proveedor.Contacto = ProveedorContacto;
      Proveedor.DatosBancarios = ProveedorBanco;

      fetch(props.APIpath + "/api/proveedores/listaProveedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          IdProveedor: IdProveedor,
          accion: "update",
          data: Proveedor
        })
      })
        .then((r) => r.json())
        .then((data) => {
          alert(data.message);
        });
    }
  }, [DevolverDato]);

  // useEffect(() => {
  //   console.log("gsdg");
  //   console.log(Proveedor);
  //   console.log(Proveedor);
  // }, [Proveedor]);
  return (
    <div>
      <h1>{Proveedor.nombre}</h1>
      <button>
        <img
          src="/resources/save-black-18dp.svg"
          onClick={() => {
            setEdicion(false);
            setDevolverDato(true);
          }}
        />
      </button>
      <button>
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
      </button>
      <a href="#ProductoServicio_area">Productos/Servicios</a>
      <AutoFormulario
        Formulario={{
          title: "Datos de Proveedor",
          secciones: [
            {
              subTitle: "",
              componentes: [
                {
                  tipo: "selector",
                  Title: "Tipo de Proveedor",
                  KeyDato: "tipo",
                  SelectOptions: [
                    { value: "Hotel", texto: "Hotel" },
                    { value: "Agencia", texto: "Agencia" },
                    { value: "Guia", texto: "Guia" },
                    {
                      value: "TransporteTerrestre",
                      texto: "Transporte Terrestre"
                    },
                    { value: "Restaurante", texto: "Restaurante" },
                    { value: "SitioTuristico", texto: "Sitio Turistico" },
                    {
                      value: "TransporteFerroviario",
                      texto: "Transporte Ferroviario"
                    },
                    { value: "Otro", texto: "Otro" }
                  ]
                },
                {
                  tipo: "texto",
                  Title: "Razon Social",
                  KeyDato: "RazonSocial"
                },
                {
                  tipo: "texto",
                  Title: "Nombre Comercial",
                  KeyDato: "nombre"
                },
                {
                  tipo: "selector",
                  Title: "Tipo de Documento",
                  KeyDato: "TipoDocumento",
                  SelectOptions: [
                    { value: "DNI", texto: "DNI" },
                    { value: "RUC", texto: "RUC" },
                    {
                      value: "CarnetExtranjeria",
                      texto: "Carnet de Extranjeria"
                    }
                  ]
                },
                {
                  tipo: "texto",
                  Title: "Numero de Documento",
                  KeyDato: "NroDocumento"
                },
                {
                  tipo: "texto",
                  Title: "Direccion fiscal",
                  KeyDato: "DireccionFiscal"
                },
                {
                  tipo: "selector",
                  Title: "Tipo de Moneda",
                  KeyDato: "TipoMoneda",
                  SelectOptions: [
                    { value: "Sol", texto: "Soles" },
                    { value: "Dolar", texto: "Dolares" }
                  ]
                },
                {
                  tipo: "texto",
                  Title: "Enlace al Documento",
                  KeyDato: "EnlaceDocumento"
                },
                {
                  tipo: "texto",
                  Title: "Numero de telefono o celular principal",
                  KeyDato: "NumeroPrincipal"
                },
                {
                  tipo: "texto",
                  Title: "Email principal",
                  KeyDato: "EmailPrincipal"
                },
                {
                  tipo: "selector",
                  Title: "Estado",
                  KeyDato: "Estado",
                  SelectOptions: [
                    { value: 0, texto: "Inactivo" },
                    { value: 1, texto: "Activo" }
                  ]
                }
              ]
            },
            {
              subTitle: "Representantante Legal",
              componentes: [
                {
                  tipo: "texto",
                  Title: "Nombre del Gerente General",
                  KeyDato: "NombreRepresentanteLegal"
                },
                {
                  tipo: "texto",
                  Title: "Numero del documento de identidad",
                  KeyDato: "NroDocIdentRepresentanteLegal"
                }
              ]
            }
            // {
            //   subTitle: "Representantante Legal",
            //   componentes: [
            //     {
            //       tipo: "selector",
            //       Title: "Numero de estrellas",
            //       KeyDato: "NEstrellas",
            //       SelectOptions: [
            //         { value: 0, texto: "0" },
            //     { value: 1, texto: "1" },
            //     { value: 2, texto: "2" },
            //     { value: 3, texto: "3" },
            //     { value: 4, texto: "4" },
            //     { value: 5, texto: "5" },
            //       ],
            //     },
            //     {
            //       tipo: "texto",
            //       Title: "Numero del documento de identidad",
            //       KeyDato: "NroDocIdentRepresentanteLegal",
            //     },
            //   ],
            // }
          ]
        }}
        Dato={Proveedor}
        setDato={setProveedor}
        ModoEdicion={Edicion}
        key={"AutoFormulario001"}
      />
      <div className={styles.divDatosPrincipal}>
        <div className={styles.Proveedor}>
          <h2>Otros Datos</h2>

          {provDinamico == "hotel" ? (
            <>
              <AutoFormulario
                Formulario={{
                  title: "Datos de Proveedor",
                  secciones: [
                    {
                      subTitle: "",
                      componentes: [
                        {
                          tipo: "selector",
                          Title: "Numero de estrellas",
                          KeyDato: "NEstrellas",
                          SelectOptions: [
                            { value: 0, texto: "0" },
                            { value: 1, texto: "1" },
                            { value: 2, texto: "2" },
                            { value: 3, texto: "3" },
                            { value: 4, texto: "4" },
                            { value: 5, texto: "5" }
                          ]
                        }
                      ]
                    }
                  ]
                }}
                Dato={Proveedor}
                setDato={setProveedor}
                ModoEdicion={Edicion}
                key={"AutoFormulario001"}
              />
            </>
          ) : provDinamico == "restaurante" ? (
            <>
              <AutoFormulario
                Formulario={{
                  title: "Datos de Proveedor",
                  secciones: [
                    {
                      subTitle: "",
                      componentes: [
                        {
                          tipo: "selector",
                          Title: "Numero de Tenedores",
                          KeyDato: "NTenedores",
                          SelectOptions: [
                            { value: 0, texto: "0" },
                            { value: 1, texto: "1" },
                            { value: 2, texto: "2" },
                            { value: 3, texto: "3" },
                            { value: 4, texto: "4" },
                            { value: 5, texto: "5" }
                          ]
                        }
                      ]
                    }
                  ]
                }}
                Dato={Proveedor}
                setDato={setProveedor}
                ModoEdicion={Edicion}
                key={"AutoFormulario001"}
              />
            </>
          ) : null}
          <MaterialTable
            title="Datos de Contacto"
            columns={[
              { field: "NombreContac", title: "Nombre del Contacto" },
              { field: "Area", title: "Area de trabajo" },
              { field: "Numero", title: "Telefono/Celular" },
              { field: "Email", title: "Email" }
            ]}
            data={ProveedorContacto}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    setProveedorContacto([...ProveedorContacto, newData]);

                    resolve();
                  }, 1000);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...ProveedorContacto];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setProveedorContacto([...dataUpdate]);

                    resolve();
                  }, 1000);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...ProveedorContacto];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setProveedorContacto([...dataDelete]);

                    resolve();
                  }, 1000);
                })
            }}
          />
          <MaterialTable
            title="Datos de Cuentas Bancarias"
            columns={[
              { field: "Banco", title: "Banco" },
              { field: "Beneficiario", title: "Beneficiario" },
              {
                field: "TipoCuenta",
                title: "Tipo de Cuenta Bancaria"
              },
              {
                field: "TipoDocumento",
                title: "Tipo de Documento",
                lookup: { RUC: "RUC", DNI: "DNI" }
              },
              { field: "NumDoc", title: "Numero de Documento" },
              { field: "Cuenta", title: "Numero de Cuenta" },
              { field: "CCI", title: "CCI" }
            ]}
            data={ProveedorBanco}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    setProveedorBanco([...ProveedorBanco, newData]);

                    resolve();
                  }, 1000);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...ProveedorBanco];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setProveedorBanco([...dataUpdate]);

                    resolve();
                  }, 1000);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...ProveedorBanco];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setProveedorBanco([...dataDelete]);

                    resolve();
                  }, 1000);
                })
            }}
          />
        </div>
      </div>
      <div id="ProductoServicio_area">
        <MaterialTable
          columns={Columnas}
          data={datosEditables}
          title={"Servicios de " + TipoProveedor}
          //------------ Funcion de duplicado ----------------------------------------------
          tableRef={materialTableRef}
          initialFormData={initialFormData}
          actions={[
            {
              icon: "library_add",
              tooltip: "Duplicate User",
              onClick: (event, rowData) => {
                const materialTable = materialTableRef.current;
                setinitialFormData({ ...rowData });
                materialTable.dataManager.changeRowEditing();
                materialTable.setState({
                  ...materialTable.dataManager.getRenderState(),
                  showAddRow: true
                });
              }
            }
          ]}
          //-------------------------------------------------------------------------

          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(async () => {
                  let SaveFlag = true;
                  Columnas.map((item) => {
                    if (
                      newData[item.field] == undefined ||
                      newData[item.field] == null
                    ) {
                      alert(item.title+' esta vacio')
                      reject();                      
                      SaveFlag = false;
                      return;
                    }
                  });
                  if (deepEqual(newData, UltimoIngresado)) {
                    console.log("Repetido");
                    resolve();
                    SaveFlag = false;
                    return;
                  }
                  if (SaveFlag == true) {
                    UltimoIngresado = { ...newData };
                    newData["IdProveedor"] = IdProveedor;
                    //-------- Comparacion ---------------
                    let temp_newData = { ...newData };
                    let temp_DataBase = { ...initialFormData };
                    delete temp_newData["precioPubli"];
                    delete temp_newData["precioConfi"];
                    delete temp_newData["precioCoti"];
                    delete temp_newData["tableData"];
                    delete temp_DataBase["precioPubli"];
                    delete temp_DataBase["precioConfi"];
                    delete temp_DataBase["precioCoti"];
                    delete temp_DataBase["tableData"];
                    if (!deepEqual(temp_newData, temp_DataBase)) {
                      await axios
                        .post(
                          `http://localhost:3000/api/proveedores/${provDinamico}`,
                          {
                            data: newData,
                            accion: "create"
                          }
                        )
                        .then(function (response) {
                          console.log(response);
                          // alert(response.message);
                          alert("Creacion realizada correctamente");
                        })
                        .catch(function (error) {
                          console.log(error);
                        });
                      setDatosEditables([...datosEditables, newData]);
                      setinitialFormData({});
                      resolve();
                    } else {
                      alert("Existen Datos Duplicados");
                      reject();
                    }
                  }
                }, 2000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(async () => {
                  const dataUpdate = [...datosEditables];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  setDatosEditables([...dataUpdate]);

                  delete dataUpdate[index]._id;

                  let IdKey = "";

                  switch (provDinamico) {
                    case "hotel":
                      IdKey = "IdProductoHotel";
                      break;
                    case "restaurante":
                      IdKey = "IdProductoRestaurante";
                      break;
                    case "transporteterrestre":
                      IdKey = "IdProductoTransporte";
                      break;
                    case "transporteferroviario":
                      IdKey = "IdProductoTransFerroviario";
                      break;
                    case "sitioturistico":
                      IdKey = "IdProductoSitioTuristico";
                      break;
                    case "guia":
                      IdKey = "IdProductoGuia";
                      break;
                    case "agencia":
                      IdKey = "IdProductoAgencia";
                      break;
                    default:
                      IdKey = "IdProductoOtro";
                      break;
                  }
                  await axios
                    .post(
                      `http://localhost:3000/api/proveedores/${provDinamico}`,
                      {
                        idProducto: dataUpdate[index][IdKey],
                        data: dataUpdate[index],
                        accion: "update"
                      }
                    )
                    .then(function (response) {
                      console.log(response);
                      // alert(response.message);
                      alert("Actualizacion realizada correctamente");
                    })
                    .catch(function (error) {
                      console.log(error);
                    });

                  resolve();
                }, 1000);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(async () => {
                  const dataDelete = [...datosEditables];
                  const index = oldData.tableData.id;

                  let IdKey = "";
                  switch (provDinamico) {
                    case "hotel":
                      IdKey = "IdProductoHotel";
                      break;
                    case "restaurante":
                      IdKey = "IdProductoRestaurante";
                      break;
                    case "transporteterrestre":
                      IdKey = "IdProductoTransporte";
                      break;
                    case "transporteferroviario":
                      IdKey = "IdProductoTransFerroviario";
                      break;
                    case "sitioturistico":
                      IdKey = "IdProductoSitioTuristico";
                      break;
                    case "guia":
                      IdKey = "IdProductoGuia";
                      break;
                    case "agencia":
                      IdKey = "IdProductoAgencia";
                      break;
                    default:
                      IdKey = "IdProductoOtro";
                      break;
                  }
                  console.log(dataDelete[index][IdKey]);
                  await axios
                    .post(
                      `http://localhost:3000/api/proveedores/${provDinamico}`,
                      {
                        idProducto: dataDelete[index][IdKey],
                        accion: "delete"
                      }
                    )
                    .then(function (response) {
                      console.log(response);
                      // alert(response.message);
                      alert("Eliminacion realizada correctamente");
                    })
                    .catch(function (error) {
                      console.log(error);
                    });

                  dataDelete.splice(index, 1);
                  setDatosEditables([...dataDelete]);

                  resolve();
                }, 1000);
              })
          }}
          options={{
            actionsColumnIndex: -1,
            showEmptyDataSourceMessage: true
          }}
        ></MaterialTable>
        {/* <TablaProveedores/> */}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const uruId = context.query.IdProveedor;
  const provDinamico = context.query.TipoProveedor.toLowerCase();

  /*---------------------------------------------------------------------------------*/
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await client.connect();
  let [Proveedor, ServicioProducto] = await Promise.all([
    new Promise(async (resolve, reject) => {
      try {
        let collection = client.db(dbName).collection("Proveedor");
        let result = await collection.findOne(
          { IdProveedor: uruId },
          { projection: { _id: 0 } }
        );
        // Proveedor = JSON.stringify(result);
        // result._id = JSON.stringify(result._id);
        // Proveedor = result;
        resolve(result);
      } catch (error) {
        console.log("Error cliente Mongo 1 => " + error);
      }
    }),
    new Promise(async (resolve, reject) => {
      let collectionName = "";
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
        let collection = client.db(dbName).collection(collectionName);
        let result = await collection
          .find({ IdProveedor: uruId })
          .project({
            _id: 0
          })
          .toArray();
        resolve(result);
      } catch (error) {
        console.log("Error cliente Mongo 1 => " + error);
      }
    })
  ]);
  client.close();

  // console.log(Proveedor.IdProveedor)
  // const APIpath = process.env.API_DOMAIN + "/api/proveedores/listaProveedores";
  return {
    props: {
      ServicioProducto: ServicioProducto,
      Proveedor: Proveedor,
      APIpath: process.env.API_DOMAIN
    }
  };
}

function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

function isObject(object) {
  return object != null && typeof object === "object";
}
