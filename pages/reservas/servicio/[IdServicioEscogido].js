import React, { useState, useEffect, useDebugValue, useRef } from "react";
import { useRouter } from "next/router";
import { MongoClient } from "mongodb";
import { resetServerContext } from "react-beautiful-dnd";
import styles from '@/globalStyles/DetalleServicioEscogido.module.css'

//Componentes
// import AutoFormulario from "@/components/AutoFormulario/AutoFormulario";
import AutoFormulario_v2 from "@/components/Formulario_V2/AutoFormulario/AutoFormulario";
import Loader from "@/components/Loading/Loading";
import axios from "axios";
import { Modal } from "@material-ui/core";
resetServerContext();
const ServicioEscogido = (
  props = {
    URL_path,
    OrdenServicio,
    ServicioEscogido,
    Proveedor
  }
) => {
  const router = useRouter();
  const { IdServicioEscogido } = router.query;
  const [ServicioEscogido, setServicioEscogido] = useState(
    props.ServicioEscogido
  );
  const [OrdenServicio, setOrdenServicio] = useState(props.OrdenServicio);
  const [Proveedor, setProveedor] = useState(props.Proveedor);
  const [Loading, setLoading] = useState(false);
  const refEstado = useRef(null);
  let Exits_OrdenServicio = useBoolOrdenServicio(OrdenServicio);
  const [ModalOpen, setModalOpen] = useState(false);
  const RefPago = useRef(null);
  useDebugValue(Exits_OrdenServicio ? "Si" : "No");

  const handleChangeEstado = async () => {
    setLoading(true);
    let Estado_val = parseInt(refEstado.current.value);
    let Estado = ServicioEscogido["Estado"] ? ServicioEscogido["Estado"] : 0;
    if (Estado_val > Estado) {
      if (confirm("Esta seguro de cambiar de estado?")) {
        setServicioEscogido({
          ...ServicioEscogido,
          Estado: parseInt(Estado_val)
        });
        if (Estado_val == 3) {
          setModalOpen(true)
        }else if(Estado_val == 4){
          if (ServicioEscogido["Estado"]==3) {
            await Promise.all([
              new Promise(async(resolve,reject)=>{
                await axios.put(
                  `${props.URL_path}/api/ServicioEscogido/CRUD/${IdServicioEscogido}`,
                  { ServicioEscogido: { Estado: Estado_val } }
                );
                resolve();
              }),
              new Promise(async(resolve,reject)=>{
                await axios.post(props.URL_path + "/api/finanzas/ingresos", {
                  accion: "create",
                  data: {
                    Total: ServicioEscogido["PrecioCotiUnitario"] * ServicioEscogido["Cantidad"],
                    TotalNeto: 0,
                    Comision: 0,
                    IdServicioEscogido:IdServicioEscogido,
                  }
                });
                resolve();
              }),
            ])
          }else{
            await axios.put(
              `${props.URL_path}/api/ServicioEscogido/CRUD/${IdServicioEscogido}`,
              { ServicioEscogido: { Estado: Estado_val } }
            );
          }          
        }
        else{
          await axios.put(
            `${props.URL_path}/api/ServicioEscogido/CRUD/${IdServicioEscogido}`,
            { ServicioEscogido: { Estado: Estado_val } }
          );
        }
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    await Promise.all([
      new Promise(async (resolve, reject) => {
        await fetch(`${props.URL_path}/api/ServicioEscogido/CRUD/${IdServicioEscogido}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ServicioEscogido: ServicioEscogido
          })
        });
        resolve();
      })
    ]);
    router.reload();
  };
  const handleOrdenSave = async () => {
    if (Object.entries(OrdenServicio).length != 0) {
      if (
        OrdenServicio["IdOrdenServicio"] != null &&
        OrdenServicio["IdOrdenServicio"] != undefined
      ) {
        await fetch(props.URL_path + "/api/OrdenServicio/CRUD", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            OrdenServicio: OrdenServicio,
            IdOrdenServicio: OrdenServicio["IdOrdenServicio"]
          })
        });
      } else {
        let temp_OrdenServicio = OrdenServicio;
        temp_OrdenServicio["IdServicioEscogido"] = IdServicioEscogido;
        await fetch(props.URL_path + "/api/OrdenServicio/CRUD", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            OrdenServicio: temp_OrdenServicio
          })
        });
      }
    }
  };

  const handlePagadoSubmit = async () => {
    const formData = new FormData(RefPago.current);
    const data = {
      Adelanto: parseFloat(parseFloat(formData.get("Adelanto")).toFixed(2)),
      MetodoPago: formData.get("MetodoPago")
    };
    let array_data = Object.values(data);
    if (
      array_data.includes("") ||
      array_data.includes(null) ||
      array_data.includes(undefined) ||
      array_data.includes(NaN)
    ) {
      alert("Faltan datos");
    } else {
      setModalOpen(false);
      setLoading(true);
      let Estado_val = parseInt(refEstado.current.value);
      
      await Promise.all([
        new Promise(async (resolve, reject) => {
          await axios.put(
            `${props.URL_path}/api/ServicioEscogido/CRUD/${IdServicioEscogido}`,
            { ServicioEscogido: { Estado: Estado_val } }
          );
          resolve();
        }),
        new Promise(async (resolve, reject) => {
          await axios.post(props.URL_path + "/api/finanzas/egresos", {
            accion: "create",
            data: {
              Total:
                ServicioEscogido["PrecioCotiUnitario"] *
                ServicioEscogido["Cantidad"],
              TotalNeto: 0,
              Comision: 0,
              IdServicioEscogido:IdServicioEscogido,
              ...data
            }
          });
          resolve();
        })
      ]);
      setLoading(false);      
    }
  };
  return (
    <>
      <Loader Loading={Loading} key={"Loader_001"} />
      <Modal open={ModalOpen} className={styles.modal}>
        <div className={styles.ModalMainContainer}>
          <form ref={RefPago}>
            <input
              type="number"
              min="0.00"
              step="0.10"
              placeholder="Adelanto"
              name="Adelanto"
            />
            <input placeholder="Metodo de Pago" name="MetodoPago" />
            <button type="button" onClick={handlePagadoSubmit}>
              Continuar
            </button>
          </form>
        </div>
      </Modal>
      <div>
        <h2>{ServicioEscogido["NombreServicio"]}</h2>
        <button onClick={handleSave}><img src="/resources/save-black-18dp.svg"/></button>
        
        <div>
          <select
            value={ServicioEscogido["Estado"]}
            ref={refEstado}
            onChange={handleChangeEstado}
          >
            <option value={0}>Servicio/Producto no confirmado</option>
            <option value={1}>Servicio/Producto Confirmado</option>
            <option value={2}>Servicio/Producto Contratado</option>
            <option value={3}>Servicio/Producto Pagado</option>
            <option value={4}>Servicio/Producto Cancelado</option>
          </select>
        </div>
        <div>
          <span>Tiene orden de servicio?</span>
          <input
            type="checkbox"
            checked={Exits_OrdenServicio}
            onChange={async (event) => {
              if (event.target.checked) {
                setOrdenServicio({
                  TipoOrden: "A",
                  Estado: 0
                });
              } else {
                let confirmar = confirm(
                  "Esta seguro que quiere elimnar la orden de servicio? (Esta accion sera permanente, y tendra q volver a generar la orden de servicio)"
                );
                if (confirmar) {
                  if (
                    OrdenServicio["IdOrdenServicio"] != null &&
                    OrdenServicio["IdOrdenServicio"] != undefined
                  ) {
                    await fetch(props.URL_path + "/api/OrdenServicio/CRUD", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: OrdenServicio["IdOrdenServicio"]
                      })
                    });
                  }

                  setOrdenServicio({});
                }
              }
            }}
          />
        </div>

        {Exits_OrdenServicio && (
          <>
            <button
              onClick={() => {
                if (
                  OrdenServicio.TipoOrden == "A" ||
                  OrdenServicio.TipoOrden == "B"
                ) {
                  router.push(
                    `/reservas/OrdenServicio/${OrdenServicio["TipoOrden"]}/${ServicioEscogido.IdReservaCotizacion}`
                  );
                } else {
                  router.push(
                    `/reservas/OrdenServicio/${OrdenServicio["TipoOrden"]}/${IdServicioEscogido}`
                  );
                }
              }}
            >
              Orden de servicio
            </button>
            <button onClick={handleOrdenSave}>
              <img src="/resources/save-black-18dp.svg" />
            </button>

            <div>
              <AutoFormulario_v2
                Formulario={{
                  title: "",
                  secciones: [
                    {
                      subTitle: "",
                      componentes: [
                        {
                          tipo: "texto",
                          Title: "Codigo de Orden de Servicio",
                          KeyDato: "CodigoOrdenServicio"
                        },
                        {
                          tipo: "selector",
                          Title: "Tipo de Orden de Servicio",
                          KeyDato: "TipoOrden",
                          SelectOptions: [
                            { value: "A", texto: "A - Tours" },
                            { value: "B", texto: "B - Trekking" },
                            { value: "C", texto: "C - Transporte" },
                            { value: "D", texto: "D - Restaurantes" }
                          ]
                        },
                        {
                          tipo: "selector",
                          Title: "Estado",
                          KeyDato: "Estado",
                          SelectOptions: [
                            { value: 0, texto: "En proceso" },
                            { value: 1, texto: "Terminado" },
                            { value: 2, texto: "Entregado" }
                          ]
                        }
                      ]
                    }
                  ]
                }}
                ModoEdicion={true}
                Dato={OrdenServicio}
                setDato={setOrdenServicio}
                key={"AF_OrdenServicio001"}
              />
            </div>
          </>
        )}
      </div>

      <div>
        <AutoFormulario_v2
          Formulario={{
            title: "",
            secciones: [
              {
                subTitle: "",
                componentes: [
                  {
                    tipo: "texto",
                    Title: "Nombre de Servicio",
                    KeyDato: "NombreServicio"
                  },
                  {
                    tipo: "texto",
                    Title: "Tipo de servicio",
                    KeyDato: "TipoServicio"
                  },
                  {
                    tipo: "numero",
                    Title: "Dia",
                    KeyDato: "Dia"
                  },
                  {
                    tipo: "numero",
                    Title: "Cantidad",
                    KeyDato: "Cantidad"
                  },
                  {
                    tipo: "boolean",
                    Title: "IGV",
                    KeyDato: "IGV"
                  },
                  {
                    tipo: "money",
                    Title: "Precio Confidencial Unitario",
                    KeyDato: "PrecioConfiUnitario"
                  },
                  {
                    tipo: "money",
                    Title: "Precio Cotizacion Unitario",
                    KeyDato: "PrecioCotiUnitario"
                  },
                  {
                    tipo: "money",
                    Title: "Precio Publico",
                    KeyDato: "PrecioPublicado"
                  },
                  {
                    tipo: "selector",
                    Title: "Encuesta",
                    KeyDato: "Encuesta",
                    SelectOptions: [
                      { value: 0, texto: "No es necesario una encuesta" },
                      { value: 1, texto: "Se necesita encuesta" }
                    ]
                  },
                  {
                    tipo: "selector",
                    Title: "Informe",
                    KeyDato: "Informe",
                    SelectOptions: [
                      { value: 0, texto: "No es necesario un informe" },
                      { value: 1, texto: "Se necesita informe" }
                    ]
                  },
                  {
                    tipo: "fecha",
                    Title: "Fecha de Reserva",
                    KeyDato: "FechaReserva"
                  },
                  {
                    tipo: "fecha",
                    Title: "Fecha de compra real",
                    KeyDato: "FechaCompra"
                  },
                  {
                    tipo: "fecha",
                    Title: "Fecha de limite de pago",
                    KeyDato: "FechaLimitePago"
                  },
                  // {
                  //   tipo: "texto",
                  //   Title: "Informe de impacto medio ambiental",
                  //   KeyDato: "",
                  //   Dato: DataServicioEscogido || "",
                  // }
                  {
                    tipo: "selector",
                    Title: "Informe de impacto medio ambiental",
                    KeyDato: "InformeAmbiental",
                    SelectOptions: [
                      { value: 0, texto: "No es necesario" },
                      { value: 1, texto: "Es necesario" }
                    ]
                  }
                ]
              }
              // {
              //   subTitle: "",
              //   componentes: [
              //     {
              //         tipo: "granTexto",
              //         Title: "Descripcion",
              //         KeyDato: "Descripcion",
              //         Dato: DataServicioEscogido.Descripcion || "",
              //       },
              //     {
              //       tipo: "tablaSimple",
              //       Title: "Incluye",
              //       KeyDato: "Incluye",
              //       columnas: [{ field: "Descripcion", title: "Actividad" }],
              //     },
              //   ],
              // },
            ]
          }}
          ModoEdicion={true}
          Dato={ServicioEscogido}
          setDato={setServicioEscogido}
          key={"AF_ServicioEscogido0001"}
        />
      </div>
      <div>
        <h2>Data de Proveedor</h2>
        <AutoFormulario_v2
          Formulario={{
            title: "",
            secciones: [
              {
                subTitle: "",
                componentes: [
                  {
                    tipo: "texto",
                    Title: "Nombre Comercial",
                    KeyDato: "nombre"
                  },
                  {
                    tipo: "texto",
                    Title: "Razon Social",
                    KeyDato: "RazonSocial"
                  },
                  {
                    tipo: "texto",
                    Title: "Tipo de Documento",
                    KeyDato: "TipoDocumento"
                  },
                  {
                    tipo: "texto",
                    Title: "NroDocumento",
                    KeyDato: "NroDocumento"
                  },
                  {
                    tipo: "texto",
                    Title: "Numero Principal",
                    KeyDato: "NumeroPrincipal"
                  },
                  {
                    tipo: "texto",
                    Title: "Email Principal",
                    KeyDato: "EmailPrincipal"
                  }
                ]
              },
              {
                subTitle: "",
                componentes: [
                  {
                    tipo: "tablaSimple",
                    Title: "Datos Bancarios",
                    KeyDato: "DatosBancarios",
                    columnas: [
                      { field: "Banco", title: "Banco" },
                      { field: "Beneficiario", title: "Beneficiario" },
                      { field: "TipoCuenta", title: "Tipo de Cuenta Bancaria" },
                      {
                        field: "TipoDocumento",
                        title: "Tipo de Documento",
                        lookup: { RUC: "RUC", DNI: "DNI" }
                      },
                      { field: "NumDoc", title: "Numero de Documento" },
                      { field: "Cuenta", title: "Numero de Cuenta" },
                      { field: "CCI", title: "CCI" }
                    ]
                  },
                  {
                    tipo: "tablaSimple",
                    Title: "Contacto",
                    KeyDato: "Contacto",
                    columnas: [
                      { field: "NombreContac", title: "Nombre del Contacto" },
                      { field: "Area", title: "Area de trabajo" },
                      { field: "Numero", title: "Telefono/Celular" },
                      { field: "Email", title: "Email" }
                    ]
                  }
                ]
              }
            ]
          }}
          ModoEdicion={false}
          Dato={Proveedor}
          setDato={setProveedor}
          key={"AF_Proveedor001"}
        />
      </div>
    </>
  );
};
export default ServicioEscogido;

export async function getServerSideProps(context) {
  //-------------------------------------------------------------------------------
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  const IdServicioEscogido = context.query.IdServicioEscogido;
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  let OrdenServicio;
  let ServicioEscogido;
  let Proveedor;
  await client.connect();
  try {
    let dbo = client.db(dbName);
    let collection = dbo.collection("ServicioEscogido");
    //---------------------------- Obtener data Servicio Escogido ---------------------
    ServicioEscogido = await collection.findOne(
      { IdServicioEscogido: IdServicioEscogido },
      { projection: { _id: 0 } }
    );
    let coleccion_producto = "";
    let Id_coleccion_producto = "";
    switch (ServicioEscogido["IdServicioProducto"].slice(0, 2)) {
      case "PA":
        coleccion_producto = "ProductoAgencias";
        Id_coleccion_producto = "IdProductoAgencia";
        break;
      case "PG":
        coleccion_producto = "ProductoGuias";
        Id_coleccion_producto = "IdProductoGuia";
        break;
      case "PH":
        coleccion_producto = "ProductoHoteles";
        Id_coleccion_producto = "IdProductoHotel";
        break;
      case "PO":
        coleccion_producto = "ProductoOtros";
        Id_coleccion_producto = "IdProductoOtro";
        break;
      case "PR":
        coleccion_producto = "ProductoRestaurantes";
        Id_coleccion_producto = "IdProductoRestaurante";
        break;
      case "PS":
        coleccion_producto = "ProductoSitioTuristico";
        Id_coleccion_producto = "IdProductoSitioTuristico";
        break;
      case "PF":
        coleccion_producto = "ProductoTransFerroviario";
        Id_coleccion_producto = "IdProductoTransFerroviario";
        break;
      case "PT":
        coleccion_producto = "ProductoTransportes";
        Id_coleccion_producto = "IdProductoTransporte";
        break;
      default:
        coleccion_producto = "Error";
        break;
    }
    //---------------------------- Obtener data Proveedor ---------------------
    let Producto;
    try {
      Producto = await dbo.collection(coleccion_producto).findOne(
        {
          [Id_coleccion_producto]: ServicioEscogido["IdServicioProducto"]
        },
        { projection: { _id: 0, IdProveedor: 1 } }
      );
      console.log("sgfsdf");
      console.log(Producto);
    } catch (error) {
      console.log("Error - 103");
      console.log("error  => " + error);
    }
    try {
      Proveedor = await dbo
        .collection("Proveedor")
        .findOne(
          { IdProveedor: Producto["IdProveedor"] },
          { projection: { _id: 0 } }
        );
    } catch (error) {
      console.log("Error - 104");
      console.log("error  => " + error);
    }
    try {
      OrdenServicio = await dbo
        .collection("OrdenServicio")
        .findOne(
          { IdServicioEscogido: IdServicioEscogido },
          { projection: { _id: 0 } }
        );
      console.log(OrdenServicio);
      if (OrdenServicio == null) {
        OrdenServicio = {};
      }
    } catch (error) {
      console.log("Error - 104");
      console.log("error  => " + error);
    }
  } catch (error) {
    console.log("Error - 102");
    console.log("error - Obtener cambios dolar => " + error);
    // res.redirect("/500");
    res.status(500).json({ error: "Algun error" });
  } finally {
    client.close();
  }
  return {
    props: {
      URL_path: process.env.API_DOMAIN,
      OrdenServicio: OrdenServicio,
      ServicioEscogido: ServicioEscogido,
      Proveedor: Proveedor
    }
  };
}

function useBoolOrdenServicio(OrdenServicio) {
  const [Existe, setExiste] = useState(false);

  useEffect(() => {
    if (Object.entries(OrdenServicio).length == 0) {
      setExiste(false);
    } else {
      setExiste(true);
    }
  });

  return Existe;
}
