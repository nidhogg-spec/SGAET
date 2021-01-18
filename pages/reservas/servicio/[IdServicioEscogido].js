import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

//Componentes
// import AutoFormulario from "@/components/AutoFormulario/AutoFormulario";
import AutoFormulario_v2 from "@/components/Formulario_V2/AutoFormulario/AutoFormulario";
import Loader from "@/components/Loading/Loading";

const ServicioEscogido = ({
  URL_path,
  // URI_IdReservaCotizacion,
  // DataServicios,
  // DataProductosTodos,
  // ColumnasProductosTodos,
  // api_general
}) => {
  const router = useRouter();
  const { IdServicioEscogido } = router.query;
  const [ServicioEscogido, setServicioEscogido] = useState({});
  const [Proveedor, setProveedor] = useState();
  const [Loading, setLoading] = useState();

  useEffect(async () => {
    setLoading(true);
    await Promise.all([
      new Promise(async (resolve, reject) => {
        await fetch(
          URL_path +
            "/api/ServicioEscogido/DetalleServicioEscogido/" +
            IdServicioEscogido
        )
          .then((r) => r.json())
          .then((data) => {
            let ServicioEscogido = data.ServicioEscogido;
            if (ServicioEscogido["FechaReserva"].includes("/")) {
              let dateParts = ServicioEscogido["FechaReserva"].split("/");
              ServicioEscogido["FechaReserva"] =
                +dateParts[2] + "-" + dateParts[1] + "-" + +dateParts[0];
            }
            if (ServicioEscogido["Estado"] == undefined) {
              ServicioEscogido["Estado"] = 0;
            }
            setServicioEscogido(data.ServicioEscogido);
            setProveedor(data.Proveedor);
            resolve();
          });
      }),
    ]);
    setLoading(false);
  }, []);
  // --------------------------------------------------------------------------------------
  // Aqui va todo lo necesario para trabajar con el autoFormulario

  // const [DarDato, setDarDato] = useState(false);
  // let DataNuevaEdit = {};
  // const DarDatoFunction = (keyDato, Dato) => {
  //   DataNuevaEdit[keyDato] = Dato;
  // };
  // useEffect(() => {
  //   if (DarDato == true) {
  //     console.log("estas en modo creacion");
  //     setDarDato(false);
  //     console.log(DataNuevaEdit);
  //     //   console.log(DataNuevaEdit);
  //       // fetch(api_general, {
  //       //   method: "POST",
  //       //   headers: { "Content-Type": "application/json" },
  //       //   body: JSON.stringify({
  //       //     coleccion: "ServicioEscogido",
  //       //     accion: "update",
  //       //     query:{"IdServicioEscogido":URI_IdReservaCotizacion} ,
  //       //     data: DataNuevaEdit,
  //       //   }),
  //       // })
  //       //   .then((r) => r.json())
  //       //   .then((data) => {
  //       //     alert(data.message);
  //       //   });
  //   }
  // }, [DarDato]);
  // --------------------------------------------------------------------------------------
  // const [OrdenServicio, setOrdenServicio] = useState(false);
  // const OrdenServicio = useBoolOrdenServicio(
  //   DataServicioEscogido.OrdenServicio
  // );

  //Efectos
  return (
    <>
      <Loader Loading={Loading} key={"Loader_001"} />
      <div>
        <span>Servicio</span>
        <img
          src="/resources/save-black-18dp.svg"
          onClick={() => {
            DataNuevaEdit = {};
            setDarDato(true);
          }}
        />
        {/* {OrdenServicio && (
          <button
            onClick={() => {
              router.push(
                `/reservas/OrdenServicio/${DataServicioEscogido.OrdenServicio["TipoOrden"]}/${IdServicioEscogido}`
              );
            }}
          >
            Orden de servicio
          </button>
        )} */}
        <select
          value={ServicioEscogido["Estado"]}
          onChange={(event) => {
            setServicioEscogido({
              ...ServicioEscogido,
              Estado: parseInt(event.target.value),
            });
          }}
        >
          <option value={0}>Servicio/Producto no confirmado</option>
          <option value={1}>Servicio/Producto Confirmado</option>
          <option value={2}>Servicio/Producto Contratado</option>
          <option value={3}>Servicio/Producto Pagado</option>
          <option value={4}>Servicio/Producto Cancelado</option>
        </select>
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
                    KeyDato: "NombreServicio",
                  },
                  {
                    tipo: "texto",
                    Title: "Tipo de servicio",
                    KeyDato: "TipoServicio",
                  },
                  {
                    tipo: "numero",
                    Title: "Dia",
                    KeyDato: "Dia",
                  },
                  {
                    tipo: "numero",
                    Title: "Cantidad",
                    KeyDato: "Cantidad",
                  },
                  {
                    tipo: "boolean",
                    Title: "IGV",
                    KeyDato: "IGV",
                  },
                  {
                    tipo: "money",
                    Title: "Precio Confidencial Unitario",
                    KeyDato: "PrecioConfiUnitario",
                  },
                  {
                    tipo: "money",
                    Title: "Precio Cotizacion Unitario",
                    KeyDato: "PrecioCotiUnitario",
                  },
                  {
                    tipo: "money",
                    Title: "Precio Publico",
                    KeyDato: "PrecioPublicado",
                  },
                  {
                    tipo: "selector",
                    Title: "Encuesta",
                    KeyDato: "Encuesta",
                    SelectOptions: [
                      { value: 0, texto: "No es necesario una encuesta" },
                      { value: 1, texto: "Se necesita encuesta" },
                    ],
                  },
                  {
                    tipo: "selector",
                    Title: "Informe",
                    KeyDato: "Informe",
                    SelectOptions: [
                      { value: 0, texto: "No es necesario un informe" },
                      { value: 1, texto: "Se necesita informe" },
                    ],
                  },
                  {
                    tipo: "fecha",
                    Title: "Fecha de Reserva",
                    KeyDato: "FechaReserva",
                  },
                  {
                    tipo: "fecha",
                    Title: "Fecha de compra real",
                    KeyDato: "FechaCompra",
                  },
                  {
                    tipo: "fecha",
                    Title: "Fecha de limite de pago",
                    KeyDato: "FechaLimitePago",
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
                      { value: 1, texto: "Es necesario" },
                    ],
                  },
                ],
              },
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
            ],
          }}
          ModoEdicion={true}
          Dato={ServicioEscogido}
          setDato={setServicioEscogido}
          key={"AF_ServicioEscogido"}
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
                    KeyDato: "nombre",
                  },
                  {
                    tipo: "texto",
                    Title: "Razon Social",
                    KeyDato: "RazonSocial",
                  },
                  {
                    tipo: "texto",
                    Title: "Tipo de Documento",
                    KeyDato: "TipoDocumento",
                  },
                  {
                    tipo: "texto",
                    Title: "NroDocumento",
                    KeyDato: "NroDocumento",
                  },
                  {
                    tipo: "texto",
                    Title: "Numero Principal",
                    KeyDato: "NumeroPrincipal",
                  },
                  {
                    tipo: "texto",
                    Title: "Email Principal",
                    KeyDato: "EmailPrincipal",
                  },
                ],
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
                        lookup: { RUC: "RUC", DNI: "DNI" },
                      },
                      { field: "NumDoc", title: "Numero de Documento" },
                      { field: "Cuenta", title: "Numero de Cuenta" },
                      { field: "CCI", title: "CCI" },
                    ],
                  },
                  {
                    tipo: "tablaSimple",
                    Title: "Contacto",
                    KeyDato: "Contacto",
                    columnas: [
                      { field: "NombreContac", title: "Nombre del Contacto" },
                      { field: "Area", title: "Area de trabajo" },
                      { field: "Numero", title: "Telefono/Celular" },
                      { field: "Email", title: "Email" },
                    ],
                  },
                ],
              },
            ],
          }}
          ModoEdicion={false}
          Dato={Proveedor}
          setDato={setProveedor}
          key={"AF_ServicioEscogido"}
        />
      </div>
    </>
  );
};
export default ServicioEscogido;

export async function getServerSideProps(context) {
  //-------------------------------------------------------------------------------
  const api_general = process.env.API_DOMAIN + "/api/general";

  return {
    props: {
      URL_path: process.env.API_DOMAIN,
    },
  };
}

function useBoolOrdenServicio(OrdenServicio) {
  const [Existe, setExiste] = useState(false);

  useEffect(() => {
    if (OrdenServicio == null) {
      setExiste(false);
    } else {
      setExiste(true);
    }
  });

  return Existe;
}
