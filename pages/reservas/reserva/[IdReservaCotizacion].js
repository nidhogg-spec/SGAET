import React, { useState, useEffect } from "react";

//Componentes
import AutoFormulario from "@/components/AutoFormulario/AutoFormulario";

const ReservaCotizacion = (
  props = {
    DataReservas,
    URI_IdReservaCotizacion,
    DataServicios
  }
) => {
  // --------------------------------------------------------------------------------------
  // Aqui va todo lo necesario para trabajar con el autoFormulario
  const [DarDato, setDarDato] = useState(false);
  let DataNuevaEdit = {};
  const DarDatoFunction = (keyDato, Dato) => {
    DataNuevaEdit[keyDato] = Dato;
  };
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
  console.log(props.DataServicios);
  //Estados
  const [DataReservaCotizacin, setDataReservaCotizacin] = useState(
    props.DataReservas
  );

  //efectos
  useEffect(() => {
    setDataReservaCotizacin(props.DataReservas);
  }, [props.DataReservas]);

  return (
    <>
      <span>Datos de Reserva</span>
      <img
        src="/resources/save-black-18dp.svg"
        onClick={() => {
          DataNuevaEdit = {};
          setDarDato(true);
        }}
      />
      <div>
        <div>
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
                      Dato: DataReservaCotizacin.CodGrupo || "",
                    },
                    {
                      tipo: "texto",
                      Title: "Nombre de Grupo",
                      KeyDato: "NombreGrupo",
                      Dato: DataReservaCotizacin.NombreGrupo || "",
                    },
                    {
                      tipo: "numero",
                      Title: "Numero de pasajeros",
                      KeyDato: "Npasajeros",
                      Dato: DataReservaCotizacin.Npasajeros || "",
                    },
                    {
                      tipo: "fecha",
                      Title: "Fecha IN",
                      KeyDato: "FechaIN",
                      Dato: DataReservaCotizacin.FechaIN || "",
                    },
                    {
                      tipo: "fecha",
                      Title: "Fecha OUT",
                      KeyDato: "FechaOUT",
                      Dato: DataReservaCotizacin.FechaOUT || "",
                    },
                    {
                      tipo: "texto",
                      Title: "Voucher",
                      KeyDato: "NroVoucher",
                      Dato: DataReservaCotizacin.NroVoucher || "",
                    },
                    {
                      tipo: "texto",
                      Title: "Idioma",
                      KeyDato: "Idioma",
                      Dato: DataReservaCotizacin.Idioma || "",
                    },
                    {
                      tipo: "fecha",
                      Title: "Fecha de entrega voucher",
                      KeyDato: "FechaEntrega",
                      Dato: DataReservaCotizacin.FechaEntrega || "",
                    },
                    {
                      tipo: "money",
                      Title: "Precio",
                      KeyDato: "precio",
                      Dato: DataReservaCotizacin.precio || "",
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
        <div></div>
      </div>
      <div>
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
                    Dato: DataReservaCotizacin.Descripcion || "",
                  },
                  {
                    tipo: "TablaServicioEscogido",
                    Title: "Servicios",
                    KeyDato: "Itinerario",
                    Dato: props.DataServicios || [],
                    columnas: [
                        { field: "IdServicioEscogido", title: "Id" },
                        { field: "NombreServicio", title: "Nombre del Servicio" },
                        { field: "NombreProveedor", title: "Proveedor" },
                        { field: "Estado", title: "Estado" ,
                        lookup: { 0:'Cotizacion', 1:'Rerserva sin confirmar',2:'Reserva confirmada',3:'Reserva pagada' },
                      },
                    ],
                  },
                  {
                    tipo: "tablaSimple",
                    Title: "Itinierario",
                    KeyDato: "Itinerario",
                    Dato: DataReservaCotizacin.Itinerario || "",
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
                    Dato: DataReservaCotizacin.Incluye || "",
                    columnas: [{ field: "Actividad", title: "Actividad" }],
                  },
                  {
                    tipo: "tablaSimple",
                    Title: "No Incluye",
                    KeyDato: "NoIncluye",
                    Dato: DataReservaCotizacin.NoIncluye || "",
                    columnas: [{ field: "Actividad", title: "Actividad" }],
                  },
                  {
                    tipo: "tablaSimple",
                    Title: "Recomendaciones para llevar",
                    KeyDato: "RecomendacionesLlevar",
                    Dato: DataReservaCotizacin.RecomendacionesLlevar || "",
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
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  let DataReservas = {};
  let DataServicios=[]
  const URI_IdReservaCotizacion = context.query.IdReservaCotizacion;
  const APIpathGeneral = process.env.API_DOMAIN + "/api/general";
  await fetch(APIpathGeneral, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      coleccion: "ReservaCotizacion",
      accion: "FindOne",
      projection: {},
      dataFound: URI_IdReservaCotizacion,
      keyId: "IdReservaCotizacion",
    }),
  })
    .then((r) => r.json())
    .then((data) => {
      DataReservas = data.result;
    });
  await fetch(APIpathGeneral, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      coleccion: "ServicioEscogido",
      accion: "FindSome",
      projection: {
        _id:0,
        IdServicioEscogido:1,
        NombreServicio:1,
        NombreProveedor:1,
        Estado:1,
        OrdenServicio:1
      },
      dataFound: [DataReservas.IdReservaCotizacion],
      keyId: "IdReservaCotizacion",
    }),
  })
    .then((r) => r.json())
    .then((data) => {
        DataServicios = data.result;
    });
  return {
    props: {
      DataReservas: DataReservas,
      URI_IdReservaCotizacion: URI_IdReservaCotizacion,
      DataServicios:DataServicios
    },
  };
}

export default ReservaCotizacion;
