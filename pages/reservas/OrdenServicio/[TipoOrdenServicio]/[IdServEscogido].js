import MaterialTable from "material-table";
import AutoFormulario_v2 from "@/components/Formulario_V2/AutoFormulario/AutoFormulario";
import { withSSRContext } from "aws-amplify";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MongoClient } from "mongodb";

export default function OrdenServicioTipoC({
  DatosServEscogido,
  DatosProveedor,
  DatosProducto,
  CodOrdenServ,
  DatosReservaCotizacion,
  DatosClienteProspecto,
  APIpath
}) {
  const router = useRouter();

  const APIRoute = process.env.API_DOMAIN;
  // console.log(DatosServEscogido)
  // console.log(DatosProveedor)
  // console.log(DatosProducto)
  // console.log(CodOrdenServ)
  // console.log(DatosReservaCotizacion)
  // console.log(DatosClienteProspecto)

  const { IdServEscogido, TipoOrdenServicio } = router.query;

  /* Datos Orden de Servicio A */
  const [datosTablaTransporteTour, setDatosTablaTransporteTour] = useState([]);

  const [datosFormularioTour, setDatosFormularioTour] = useState({});

  /* Datos Orden de Servicio B */
  const [datosFormularioGrupo, setDatosFormularioGrupo] = useState({});

  const [datosFormularioGrupoNombre, setDatosFormularioGrupoNombre] = useState(
    {}
  );

  const [datosFormularioExtra, setDatosFormularioExtra] = useState({});

  const [datosFormularioEquipoPax, setDatosFormularioEquipoPax] = useState({});

  const [datosFormularioEquipoStaff, setDatosFormularioEquipoStaff] = useState(
    {}
  );

  const [datosTablaPasajeros, setDatosTablaPasajeros] = useState([]);

  const [datosTablaBriefing, setDatosTablaBriefing] = useState(
    CodOrdenServ.DatosBriefing
  );

  const [datosTablaEquipoCamping, setDatosTablaEquipoCamping] = useState(
    CodOrdenServ.DatosEquipoCamping
  );

  const [datosTablaTrenes, setDatosTablaTrenes] = useState([]);

  const [datosTablaHoteles, setDatosTablaHoteles] = useState([]);

  const [datosTablaEntradas, setDatosTablaEntradas] = useState([]);

  const [datosTablaBuses, setDatosTablaBuses] = useState([]);

  /* Datos Orden de Servicio C */
  const [datosFormularioTransporte, setDatosFormularioTransporte] = useState(
    {}
  );

  const [datosTablaTransporte, setDatosTablaTransporte] = useState([]);

  const [datosTablaPasajero, setDatosTablaPasajero] = useState([]);

  /* Datos Orden de Servicio D*/
  const [datosFormularioRestaurante, setDatosFormularioRestaurante] = useState(
    {}
  );

  /* Datos Orden de Servicio E*/
  const [datosFormularioHoteles, setDatosFormularioHoteles] = useState({});

  const [modoEdicion, setModoEdicion] = useState(false);

  /*------------------ Datos de las Tablas en Ordenes de Servicio ---------------------------------------------*/

  /* Columnas Tabla Orden de Servicio A*/
  const ColumnasTourTranporte = [
    { title: "Nombre", field: "Nombre" },
    { title: "Apellido", field: "Apellido" },
    { title: "Hotel", field: "Hotel" },
    { title: "Ciudad", field: "Ciudad" },
    { title: "Tren Ida", field: "TrenIda" },
    { title: "Tren Retorno", field: "TrenRetor" },
    { title: "BUS OW - R/T", field: "Bus" },
    // { title: "ENTRADA MP-MH-MM", field: "Entradas"},
    { title: "ENTRADA", field: "Entradas" },
    { title: "ADT/EST", field: "EtapaVida" },
    { title: "Cena", field: "Cena" },
    { title: "Regimen Alimenticio", field: "RegAlimenticio" }
  ];

  /* Columnas Tabla Orden de Servicio B*/
  const ColumnasPasajeros = [
    { title: "Nombres", field: "Nombre" },
    { title: "Apellido", field: "Apellido" },
    { title: "Etapa Vida", field: "EtapaVida" },
    { title: "Alimentacion Extra", field: "AlimenExtra" },
    { title: "Regimen Alimenticio", field: "RegAlimenticio" }
  ];
  const ColumnasBriefing = [
    { title: "Fecha", field: "Fecha", type: "date" },
    { title: "Hora", field: "Hora" },
    { title: "Lugar", field: "Lugar" }
  ];
  const ColumnasEquipoCamping = [
    { title: "Carpa", field: "Carpa" },
    { title: "Sleeping", field: "Sleeping" },
    { title: "Matra", field: "Matra" },
    { title: "Duffel", field: "Duffel" },
    { title: "Baston", field: "Baston" }
  ];
  const ColumnasTrenes = [
    // { title: "ID", field: "IdTrenes", hidden: true},
    // { title: "Tipo", field: "Tipo"},
    // { title: "TrenIda", field: "TrenIda"},
    // { title: "TrenRetorno", field: "TrenRetorno"},
    { title: "Servicio", field: "NombreServicio" }
  ];
  const ColumnasHoteles = [
    { title: "Servicio", field: "NombreServicio" },
    { title: "Ciudad", field: "Ciudad" },
    { title: "Noche Extra", field: "NocheExtra", type: "boolean" }
  ];
  const ColumnasBuses = [{ title: "OW - R/T", field: "NombreServicio" }];
  const ColumnasEntrada = [{ title: "Entrada", field: "NombreServicio" }];

  /* Columnas Tabla Orden de Servicio C*/
  const ColumnasPasajero = [
    { title: "Nombres", field: "Nombre" },
    { title: "Apellido", field: "Apellido" },
    { title: "Ciudad", field: "Ciudad" },
    { title: "Hotel", field: "Hotel" },
    { title: "Observaciones", field: "Observaciones" }
  ];
  const ColumnasTransporte = [
    { title: "Fecha", field: "FechaIN", type: "date" },
    { title: "Servicio", field: "DescripcionServicio" },
    { title: "Hora Recojo", field: "HoraRecojo" },
    { title: "Tren", field: "Tren" },
    { title: "Origen", field: "Origen" },
    { title: "Destino", field: "Destino" },
    { title: "Observaciones", field: "Observaciones" }
  ];
  /*-----------UseEffect para setear formato de  Cada Orden de Servicio---------------------*/

  useEffect(() => {
    if (DatosReservaCotizacion.NpasajerosChild == null) {
      DatosReservaCotizacion.NpasajerosChild = 0;
    }
    switch (TipoOrdenServicio) {
      case "A":
        let numPaxOrdenA =
          parseInt(DatosReservaCotizacion.NpasajerosAdult) +
          parseInt(DatosReservaCotizacion.NpasajerosChild);

        let tempDatosFormularioTour = {
          CodigoOrdenServ: CodOrdenServ.CodigoOrdenServicio,
          CodGrupo: DatosReservaCotizacion.CodGrupo,
          Tour: DatosReservaCotizacion.Descripcion,
          Fecha: DatosReservaCotizacion.FechaIN,
          NumPax: numPaxOrdenA,
          NomGrupo: DatosReservaCotizacion.NombreGrupo
        };
        /*Seteo de Trasnportes en la tabla*/
        let TempDatosTablaPasajerosOrdenA =
          DatosReservaCotizacion.listaPasajeros;
        /*Condicional para manejar el dato adicional que viene de lista pasajeros,
        este dato se usa para que se pueda mostrar desde la base de datos los pasajeros registrados.
        hasta que se encuentre otro metodo esta condicional deberia mantenerse asi.*/
        if (!TempDatosTablaPasajerosOrdenA) {
          alert("Ingrese Pasajeros");
        }
        if (numPaxOrdenA != TempDatosTablaPasajerosOrdenA.lenght) {
          TempDatosTablaPasajerosOrdenA.pop();
        }
        let tempTrasnporte = "";
        let tempEntradas = "";
        let tempTren = "";

        DatosServEscogido.map((x) => {
          if (x.IdServicioProducto.slice(0, 2) == "PT") {
            tempTrasnporte = x.NombreServicio;
          } else if (x.IdServicioProducto.slice(0, 2) == "PF") {
            tempTren = x.NombreServicio;
          } else if (x.IdServicioProducto.slice(0, 2) == "PS") {
            tempEntradas = x.NombreServicio;
          }
        });

        let tempObject = {
          Hotel: DatosProveedor.nombre,
          Bus: tempTrasnporte,
          Entradas: tempEntradas
        };
        let tempTablaTrasnportePasajero = [];
        TempDatosTablaPasajerosOrdenA.map((x) => {
          tempTablaTrasnportePasajero.push(Object.assign({}, tempObject, x));
        });

        setDatosTablaTransporteTour(tempTablaTrasnportePasajero);
        setDatosFormularioTour(tempDatosFormularioTour);
        break;
      case "B":
        let numPaxOrdenB =
          parseInt(DatosReservaCotizacion.NpasajerosAdult) +
          parseInt(DatosReservaCotizacion.NpasajerosChild);
        let TempDatosFormularioGrupo = {
          CodGrupo: DatosReservaCotizacion.CodGrupo,
          Fecha: DatosReservaCotizacion.FechaIN,
          NumPax: numPaxOrdenB
        };
        let TempDatosFormularioNombreGrupo = {
          NomGrupo: DatosReservaCotizacion.NombreGrupo
        };
        /*Seteo de Tabla Pasajero*/
        let TempDatosTablaPasajerosOrdenB =
          DatosReservaCotizacion.listaPasajeros;
        /*Condicional para manejar el dato adicional que viene de lista pasajeros,
        este dato se usa para que se pueda mostrar desde la base de datos los pasajeros registrados.
        hasta que se encuentre otro metodo esta condicional deberia mantenerse asi.*/
        if (numPaxOrdenB != TempDatosTablaPasajerosOrdenB.length) {
          TempDatosTablaPasajerosOrdenB.pop();
        }

        /*Seteo de Tablas Trenes-Hoteles-Buses-SitioTuristico*/
        let tempArrayServEscogidoTrasnporte = [];
        let tempArrayServEscogidoHotel = [];
        let tempArrayServEscogidoEntradas = [];
        let tempArrayServEscogidoTren = [];

        DatosServEscogido.map((x) => {
          if (x.IdServicioProducto.slice(0, 2) == "PH") {
            tempArrayServEscogidoHotel.push({
              NombreServicio: x.NombreServicio
            });
          } else if (x.IdServicioProducto.slice(0, 2) == "PT") {
            tempArrayServEscogidoTrasnporte.push({
              NombreServicio: x.NombreServicio
            });
          } else if (x.IdServicioProducto.slice(0, 2) == "PF") {
            tempArrayServEscogidoTren.push({
              NombreServicio: x.NombreServicio
            });
          } else if (x.IdServicioProducto.slice(0, 2) == "PS") {
            tempArrayServEscogidoEntradas.push({
              NombreServicio: x.NombreServicio
            });
          }
        });

        setDatosFormularioGrupo(TempDatosFormularioGrupo);
        setDatosFormularioGrupoNombre(TempDatosFormularioNombreGrupo);
        setDatosTablaPasajeros(TempDatosTablaPasajerosOrdenB);

        setDatosTablaBuses(tempArrayServEscogidoTrasnporte);
        setDatosTablaHoteles(tempArrayServEscogidoHotel);
        setDatosTablaTrenes(tempArrayServEscogidoTren);
        setDatosTablaEntradas(tempArrayServEscogidoEntradas);

        break;
      case "C":
        //Orden de Servicio C - Transporte
        let numPax =
          parseInt(DatosReservaCotizacion.NpasajerosAdult) +
          parseInt(DatosReservaCotizacion.NpasajerosChild);
        /*Seteo de Formulario Orden de Servicio*/
        let DatosOrdenC = {
          Empresa: DatosProveedor.nombre,
          CodGrupo: DatosReservaCotizacion.CodGrupo,
          Tour: DatosReservaCotizacion.Descripcion,
          NumPax: numPax,
          TipoTranporte: DatosProducto.tipvehiculo,
          FechaIn: DatosReservaCotizacion.FechaIN,
          FechaOut: DatosReservaCotizacion.FechaOUT
        };
        /*Seteo de Tabla Pasajero*/
        let TempDatosTablaPasajeros = DatosReservaCotizacion.listaPasajeros;
        //Condicional para manejar el dato adicional que viene de lista pasajeros,
        //este dato se usa para que se pueda mostrar desde la base de datos los pasajeros registrados.
        //hasta que se encuentre otro metodo esta condicional deberia mantenerse asi.
        if (numPax != TempDatosTablaPasajeros.length) {
          TempDatosTablaPasajeros.pop();
        }
        /*Seteo de Tabla Transporte*/
        //OriDest Almacena el servicio del producto y lo divide solo funciona si el formato es
        //Origen - Destino no funciona si tiene mas cosas por delante o despues de
        let OriDest = DatosProducto.servicio.split("-");
        let tempObjetoTablaTrasnporte = {
          FechaIN: DatosReservaCotizacion.FechaIN,
          Origen: OriDest[0],
          Destino: OriDest[1]
        };

        setDatosFormularioTransporte(DatosOrdenC);
        setDatosTablaPasajero(TempDatosTablaPasajeros);
        setDatosTablaTransporte([tempObjetoTablaTrasnporte]);

        break;
      case "D":
        //Orden de Servicio D - Restaurantes
        let DatosOrdenD = {
          CodOrdenServ: CodOrdenServ.CodigoOrdenServicio,
          Empresa: DatosProveedor.nombre,
          Direccion: DatosProveedor.direccionRegistrada,
          Telefono: DatosProveedor.celular,
          NumPax:
            parseInt(DatosReservaCotizacion.NpasajerosAdult) +
            parseInt(DatosReservaCotizacion.NpasajerosChild),
          Pax: DatosClienteProspecto.NombreCompleto,
          NombreServicio: DatosReservaCotizacion.Descripcion,
          FechaReserva: DatosReservaCotizacion.FechaIN
        };
        setDatosFormularioRestaurante(DatosOrdenD);
        break;
    }
  }, []);

  return (
    <div>
      <button
        onClick={async (event) => {
          await fetch(APIpath + "/api/reserva/Voucher/GetOrdenServicio/OS00004")
            .then((response) => {
              return response.text();
            })
            .then((data) => {
              let link = document.createElement("a");
              link.download = "file.pdf";
              link.href = "data:application/octet-stream;base64," + data;
              link.click();
            });
        }}
      >
        Descargar Orden Servicio
      </button>
      <button>
        <img
          src="/resources/save-black-18dp.svg"
          onClick={() => {
            switch (TipoOrdenServicio) {
              case "A":
                let tempObject = {
                  DatosTour: datosTablaTransporteTour
                };
                let dataFetch = Object.assign(
                  {},
                  datosFormularioTour,
                  tempObject
                );
                fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                    OrdenServicio: dataFetch
                  })
                })
                  .then((r) => r.json())
                  .then((data) => {
                    alert(data.message);
                  });
                break;
              case "B":
                let TempArrayObject = {
                  DatosPasajeros: datosTablaPasajeros,
                  DatosBriefing: datosTablaBriefing,
                  DatosEquipoCamping: datosTablaEquipoCamping,
                  DatosTren: datosTablaTrenes,
                  DatosHotel: datosTablaHoteles,
                  DatosEntrada: datosTablaEntradas,
                  DatosBuses: datosTablaBuses
                };
                let DataFetch = Object.assign(
                  {},
                  datosFormularioGrupo,
                  datosFormularioGrupoNombre,
                  datosFormularioExtra,
                  datosFormularioEquipoPax,
                  datosFormularioEquipoStaff,
                  TempArrayObject
                );
                fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                    OrdenServicio: DataFetch
                  })
                })
                  .then((r) => r.json())
                  .then((data) => {
                    alert(data.message);
                  });
                break;
              case "C":
                let TempObjetFetch = {
                  DatosPasajeros: datosTablaPasajero,
                  DatosTransporte: datosTablaTransporte
                };
                let fetchData = Object.assign(
                  datosFormularioTransporte,
                  TempObjetFetch
                );
                fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                    OrdenServicio: fetchData
                  })
                })
                  .then((r) => r.json())
                  .then((data) => {
                    alert(data.message);
                  });
                break;
              case "D":
                fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                    OrdenServicio: datosFormularioRestaurante
                  })
                })
                  .then((r) => r.json())
                  .then((data) => {
                    alert(data.message);
                  });
                break;
            }
            setModoEdicion(false);
          }}
        />
      </button>
      <button>
        <img
          src="/resources/edit-black-18dp.svg"
          onClick={(event) => {
            if (modoEdicion == false) {
              event.target.src = "/resources/close-black-18dp.svg";
              setModoEdicion(true);
            } else {
              event.target.src = "/resources/edit-black-18dp.svg";
              setModoEdicion(false);
            }
          }}
        />
      </button>

      {TipoOrdenServicio == "A" && (
        <div>
          <AutoFormulario_v2
            Formulario={{
              title: "Orden de Servicio A Tours",
              secciones: [
                {
                  subTitle: "ORDEN DE SERVICIO A - TOURS",
                  componentes: [
                    {
                      tipo: "texto",
                      Title: "Codigo Orden de Servicio",
                      KeyDato: "CodigoOrdenServ"
                    },
                    {
                      tipo: "texto",
                      Title: "Codigo de Grupo",
                      KeyDato: "CodGrupo"
                    },
                    {
                      tipo: "texto",
                      Title: "Tour: ",
                      KeyDato: "Tour"
                    },
                    {
                      tipo: "texto",
                      Title: "Guia: ",
                      KeyDato: "Guia"
                    },
                    {
                      tipo: "texto",
                      Title: "Asistente: ",
                      KeyDato: "Asistente"
                    },
                    {
                      tipo: "fecha",
                      Title: "Fecha: ",
                      KeyDato: "Fecha"
                    },
                    {
                      tipo: "numero",
                      Title: "N° Pax: ",
                      KeyDato: "NumPax"
                    },
                    {
                      tipo: "numero",
                      Title: "N° Porters: ",
                      KeyDato: "NumPorte"
                    },
                    {
                      tipo: "texto",
                      Title: "Transporte : ",
                      KeyDato: "Trasnporte"
                    },
                    {
                      tipo: "texto",
                      Title: "Nombre de Grupo: ",
                      KeyDato: "NomGrupo"
                    },
                    {
                      tipo: "texto",
                      Title: "Anexo: ",
                      KeyDato: "Anexo"
                    },
                    {
                      tipo: "texto",
                      Title: "Ingreso: ",
                      KeyDato: "Ingreso"
                    },
                    {
                      tipo: "numero",
                      Title: "Nº Box Lunch :",
                      KeyDato: "BoxLunch"
                    },
                    {
                      tipo: "numero",
                      Title: "N° Botiquin : ",
                      KeyDato: "Nbotiquin"
                    },
                    {
                      tipo: "texto",
                      Title: "N° Primeros Auxilios : ",
                      KeyDato: "NprimerosAuxilios"
                    },
                    {
                      tipo: "numero",
                      Title: "Imprevistos(S/.) : ",
                      KeyDato: "ImprevistosSoles"
                    },
                    {
                      tipo: "numero",
                      Title: "Imprevistos(US $) : ",
                      KeyDato: "ImprevistosDolares"
                    }
                  ]
                }
              ]
            }}
            ModoEdicion={modoEdicion}
            Dato={datosFormularioTour}
            setDato={setDatosFormularioTour}
            key={"OA_Tours"}
          />
          <MaterialTable
            title="Datos Transporte"
            data={datosTablaTransporteTour}
            columns={ColumnasTourTranporte}
            editable={{
              // onRowAdd: newData =>
              //   new Promise((resolve, reject) => {
              //     setTimeout(() => {
              //       console.log(newData)
              //       // fetch(APIpath+`/api/OrdenServicio/CRUD`,{
              //       //   method:"PUT",
              //       //   headers:{"Content-Type": "application/json"},
              //       //   body: JSON.stringify({
              //       //     "IdOrdenServicio": CodOrdenServ.IdOrdenServicio,
              //       //     "OrdenServicio": {"DatosTour":newData}
              //       //   }),
              //       //   })
              //       //   .then(r=>r.json())
              //       //   .then(data=>{
              //       //   alert(data.message);
              //       // })

              //       setDatosTablaTransporteTour([...datosTablaTransporteTour, newData]);
              //       resolve();
              //     }, 1000)
              //   }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...datosTablaTransporteTour];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosTour: dataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });
                    setDatosTablaTransporteTour([...dataUpdate]);

                    resolve();
                  }, 1000);
                })
            }}
            options={{
              actionsColumnIndex: -1
            }}
          />
        </div>
      )}
      {TipoOrdenServicio == "B" && (
        <div>
          <AutoFormulario_v2
            Formulario={{
              title: "Orden de Servicios B Trekking",
              secciones: [
                {
                  subTitle: "ORDEN DE SERVICIO B - Trekking",
                  componentes: [
                    {
                      tipo: "texto",
                      Title: "Codigo de Grupo",
                      KeyDato: "CodGrupo"
                    },
                    {
                      tipo: "texto",
                      Title: "Trekking: ",
                      KeyDato: "trekking"
                    },
                    {
                      tipo: "fecha",
                      Title: "Fecha: ",
                      KeyDato: "Fecha"
                    },
                    {
                      tipo: "numero",
                      Title: "N° Paxs: ",
                      KeyDato: "NumPax"
                    },
                    {
                      tipo: "texto",
                      Title: "Guia: ",
                      KeyDato: "Guia"
                    },
                    {
                      tipo: "texto",
                      Title: "Asistente: ",
                      KeyDato: "Asistente"
                    },
                    {
                      tipo: "texto",
                      Title: "Cocinero : ",
                      KeyDato: "Cocinero"
                    },
                    {
                      tipo: "texto",
                      Title: "Transporte : ",
                      KeyDato: "Trasnporte"
                    }
                  ]
                }
              ]
            }}
            ModoEdicion={modoEdicion}
            Dato={datosFormularioGrupo}
            setDato={setDatosFormularioGrupo}
            key={"OB_Grupo"}
          />
          <AutoFormulario_v2
            Formulario={{
              title: "Orden de Servicios B Trekking",
              secciones: [
                {
                  subTitle: "",
                  componentes: [
                    {
                      tipo: "texto",
                      Title: "Grupo Nombre",
                      KeyDato: "NomGrupo"
                    },
                    {
                      tipo: "texto",
                      Title: "Anexo: ",
                      KeyDato: "Anexo"
                    },
                    {
                      tipo: "texto",
                      Title: "PTO. de Ingreso: ",
                      KeyDato: "PuntoIngreso"
                    },
                    {
                      tipo: "texto",
                      Title: "Oxigeno: ",
                      KeyDato: "Oxigeno"
                    },
                    {
                      tipo: "numero",
                      Title: "N° Botiquin: ",
                      KeyDato: "NumBotiquin"
                    },
                    {
                      tipo: "numero",
                      Title: "Imprevistos(S/.): ",
                      KeyDato: "ImprevistosSoles"
                    },
                    {
                      tipo: "numero",
                      Title: "Imprevistos(US $): ",
                      KeyDato: "ImprevistosDolares"
                    }
                  ]
                }
              ]
            }}
            ModoEdicion={modoEdicion}
            Dato={datosFormularioGrupoNombre}
            setDato={setDatosFormularioGrupoNombre}
            key={"OB_GrupoNombre"}
          />
          <AutoFormulario_v2
            Formulario={{
              title: "Orden de Servicios B Trekking",
              secciones: [
                {
                  subTitle: "",
                  componentes: [
                    {
                      tipo: "numero",
                      Title: "N° Porters:",
                      KeyDato: "NumPorters"
                    },
                    {
                      tipo: "numero",
                      Title: "N° Porters Extra:",
                      KeyDato: "NumPortersExtra"
                    },
                    {
                      tipo: "numero",
                      Title: "N° Arrieros:",
                      KeyDato: "NumaArrieros"
                    },
                    {
                      tipo: "numero",
                      Title: "N° Caballos Carga:",
                      KeyDato: "NumCaballoCarga"
                    },
                    {
                      tipo: "numero",
                      Title: "N° Caballos Silla: ",
                      KeyDato: "NumCaballoSilla"
                    },
                    {
                      tipo: "texto",
                      Title: "Campamento 1er Dia",
                      KeyDato: "CampoPrimerDia"
                    },
                    {
                      tipo: "texto",
                      Title: "Campamento 2do Dia",
                      KeyDato: "CampoSegunDia"
                    },
                    {
                      tipo: "texto",
                      Title: "Campamento 3er Dia",
                      KeyDato: "CampoTercerDia"
                    },
                    {
                      tipo: "texto",
                      Title: "Campamento 4to Dia",
                      KeyDato: "CampoCuartoDia"
                    }
                  ]
                }
              ]
            }}
            ModoEdicion={modoEdicion}
            Dato={datosFormularioExtra}
            setDato={setDatosFormularioExtra}
            key={"OB_Extras"}
          />
          <AutoFormulario_v2
            Formulario={{
              title: "Orden de Servicios B Trekking",
              secciones: [
                {
                  subTitle: "Equipo Paxs",
                  componentes: [
                    {
                      tipo: "numero",
                      Title: "Carpas Dobles:",
                      KeyDato: "NumCarpaDobles"
                    },
                    {
                      tipo: "numero",
                      Title: "Carpas Simples:",
                      KeyDato: "NumCarpaSimples"
                    },
                    {
                      tipo: "numero",
                      Title: "Carpas Triple:",
                      KeyDato: "NumCarpaTriple"
                    },
                    {
                      tipo: "numero",
                      Title: "Matras Simples:",
                      KeyDato: "NumMatrasSimples"
                    },
                    {
                      tipo: "numero",
                      Title: "Matras Infables:",
                      KeyDato: "NumMatrasInfables"
                    },
                    {
                      tipo: "numero",
                      Title: "Sleeping Sinteticos",
                      KeyDato: "NumSleepingSinteticos"
                    },
                    {
                      tipo: "numero",
                      Title: "Sleeping Plumas:",
                      KeyDato: "NumSleepingPlumas"
                    },
                    {
                      tipo: "numero",
                      Title: "Bastones:",
                      KeyDato: "NumBastones"
                    },
                    {
                      tipo: "numero",
                      Title: "Duffel:",
                      KeyDato: "NumDuffel"
                    }
                  ]
                }
              ]
            }}
            ModoEdicion={modoEdicion}
            Dato={datosFormularioEquipoPax}
            setDato={setDatosFormularioEquipoPax}
            key={"OB_Equipo_Pax"}
          />
          <AutoFormulario_v2
            Formulario={{
              title: "Orden de Servicios B Trekking",
              secciones: [
                {
                  subTitle: "Equipo Staff",
                  componentes: [
                    {
                      tipo: "texto",
                      Title: "Carpa Guia:",
                      KeyDato: "CarpaGuia"
                    },
                    {
                      tipo: "texto",
                      Title: "Carpa Comedor:",
                      KeyDato: "CarpaComedor"
                    },
                    {
                      tipo: "texto",
                      Title: "Carpa Cocina:",
                      KeyDato: "CarpaCocina"
                    },
                    {
                      tipo: "texto",
                      Title: "Carpa Baño:",
                      KeyDato: "CarpaBaño"
                    },
                    {
                      tipo: "texto",
                      Title: "Bolsas Biodegradables:",
                      KeyDato: "BolsasBiodegradables"
                    },
                    {
                      tipo: "texto",
                      Title: "Oxigeno",
                      KeyDato: "Oxigeno"
                    },
                    {
                      tipo: "texto",
                      Title: "Botiquin:",
                      KeyDato: "Botiquin"
                    },
                    {
                      tipo: "texto",
                      Title: "Otros:",
                      KeyDato: "Otros"
                    }
                  ]
                }
              ]
            }}
            ModoEdicion={modoEdicion}
            Dato={datosFormularioEquipoStaff}
            setDato={setDatosFormularioEquipoStaff}
            key={"OB_Equipo_Staff"}
          />
          <MaterialTable
            title="Datos Pasajeros"
            data={datosTablaPasajeros}
            columns={ColumnasPasajeros}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...datosTablaPasajeros];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosTour: dataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaPasajeros([...dataUpdate]);

                    resolve();
                  }, 1000);
                })
            }}
            options={{
              actionsColumnIndex: -1
            }}
          />
          <MaterialTable
            title="Briefing"
            data={datosTablaBriefing}
            columns={ColumnasBriefing}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    let tempDataUpdate = [...datosTablaBriefing, newData];

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosBriefing: tempDataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaBriefing([...datosTablaBriefing, newData]);
                    resolve();
                  }, 1000);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...datosTablaBriefing];
                    const index = newData.tableData.id;
                    dataUpdate[index] = newData;

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosBriefing: dataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaBriefing([...dataUpdate]);

                    resolve();
                  }, 1000);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...datosTablaBriefing];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);

                    let tempDelete = [...dataDelete];

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosBriefing: tempDelete }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaBriefing([...dataDelete]);

                    resolve();
                  }, 1000);
                })
            }}
            options={{
              actionsColumnIndex: -1
            }}
          />
          <MaterialTable
            title="Equipo Camping"
            data={datosTablaEquipoCamping}
            columns={ColumnasEquipoCamping}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    let tempDataUpdate = [...datosTablaEquipoCamping, newData];

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosEquipoCamping: tempDataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaEquipoCamping([
                      ...datosTablaEquipoCamping,
                      newData
                    ]);
                    resolve();
                  }, 1000);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...datosTablaEquipoCamping];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosEquipoCamping: dataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaEquipoCamping([...dataUpdate]);

                    resolve();
                  }, 1000);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...datosTablaEquipoCamping];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);

                    let tempDelete = [...dataDelete];

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosEquipoCamping: tempDelete }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaEquipoCamping([...dataDelete]);

                    resolve();
                  }, 1000);
                })
            }}
            options={{
              actionsColumnIndex: -1
            }}
          />
          <MaterialTable
            title="Trenes"
            data={datosTablaTrenes}
            columns={ColumnasTrenes}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    let tempDataUpdate = [...datosTablaTrenes, newData];

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosTren: tempDataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaTrenes([...datosTablaTrenes, newData]);
                    resolve();
                  }, 1000);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...datosTablaTrenes];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosTren: dataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaTrenes([...dataUpdate]);

                    resolve();
                  }, 1000);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...datosTablaTrenes];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);

                    let tempDelete = [...dataDelete];

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosTren: tempDelete }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaTrenes([...dataDelete]);

                    resolve();
                  }, 1000);
                })
            }}
            options={{
              actionsColumnIndex: -1
            }}
          />
          <MaterialTable
            title="Hoteles"
            data={datosTablaHoteles}
            columns={ColumnasHoteles}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    let tempDataUpdate = [...datosTablaHoteles, newData];

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosHotel: tempDataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaTrenes([...datosTablaTrenes, newData]);
                    resolve();
                  }, 1000);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...datosTablaHoteles];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosHotel: dataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaHoteles([...dataUpdate]);

                    resolve();
                  }, 1000);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...datosTablaHoteles];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);

                    let tempDelete = [...dataDelete];

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosHotel: tempDelete }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaHoteles([...dataDelete]);

                    resolve();
                  }, 1000);
                })
            }}
            options={{
              actionsColumnIndex: -1
            }}
          />
          <MaterialTable
            title="Entradas"
            data={datosTablaEntradas}
            columns={ColumnasEntrada}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    let tempDataUpdate = [...datosTablaEntradas, newData];

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosEntrada: tempDataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaEntradas([...datosTablaEntradas, newData]);
                    resolve();
                  }, 1000);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...datosTablaEntradas];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosEntrada: dataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaEntradas([...dataUpdate]);

                    resolve();
                  }, 1000);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...datosTablaEntradas];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);

                    let tempDelete = [...dataDelete];

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosEntrada: tempDelete }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaEntradas([...dataDelete]);

                    resolve();
                  }, 1000);
                })
            }}
            options={{
              actionsColumnIndex: -1
            }}
          />
          <MaterialTable
            title="Buses"
            data={datosTablaBuses}
            columns={ColumnasBuses}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    let tempDataUpdate = [...datosTablaBuses, newData];

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosBuses: tempDataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaBuses([...datosTablaBuses, newData]);
                    resolve();
                  }, 1000);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...datosTablaBuses];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosBuses: dataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaBuses([...dataUpdate]);

                    resolve();
                  }, 1000);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...datosTablaBuses];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);

                    let tempDelete = [...dataDelete];

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosBuses: tempDelete }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaBuses([...dataDelete]);

                    resolve();
                  }, 1000);
                })
            }}
            options={{
              actionsColumnIndex: -1
            }}
          />
        </div>
      )}
      {TipoOrdenServicio == "C" && (
        <div>
          <AutoFormulario_v2
            Formulario={{
              title: "Orden de Servicio C Transporte",
              secciones: [
                {
                  subTitle: "ORDEN DE SERVICIO C - TRANSPORTE",
                  componentes: [
                    {
                      tipo: "texto",
                      Title: "Empresa",
                      KeyDato: "Empresa"
                    },
                    {
                      tipo: "texto",
                      Title: "Codigo de Grupo",
                      KeyDato: "CodGrupo"
                    },
                    {
                      tipo: "texto",
                      Title: "Tour: ",
                      KeyDato: "Tour"
                    },
                    {
                      tipo: "numero",
                      Title: "N° Pax: ",
                      KeyDato: "NumPax"
                    },
                    {
                      tipo: "texto",
                      Title: "Tipo de Tranporte: ",
                      KeyDato: "TipoTranporte"
                    },
                    {
                      tipo: "numero",
                      Title: "Capacidad: ",
                      KeyDato: "Capacidad"
                    },
                    {
                      tipo: "fecha",
                      Title: "Fecha IN: ",
                      KeyDato: "FechaIn"
                    },
                    {
                      tipo: "fecha",
                      Title: "Fecha OUT: ",
                      KeyDato: "FechaOut"
                    }
                  ]
                }
              ]
            }}
            ModoEdicion={modoEdicion}
            Dato={datosFormularioTransporte}
            setDato={setDatosFormularioTransporte}
            key={"OC_Tranporte"}
          />
          <MaterialTable
            title="Datos Pasajero"
            data={datosTablaPasajero}
            columns={ColumnasPasajero}
            editable={{
              // onRowAdd: (newData) =>
              // new Promise((resolve, reject) => {
              //   setTimeout(() => {

              //     let tempDataUpdate = [...datosTablaPasajero, newData]

              //     fetch(APIpath+`/api/OrdenServicio/CRUD`,{
              //       method:"PUT",
              //       headers:{"Content-Type": "application/json"},
              //         body: JSON.stringify({
              //           "IdOrdenServicio": CodOrdenServ.IdOrdenServicio,
              //           "OrdenServicio": {"DatosPasajeros": tempDataUpdate}
              //         }),
              //       })
              //       .then(r=>r.json())
              //       .then(data=>{
              //       alert(data.message);
              //     })

              //     setDatosTablaPasajero([...datosTablaPasajero, newData]);
              //     resolve();
              //   }, 1000)
              // }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...datosTablaPasajero];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosPasajeros: dataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaPasajero([...dataUpdate]);

                    resolve();
                  }, 1000);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...datosTablaPasajero];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);

                    let tempDelete = [...dataDelete];

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosPasajeros: tempDelete }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaPasajero([...dataDelete]);

                    resolve();
                  }, 1000);
                })
            }}
            options={{
              actionsColumnIndex: -1
            }}
          />
          <MaterialTable
            title="Datos Transporte"
            data={datosTablaTransporte}
            columns={ColumnasTransporte}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    let tempDataUpdate = [...datosTablaTransporte, newData];

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosTransporte: tempDataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaTransporte([...datosTablaTransporte, newData]);
                    resolve();
                  }, 1000);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...datosTablaTransporte];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosTransporte: dataUpdate }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaTransporte([...dataUpdate]);

                    resolve();
                  }, 1000);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...datosTablaTransporte];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);

                    let tempDelete = [...dataDelete];

                    fetch(APIpath + `/api/OrdenServicio/CRUD`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        IdOrdenServicio: CodOrdenServ.IdOrdenServicio,
                        OrdenServicio: { DatosTransporte: tempDelete }
                      })
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        alert(data.message);
                      });

                    setDatosTablaTransporte([...dataDelete]);

                    resolve();
                  }, 1000);
                })
            }}
            options={{
              actionsColumnIndex: -1
            }}
          />
        </div>
      )}
      {TipoOrdenServicio == "D" && (
        <div>
          <AutoFormulario_v2
            Formulario={{
              title: "Orden de Servicio D",
              secciones: [
                {
                  subTitle: "ORDEN DE SERVICIO D - RESTAURANTE",
                  componentes: [
                    {
                      tipo: "texto",
                      Title: "Codigo Orden de Servicio",
                      KeyDato: "CodOrdenServ"
                    },
                    {
                      tipo: "texto",
                      Title: "Para: ",
                      KeyDato: "Empresa"
                    },
                    {
                      tipo: "texto",
                      Title: "Direccion: ",
                      KeyDato: "Direccion"
                    },
                    {
                      tipo: "texto",
                      Title: "Telefono: ",
                      KeyDato: "Telefono"
                    },
                    {
                      tipo: "texto",
                      Title: "N° Paxs: ",
                      KeyDato: "NumPax"
                    },
                    {
                      tipo: "texto",
                      Title: "Idioma: ",
                      KeyDato: "Idioma"
                    },
                    {
                      tipo: "texto",
                      Title: "A Nombre de PAX: ",
                      KeyDato: "Pax"
                    },
                    {
                      tipo: "granTexto",
                      Title: "Detalle de Servicio: ",
                      KeyDato: "NombreServicio"
                    },
                    {
                      tipo: "fecha",
                      Title: "Fecha: ",
                      KeyDato: "FechaReserva"
                    },
                    {
                      tipo: "granTexto",
                      Title: "Observaciones: ",
                      KeyDato: "Observaciones"
                    }
                  ]
                }
              ]
            }}
            ModoEdicion={modoEdicion}
            Dato={datosFormularioRestaurante}
            setDato={setDatosFormularioRestaurante}
            key={"OD_Formulario"}
          />
        </div>
      )}
      {TipoOrdenServicio == "E" && (
        <div>
          <AutoFormulario_v2
            Formulario={{
              title: "Orden de Servicio Hoteles",
              secciones: [
                {
                  subTitle: "ORDEN DE SERVICIO E - HOTELES",
                  componentes: [
                    {
                      tipo: "texto",
                      Title: "Codigo Orden de Servicio",
                      KeyDato: "CodOrdenServ"
                    },
                    {
                      tipo: "texto",
                      Title: "Para: ",
                      KeyDato: "empresa"
                    },
                    {
                      tipo: "texto",
                      Title: "Direccion: ",
                      KeyDato: "direccion"
                    },
                    {
                      tipo: "texto",
                      Title: "Telefono: ",
                      KeyDato: "telefono"
                    },
                    {
                      tipo: "texto",
                      Title: "N° Paxs: ",
                      KeyDato: "numPax"
                    },
                    {
                      tipo: "texto",
                      Title: "Tipo de Habitacion: ",
                      KeyDato: "tipHabitacion"
                    },
                    {
                      tipo: "texto",
                      Title: "Idioma: ",
                      KeyDato: "idioma"
                    },
                    {
                      tipo: "texto",
                      Title: "A Nombre de PAX: ",
                      KeyDato: "pax"
                    },
                    {
                      tipo: "granTexto",
                      Title: "Detalle de Servicio: ",
                      KeyDato: "NombreServicio"
                    },
                    {
                      tipo: "texto",
                      Title: "Fecha: ",
                      KeyDato: "FechaReserva"
                    },
                    {
                      tipo: "granTexto",
                      Title: "Observaciones: ",
                      KeyDato: "observaciones"
                    }
                  ]
                }
              ]
            }}
            ModoEdicion={modoEdicion}
            Dato={datosFormularioHoteles}
            setDato={setDatosFormularioHoteles}
            key={"OE_Formulario"}
          />
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ params, req, res }) {
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  const APIpath = process.env.API_DOMAIN;

  const { Auth } = withSSRContext({ req });

  let IdServicioEscogido = params.IdServEscogido;
  let TipoOrdenServicio = params.TipoOrdenServicio;

  let DatosServEscogido = {};
  let DatosProducto = {};
  let DatosProveedor = {};
  let DatosReservaCotizacion = {};
  let CodOrdenServ = {};
  let DatosClienteProspecto = {};
  let coleccionProducto = null;
  let idProductoProveedor = null;

  /*Seccion para Asegurar la Ruta de la API*/
  try {
    //const user = await Auth.currentAuthenticatedUser()
    //console.log(user)
  } catch (err) {
    res.writeHead(302, { Location: "/" });
    res.end();
  }
  /*------------------------------------------------------------------------------*/

  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  if (
    TipoOrdenServicio == "D" ||
    TipoOrdenServicio == "C" ||
    TipoOrdenServicio == "E"
  ) {
    try {
      await client.connect();
      const dbo = client.db(dbName);
      const collection = dbo.collection("ServicioEscogido");

      let result = await collection
        .find({})
        .project({
          _id: 0
        })
        .toArray();
      result.map((x) => {
        if (x.IdServicioEscogido == IdServicioEscogido) {
          // console.log(x.IdServicioProducto.slice(0,2))
          // console.log()
          switch (x.IdServicioProducto.slice(0, 2)) {
            case "PH":
              coleccionProducto = "ProductoHoteles";
              idProductoProveedor = "IdProductoHotel";
              break;
            case "PA":
              coleccionProducto = "ProductoAgencias";
              idProductoProveedor = "IdProductoAgencia";
              break;
            case "PG":
              coleccionProducto = "ProductoGuias";
              idProductoProveedor = "IdProductoGuia";
              break;
            case "PO":
              coleccionProducto = "ProductoOtros";
              idProductoProveedor = "IdProductoOtro";
              break;
            case "PR":
              coleccionProducto = "ProductoRestaurantes";
              idProductoProveedor = "IdProductoRestaurante";
              break;
            case "ST":
              coleccionProducto = "ProductoSitioTuristicos";
              idProductoProveedor = "IdProductoSitioTuristico";
              break;
            case "PF":
              coleccionProducto = "ProductoSitioTransFerroviario";
              idProductoProveedor = "IdProductoTransFerroviario";
              break;
            case "PT":
              coleccionProducto = "ProductoTransportes";
              idProductoProveedor = "IdProductoTransporte";
              break;
          }
          DatosServEscogido = x;
        }
      });
    } catch (error) {
      console.log("error - " + error);
    }
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection(coleccionProducto);
      let result = await collection
        .find()
        .project({
          _id: 0
        })
        .toArray();

      result.map((x) => {
        if (DatosServEscogido.IdServicioProducto == x[idProductoProveedor]) {
          DatosProducto = x;
        }
      });
    } catch (error) {
      console.log("error - " + error);
    }
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection("Proveedor");
      let result = await collection
        .find()
        .project({
          _id: 0
        })
        .toArray();
      result.map((x) => {
        if (x.IdProveedor == DatosProducto.IdProveedor) {
          DatosProveedor = x;
        }
      });
    } catch (error) {
      console.log("error - " + error);
    }
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection("Proveedor");
      let result = await collection
        .find()
        .project({
          _id: 0
        })
        .toArray();
      result.map((x) => {
        if (x.IdProveedor == DatosProducto.IdProveedor) {
          DatosProveedor = x;
        }
      });
    } catch (error) {
      console.log("error - " + error);
    }

    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection("OrdenServicio");
      let result = await collection
        .find()
        .project({
          _id: 0
        })
        .toArray();
      result.map((x) => {
        if (x.IdServicioEscogido == IdServicioEscogido) {
          console.log(x);
          CodOrdenServ = x;
        }
      });
    } catch (error) {
      console.log("error - " + error);
    }
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection("ReservaCotizacion");
      let result = await collection
        .find()
        .project({
          _id: 0
        })
        .toArray();
      result.map((x) => {
        if (x.IdReservaCotizacion == DatosServEscogido.IdReservaCotizacion) {
          DatosReservaCotizacion = x;
        }
      });
    } catch (error) {
      console.log("error - " + error);
    }
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection("ClienteProspecto");
      let result = await collection
        .find()
        .project({
          _id: 0
        })
        .toArray();
      result.map((x) => {
        if (x.IdClienteProspecto == DatosReservaCotizacion.IdClienteProspecto) {
          DatosClienteProspecto = x;
        }
      });
    } catch (error) {
      console.log("error - " + error);
    } finally {
      client.close;
    }
  } else if (TipoOrdenServicio == "A" || TipoOrdenServicio == "B") {
    try {
      await client.connect();
      const dbo = client.db(dbName);
      const collection = dbo.collection("ReservaCotizacion");

      let result = await collection
        .find({})
        .project({
          _id: 0
        })
        .toArray();
      result.map((x) => {
        if (x.IdReservaCotizacion == IdServicioEscogido) {
          DatosReservaCotizacion = x;
        }
      });
    } catch (error) {
      console.log("error - " + error);
    }
    try {
      let tempArrayDatosServicioEscogido = [];
      const dbo = client.db(dbName);
      const collection = dbo.collection("ServicioEscogido");

      let result = await collection
        .find({})
        .project({
          _id: 0
        })
        .toArray();
      result.map((x) => {
        if (x.IdReservaCotizacion == IdServicioEscogido) {
          tempArrayDatosServicioEscogido.push(x);
        }
      });
      DatosServEscogido = tempArrayDatosServicioEscogido;
    } catch (error) {
      console.log("error - " + error);
    }
    try {
      let tempArrayDatosProductoHoteles = [];
      let tempServiciohoteles = [];
      const dbo = client.db(dbName);
      const collection = dbo.collection("ProductoHoteles");
      let result = await collection
        .find()
        .project({
          _id: 0
        })
        .toArray();

      DatosServEscogido.map((datos) => {
        console.log(datos);
        if (datos.IdServicioProducto.slice(0, 2) == "PH") {
          tempServiciohoteles.push(datos);
        } else {
          console.log(" no existe servicio Hotel");
        }
      });
      result.map((x) => {
        if (x.IdProductoHotel == tempServiciohoteles[0].IdServicioProducto) {
          tempArrayDatosProductoHoteles.push(x);
        }
      });
      DatosProducto = tempArrayDatosProductoHoteles;
    } catch (error) {
      console.log("error - " + error);
    }
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection("Proveedor");
      let result = await collection
        .find()
        .project({
          _id: 0
        })
        .toArray();
      // DatosProducto.map((y)=>{
      //   if (x.IdProveedor) {

      //   }
      // })
      /*Validar que pase esto solo si el proveedor es igual*/
      result.map((x) => {
        if (x.IdProveedor == DatosProducto[0].IdProveedor) {
          DatosProveedor = x;
        }
      });
    } catch (error) {
      console.log("error - " + error);
    }
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection("OrdenServicio");
      let result = await collection
        .find()
        .project({
          _id: 0
        })
        .toArray();
      result.map((x) => {
        if (x.IdServicioEscogido == IdServicioEscogido) {
          CodOrdenServ = x;
        }
      });
    } catch (error) {
      console.log("error - " + error);
    }
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection("ClienteProspecto");
      let result = await collection
        .find()
        .project({
          _id: 0
        })
        .toArray();
      result.map((x) => {
        if (x.IdClienteProspecto == DatosReservaCotizacion.IdClienteProspecto) {
          DatosClienteProspecto = x;
        }
      });
    } catch (error) {
      console.log("error - " + error);
    } finally {
      client.close;
    }
  } else {
    res.status("Ingreso una Orden de Servicio Inexistente");
  }

  return {
    props: {
      DatosServEscogido: DatosServEscogido,
      DatosProducto: DatosProducto,
      DatosProveedor: DatosProveedor,
      CodOrdenServ: CodOrdenServ,
      DatosClienteProspecto: DatosClienteProspecto,
      DatosReservaCotizacion: DatosReservaCotizacion,
      APIpath
    }
  };
}
