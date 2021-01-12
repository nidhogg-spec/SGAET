import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

//Componentes
import AutoFormulario from "@/components/AutoFormulario/AutoFormulario";
import Loader from "@/components/Loading/Loading";
import ServicioEscogido from "../servicio/[IdServicioEscogido]";

const ReservaCotizacion = ({ APIPatch }) => {
  const router = useRouter();
  const { IdReservaCotizacion } = router.query;
  // --------------------------------------------------------------------------------------
  // Aqui va todo lo necesario para trabajar con el autoFormulario
  const [DarDato, setDarDato] = useState(false);
  const [ReservaCotizacion, setReservaCotizacion] = useState({});
  const [AllServicioEscojido, setAllServicioEscojido] = useState([]);
  const [ClienteCotizacion, setClienteCotizacion] = useState({});
  const [Estado, setEstado] = useState(0);
  const [Loading, setLoading] = useState(false);
  let DataNuevaEdit = {};
  const DarDatoFunction = (keyDato, Dato) => {
    DataNuevaEdit[keyDato] = Dato;
  };
  useEffect(async () => {
    setLoading(true);
    await Promise.all([
      new Promise(async (resolve, reject) => {
        await fetch(
          APIPatch + "/api/reserva/DataReserva/" + IdReservaCotizacion
        )
          .then((r) => r.json())
          .then((data) => {
            setReservaCotizacion(data.ReservaCotizacion);
            setClienteCotizacion(data.ClienteProspecto);
            if (data.ReservaCotizacion["Estado"]) {
              setEstado(data.ReservaCotizacion["Estado"]);
            } else {
              setEstado(0);
            }
            resolve();
          });
      }),
      new Promise(async (resolve, reject) => {
        await fetch(
          APIPatch + "/api/reserva/DataServicio/" + IdReservaCotizacion
        )
          .then((r) => r.json())
          .then((data) => {
            setAllServicioEscojido(data.AllServicioEscojido);
            resolve();
          });
      }),
    ]);
    setLoading(false);
  }, []);
  useEffect(() => {
    if (DarDato == true) {
      console.log("estas en modo creacion");
      setDarDato(false);
      console.log(DataNuevaEdit);
      //   console.log(DataNuevaEdit);
      //   fetch(APIpath_i, {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       accion: "Create",
      //       data: DataNuevaEdit,
      //     }),
      //   })
      //     .then((r) => r.json())
      //     .then((data) => {
      //       alert(data.message);
      //     });
    }
  }, [DarDato]);
  // --------------------------------------------------------------------------------------

  //Estados

  return (
    <>
      <Loader Loading={Loading} />
      <h3>Datos de Reserva</h3>
      <img
        src="/resources/save-black-18dp.svg"
        onClick={() => {
          DataNuevaEdit = {};
          setDarDato(true);
        }}
      />
      <select value={Estado}>
        <option value={0}>Cotizacion</option>
        <option value={1}>Reserva sin confirmar</option>
        <option value={2}>Reserva confirmada</option>
        <option value={3}>Reserva pagada</option>
      </select>
      <div>
        <div>
          <h3>Datos de Reserva/Cotizacion</h3>
          <AutoFormulario
            Formulario={{
              title: "",
              secciones: [
                {
                  subTitle: "",
                  componentes: [
                    {
                      tipo: "texto",
                      Title: "Codigo de Grupo",
                      KeyDato: "CodGrupo",
                      Dato: ReservaCotizacion.CodGrupo || "",
                    },
                    {
                      tipo: "texto",
                      Title: "Nombre de Grupo",
                      KeyDato: "NombreGrupo",
                      Dato: ReservaCotizacion.NombreGrupo || "",
                    },
                    {
                      tipo: "numero",
                      Title: "Numero de pasajeros",
                      KeyDato: "Npasajeros",
                      Dato: ReservaCotizacion.Npasajeros || "",
                    },
                    {
                      tipo: "fecha",
                      Title: "Fecha IN",
                      KeyDato: "FechaIN",
                      Dato: ReservaCotizacion.FechaIN || "",
                    },
                    {
                      tipo: "fecha",
                      Title: "Fecha OUT",
                      KeyDato: "FechaOUT",
                      Dato: ReservaCotizacion.FechaOUT || "",
                    },
                    {
                      tipo: "texto",
                      Title: "Voucher",
                      KeyDato: "NroVoucher",
                      Dato: ReservaCotizacion.NroVoucher || "",
                    },
                    {
                      tipo: "texto",
                      Title: "Idioma",
                      KeyDato: "Idioma",
                      Dato: ReservaCotizacion.Idioma || "",
                    },
                    {
                      tipo: "fecha",
                      Title: "Fecha de entrega voucher",
                      KeyDato: "FechaEntrega",
                      Dato: ReservaCotizacion.FechaEntrega || "",
                    },
                    {
                      tipo: "money",
                      Title: "Precio",
                      KeyDato: "precio",
                      Dato: ReservaCotizacion.precio || "",
                    },
                  ],
                },
              ],
            }}
            Modo={"verEdicion"}
            DarDato={DarDato}
            DarDatoFunction={DarDatoFunction}
          />
        </div>
        <div>
          <h3>Datos del Cotizante</h3>
          <div>
            <span>Nombre completo</span>
            <input
              value={ClienteCotizacion["NombreCompleto"] || null}
              onChange={(event) => {
                let temp_cliente = ClienteCotizacion;
                temp_cliente["NombreCompleto"] = event.target.value;
                setClienteCotizacion(temp_cliente);
              }}
            />
          </div>
          <div>
            <span>Tipo de documento</span>
            <input
              value={ClienteCotizacion["TipoDocumento"] || null}
              onChange={(event) => {
                let temp_cliente = ClienteCotizacion;
                temp_cliente["TipoDocumento"] = event.target.value;
                setClienteCotizacion(temp_cliente);
              }}
            />
          </div>
          <div>
            <span>Numero de documento</span>
            <input
              value={ClienteCotizacion["NroDocumento"] || null}
              onChange={(event) => {
                let temp_cliente = ClienteCotizacion;
                temp_cliente["NroDocumento"] = event.target.value;
                setClienteCotizacion(temp_cliente);
              }}
            />
          </div>
          <div>
            <span>Celular</span>
            <input
              value={ClienteCotizacion["Celular"] || null}
              onChange={(event) => {
                let temp_cliente = ClienteCotizacion;
                temp_cliente["Celular"] = event.target.value;
                setClienteCotizacion(temp_cliente);
              }}
            />
          </div>
          <div>
            <span>Email</span>
            <input
              value={ClienteCotizacion["Email"] || null}
              onChange={(event) => {
                let temp_cliente = ClienteCotizacion;
                temp_cliente["Email"] = event.target.value;
                setClienteCotizacion(temp_cliente);
              }}
            />
          </div>
        </div>
      </div>
      {/* <div>
        <AutoFormulario
          Formulario={{
            title: "",
            secciones: [
              {
                subTitle: "",
                componentes: [
                  {
                    tipo: "granTexto",
                    Title: "Descripcion del Programa turistico",
                    KeyDato: "Descripcion",
                    Dato: ReservaCotizacion.Descripcion || "",
                  },
                  // {
                  //   tipo: "TablaServicioEscogido",
                  //   Title: "Servicios",
                  //   KeyDato: "Itinerario",
                  //   Dato: AllServicioEscojido || [],
                  //   columnas: [
                  //       { field: "IdServicioEscogido", title: "Id" },
                  //       { field: "NombreServicio", title: "Nombre del Servicio" },
                  //       { field: "NombreProveedor", title: "Proveedor" },
                  //       { field: "Estado", title: "Estado" ,
                  //       lookup: { 0:'Cotizacion', 1:'Rerserva sin confirmar',2:'Reserva confirmada',3:'Reserva pagada' },
                  //     },
                  //   ],
                  // },
                  {
                    tipo: "tablaSimple",
                    Title: "Itinierario",
                    KeyDato: "Itinerario",
                    Dato: ReservaCotizacion.Itinerario || "",
                    columnas: [
                      { field: "Hora Inicio", title: "HoraInicio" },
                      { field: "Hora Fin", title: "HoraFin" },
                      { field: "Actividad", title: "Actividad"},
                    ],
                  },
                  {
                    tipo: "tablaSimple",
                    Title: "Incluye",
                    KeyDato: "Incluye",
                    Dato: ReservaCotizacion.Incluye || "",
                    columnas: [{ field: "Actividad", title: "Actividad" }],
                  },
                  {
                    tipo: "tablaSimple",
                    Title: "No Incluye",
                    KeyDato: "NoIncluye",
                    Dato: ReservaCotizacion.NoIncluye || "",
                    columnas: [{ field: "Actividad", title: "Actividad" }],
                  },
                  {
                    tipo: "tablaSimple",
                    Title: "Recomendaciones para llevar",
                    KeyDato: "RecomendacionesLlevar",
                    Dato: ReservaCotizacion.RecomendacionesLlevar || "",
                    columnas: [
                      { field: "Recomendacion", title: "Recomendacion" },
                    ],
                  },
                ],
              },
            ],
          }}
          Modo={"verEdicion"}
          DarDato={DarDato}
          DarDatoFunction={DarDatoFunction}
        />
      </div> */}
    </>
  );
};

export async function getServerSideProps(context) {
  let APIPatch = process.env.API_DOMAIN;

  return {
    props: {
      APIPatch: APIPatch,
    },
  };
}

export default ReservaCotizacion;
