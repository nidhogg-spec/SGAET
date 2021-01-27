import CampoTexto from '@/components/Formulario/CampoTexto/CampoTexto'
import MaterialTable from "material-table";
import AutoFormulario_v2 from "@/components/Formulario_V2/AutoFormulario/AutoFormulario"
import {withSSRContext} from 'aws-amplify'
import { useEffect, useState } from 'react'
import {useRouter} from 'next/router'
import { MongoClient } from "mongodb";

export default function OrdenServicioTipoC (
    {
      DatosServEscogido,
      DatosProveedor,
      DatosProducto,
      CodOrdenServ,
      DatosReservaCotizacion,
      DatosClienteProspecto
    }
  ){
  const router = useRouter()

  // console.log(DatosServEscogido)
  // console.log(DatosProveedor)
  // console.log(DatosProducto)
  // console.log(CodOrdenServ)
  // console.log(DatosReservaCotizacion)
  // console.log(DatosClienteProspecto)

  const {IdServEscogido,TipoOrdenServicio} = router.query

  /* Datos Orden de Servicio A */
  const [datosTrasnporteTour, setDatosTrasnporteTour] = useState([])

  const [datosFormularioTour, setDatosFormularioTour] = useState({})

  /* Datos Orden de Servicio B */
  const [datosFormularioGrupo, setDatosFormularioGrupo] = useState({})

  const [datosFormularioGrupoNombre, setDatosFormularioGrupoNombre] = useState({})

  const [datosFormularioExtra, setDatosFormularioExtra] = useState({})

  const [datosFormularioEquipoPax, setDatosFormularioEquipoPax] = useState({})

  const [datosFormularioEquipoStaff, setDatosFormularioEquipoStaff] = useState({})

  const [datosTablaPasajeros, setDatosTablaPasajeros] = useState([])

  const [datosTablaBriefing, setDatosTablaBriefing] = useState([])

  const [datosTablaEquipoCamping, setDatosTablaEquipoCamping] = useState([])

  const [datosTablaTrenes, setDatosTablaTrenes] = useState([])

  const [datosTablaHoteles, setDatosTablaHoteles] = useState([])

  const [datosTablaEntradas, setDatosTablaEntradas] = useState([])

  const [datosTablaBuses, setDatosTablaBuses] = useState([])

  /* Datos Orden de Servicio C */
  const [datosFormularioTransporte, setDatosFormularioTransporte] = useState({})

  const [datosTablaTransporte, setDatosTablaTransporte] = useState([])

  const [datosTablaPasajero, setDatosTablaPasajero] = useState([])

  /* Datos Orden de Servicio D*/
  const [datosFormularioRestaurante, setDatosFormularioRestaurante] = useState({})

    /* Datos Orden de Servicio E*/
    const [datosFormularioHoteles, setDatosFormularioHoteles] = useState({})

    const [modoEdicion, setModoEdicion] = useState(false)

  /*------------------ Datos de las Tablas en Ordenes de Servicio ---------------------------------------------*/

  /* Columnas Tabla Orden de Servicio A*/
  const ColumnasTourTranporte = [
    { title: "Nombre", field: "Nombre"},
    { title: "Apellido", field: "Apellido"},
    { title: "Hotel", field: "Hotel"},
    { title: "Ciudad", field: "Ciudad"},
    { title: "Tren Ida", field: "TrenIda"},
    { title: "Tren Retorno", field: "TrenRetor"},
    { title: "BUS OW - R/T", field: "Bus"},
    // { title: "ENTRADA MP-MH-MM", field: "Entradas"},
    { title: "ENTRADA", field: "Entradas"},
    { title: "ADT/EST", field: "EtapaVida"},
    { title: "Cena", field: "Cena"},
    { title: "Regimen Alimenticio", field: "RegAlimenticio"},   
  ]

  /* Columnas Tabla Orden de Servicio B*/
  const ColumnasPasajeros = [
    { title: "Nombres", field: "Nombre"},
    { title: "Apellido", field: "Apellido"},
    { title: "Etapa Vida", field: "EtapaVida"},
    { title: "Alimentacion Extra", field: "AlimenExtra"},
    { title: "Regimen Alimenticio", field: "RegAlimenticio"},
  ]
  const ColumnasBriefing = [
    { title: "Fecha", field: "Fecha"},
    { title: "Hora", field: "Hora"},
    { title: "Lugar", field: "Lugar"},
  ]
  const ColumnasEquipoCamping = [
    { title: "Carpa", field: "Carpa"},
    { title: "Sleeping", field: "Sleeping"},
    { title: "Matra", field: "Matra"},
    { title: "Duffel", field: "Duffel"},
    { title: "Baston", field: "Baston"},
  ]
  const ColumnasTrenes = [
    // { title: "ID", field: "IdTrenes", hidden: true},
    // { title: "Tipo", field: "Tipo"},
    // { title: "TrenIda", field: "TrenIda"},
    // { title: "TrenRetorno", field: "TrenRetorno"},
    { title: "Servicio", field: "NombreServicio"},
  ]
  const ColumnasHoteles = [
    { title: "Servicio", field: "NombreServicio"},
    { title: "Ciudad", field: "Ciudad"},
    { title: "Noche Extra", field: "NocheExtra", type:"boolean"},
  ]
  const ColumnasBuses = [
    { title: "OW - R/T", field: "NombreServicio"},
  ]
  const ColumnasEntrada = [
    { title: "Entrada", field: "NombreServicio" }
  ]

  /* Columnas Tabla Orden de Servicio C*/
  const ColumnasPasajero = [
    { title: "Nombres", field: "Nombre"},
    { title: "Apellido", field: "Apellido"},
    { title: "Ciudad", field: "Ciudad"},
    { title: "Hotel", field: "Hotel"},
    { title: "Observaciones", field: "Observaciones"},
  ]
  const ColumnasTransporte = [
    { title: "Fecha", field: "FechaIN", type:"date"},
    { title: "Servicio", field: "DescripcionServicio"},
    { title: "Hora Recojo", field: "HoraRecojo"},
    { title: "Tren", field: "Tren"},
    { title: "Origen", field: "Origen"},
    { title: "Destino", field: "Destino"},
    { title: "Observaciones", field: "Observaciones"},
  ]
  /*-----------UseEffect para setear formato de  Cada Orden de Servicio---------------------*/

  useEffect(()=>{
    if (DatosReservaCotizacion.NpasajerosChild == null) {
      DatosReservaCotizacion.NpasajerosChild=0
    }
    switch(TipoOrdenServicio){
      case "A":
        console.log(DatosProveedor)
         
        console.log(DatosProducto)
        // console.log(DatosServEscogido) 
        // console.log(DatosReservaCotizacion)
        // console.log(CodOrdenServ.CodigoOrdenServicio)
        let numPaxOrdenA = parseInt(DatosReservaCotizacion.NpasajerosAdult)+parseInt(DatosReservaCotizacion.NpasajerosChild)
        
        let tempDatosFormularioTour = {
          "CodigoOrdenServ": CodOrdenServ.CodigoOrdenServicio,
          "CodGrupo": DatosReservaCotizacion.CodGrupo,
          "Tour": DatosReservaCotizacion.Descripcion,
          "Fecha": DatosReservaCotizacion.FechaIN,
          "NumPax": numPaxOrdenA,
          "NomGrupo": DatosReservaCotizacion.NombreGrupo,
        }
        /*Seteo de Trasnportes en la tabla*/
        let TempDatosTablaPasajerosOrdenA = DatosReservaCotizacion.listaPasajeros
        /*Condicional para manejar el dato adicional que viene de lista pasajeros,
        este dato se usa para que se pueda mostrar desde la base de datos los pasajeros registrados.
        hasta que se encuentre otro metodo esta condicional deberia mantenerse asi.*/
        if(numPaxOrdenA != TempDatosTablaPasajerosOrdenA.length){
          TempDatosTablaPasajerosOrdenA.pop()
        } 
        let tempTrasnporte = ""
        let tempEntradas = ""
        let tempTren = ""

        DatosServEscogido.map((x)=>{
          if (x.IdServicioProducto.slice(0,2) == "PT") {
            tempTrasnporte= x.NombreServicio
          }else if (x.IdServicioProducto.slice(0,2) == "PF") {
            tempTren= x.NombreServicio
          }else if (x.IdServicioProducto.slice(0,2) == "PS") {
            tempEntradas= x.NombreServicio
          }
        })

        let tempObject = {
          "Hotel": DatosProveedor.nombre, 
          "Bus": tempTrasnporte,
          "Entradas": tempEntradas
        }

        TempDatosTablaPasajerosOrdenA.map((x,index)=>{
          TempDatosTablaPasajerosOrdenA[index] = Object.assign(tempObject,x)
        })

        setDatosTrasnporteTour(TempDatosTablaPasajerosOrdenA)
        setDatosFormularioTour(tempDatosFormularioTour)
        break
      case "B":  
      let numPaxOrdenB = parseInt(DatosReservaCotizacion.NpasajerosAdult)+parseInt(DatosReservaCotizacion.NpasajerosChild)
        let TempDatosFormularioGrupo = {
          "CodGrupo": DatosReservaCotizacion.CodGrupo,
          "Fecha": DatosReservaCotizacion.FechaIN,
          "NumPax": numPaxOrdenB 
        }
        let TempDatosFormularioNombreGrupo = {
          "NomGrupo": DatosReservaCotizacion.NombreGrupo
        }
        /*Seteo de Tabla Pasajero*/
        let TempDatosTablaPasajerosOrdenB = DatosReservaCotizacion.listaPasajeros
        /*Condicional para manejar el dato adicional que viene de lista pasajeros,
        este dato se usa para que se pueda mostrar desde la base de datos los pasajeros registrados.
        hasta que se encuentre otro metodo esta condicional deberia mantenerse asi.*/
        if(numPaxOrdenB != TempDatosTablaPasajerosOrdenB.length){
          TempDatosTablaPasajerosOrdenB.pop()
        } 

        /*Seteo de Tablas Trenes-Hoteles-Buses-SitioTuristico*/
        let tempArrayServEscogidoTrasnporte = []
        let tempArrayServEscogidoHotel = []
        let tempArrayServEscogidoEntradas = []
        let tempArrayServEscogidoTren = []

        DatosServEscogido.map((x)=>{
          if (x.IdServicioProducto.slice(0,2) == "PH") {
            tempArrayServEscogidoHotel.push({"NombreServicio":x.NombreServicio})
          }else if (x.IdServicioProducto.slice(0,2) == "PT") {
            tempArrayServEscogidoTrasnporte.push({"NombreServicio":x.NombreServicio})
          }else if (x.IdServicioProducto.slice(0,2) == "PF") {
            tempArrayServEscogidoTren.push({"NombreServicio":x.NombreServicio})
          }else if (x.IdServicioProducto.slice(0,2) == "PS") {
            tempArrayServEscogidoEntradas.push({"NombreServicio":x.NombreServicio})
          }
        })

        setDatosFormularioGrupo(TempDatosFormularioGrupo)
        setDatosFormularioGrupoNombre(TempDatosFormularioNombreGrupo)
        setDatosTablaPasajeros(TempDatosTablaPasajerosOrdenB)

        setDatosTablaBuses(tempArrayServEscogidoTrasnporte)
        setDatosTablaHoteles(tempArrayServEscogidoHotel)
        setDatosTablaTrenes(tempArrayServEscogidoTren)
        setDatosTablaEntradas(tempArrayServEscogidoEntradas)

        break
      case "C":
        //Orden de Servicio C - Transporte
        let numPax = parseInt(DatosReservaCotizacion.NpasajerosAdult)+parseInt(DatosReservaCotizacion.NpasajerosChild)
        /*Seteo de Formulario Orden de Servicio*/
        let DatosOrdenC = {
          "Empresa": DatosProveedor.nombre,
          "CodGrupo": DatosReservaCotizacion.CodGrupo,
          "Tour": DatosReservaCotizacion.Descripcion,
          "NumPax": numPax,
          "TipoTranporte": DatosProducto.tipvehiculo,
          "FechaIn":DatosReservaCotizacion.FechaIN,
          "FechaOut":DatosReservaCotizacion.FechaOUT
        }
        /*Seteo de Tabla Pasajero*/
        let TempDatosTablaPasajeros = DatosReservaCotizacion.listaPasajeros
        //Condicional para manejar el dato adicional que viene de lista pasajeros,
        //este dato se usa para que se pueda mostrar desde la base de datos los pasajeros registrados.
        //hasta que se encuentre otro metodo esta condicional deberia mantenerse asi.
        if(numPax != TempDatosTablaPasajeros.length){
          TempDatosTablaPasajeros.pop()
        } 
        /*Seteo de Tabla Transporte*/
        //OriDest Almacena el servicio del producto y lo divide solo funciona si el formato es
        //Origen - Destino no funciona si tiene mas cosas por delante o despues de
        let OriDest = DatosProducto.servicio.split("-")
        let tempObjetoTablaTrasnporte = {
          "FechaIN" : DatosReservaCotizacion.FechaIN,
          "Origen" : OriDest[0],
          "Destino" : OriDest[1]
        }
        console.log()

        setDatosFormularioTransporte(DatosOrdenC)
        setDatosTablaPasajero(TempDatosTablaPasajeros)
        setDatosTablaTransporte([tempObjetoTablaTrasnporte])

        break;
      case "D":
      //Orden de Servicio D - Restaurantes
        let DatosOrdenD = {
          "CodOrdenServ": CodOrdenServ.CodigoOrdenServicio,
          "Empresa": DatosProveedor.nombre,
          "Direccion": DatosProveedor.direccionRegistrada,
          "Telefono": DatosProveedor.celular,
          "NumPax": parseInt(DatosReservaCotizacion.NpasajerosAdult)+parseInt(DatosReservaCotizacion.NpasajerosChild),
          "Pax": DatosClienteProspecto.NombreCompleto,
          "NombreServicio": DatosReservaCotizacion.Descripcion,
          "FechaReserva": DatosReservaCotizacion.FechaIN
        }
        setDatosFormularioRestaurante(DatosOrdenD)
        break;
    }
  },[])

  return(
    <div>
      <img
        src="/resources/save-black-18dp.svg"
        onClick={() => {
          setDarDato(true)
          setModoEdicion(false)
        }}
      />
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
      {TipoOrdenServicio == "A" && 
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
                    KeyDato:  "Tour",
                  },
                  {
                    tipo: "texto",
                    Title: "Guia: ",
                    KeyDato:  "Guia",
                  },
                  {
                    tipo: "texto",
                    Title: "Asistente: ",
                    KeyDato:  "Asistente",
                  },
                  {
                    tipo: "fecha",
                    Title: "Fecha: ",
                    KeyDato:  "Fecha",
                  },
                  {
                    tipo: "numero",
                    Title: "N° Pax: ",
                    KeyDato:  "NumPax",
                  },
                  {
                    tipo: "numero",
                    Title: "N° Porters: ",
                    KeyDato: "NumPorte",
                  },
                  {
                    tipo: "texto",
                    Title: "Transporte : ",
                    KeyDato:  "Trasnporte",
                  },
                  {
                    tipo: "texto",
                    Title: "Nombre de Grupo: ",
                    KeyDato:  "NomGrupo",
                  },  
                  {
                    tipo: "texto",
                    Title: "Anexo: ",
                    KeyDato:  "Anexo",
                  },
                  {
                    tipo: "texto",
                    Title: "Ingreso: ",
                    KeyDato:  "Ingreso",
                  },
                  {
                    tipo: "numero",
                    Title: "Nº Box Lunch :",
                    KeyDato:  "boxLunch",
                  },
                  {
                    tipo: "numero",
                    Title: "N° Botiquin : ",
                    KeyDato:  "Nbotiquin",
                  },
                  {
                    tipo: "texto",
                    Title: "N° Primeros Auxilios : ",
                    KeyDato:  "NprimerosAuxilios",
                  },
                  {
                    tipo: "numero",
                    Title: "Imprevistos(S/.) : ",
                    KeyDato:  "ImprevistosSoles",
                  },
                  {
                    tipo: "numero",
                    Title: "Imprevistos(US $) : ",
                    KeyDato:  "ImprevistosDolares",
                  },
                ],
              },
            ],
            }}
            ModoEdicion={modoEdicion}
            Dato={datosFormularioTour}
            setDato={setDatosFormularioTour}
            key={'OA_Tours'}
          />
          <MaterialTable
            title= "Datos Transporte"
            data={datosTrasnporteTour}
            columns= {ColumnasTourTranporte}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...datosTablaTranporte];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setDatosTrasnporteTour([...dataUpdate]);

                    fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioA`,{
                      method:"POST",
                      headers:{"Content-Type": "application/json"},
                      body: JSON.stringify({
                        idProducto: DatosOrdenC.IdOrdenServTipC,
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
            }}
            options={{
              actionsColumnIndex: -1,
            }}
          />
        </div>
      }
      {/*Orden Tipo B */}
      {TipoOrdenServicio=="B" &&
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
                KeyDato:  "trekking",
                },
                {
                tipo: "fecha",
                Title: "Fecha: ",
                KeyDato:  "Fecha",
                },
                {
                tipo: "numero",
                Title: "N° Paxs: ",
                KeyDato:  "NumPax",
                },
                {
                tipo: "texto",
                Title: "Guia: ",
                KeyDato:  "Guia",
                },
                {
                tipo: "texto",
                Title: "Asistente: ",
                KeyDato: "asistente",
                },
                {
                tipo: "texto",
                Title: "Cocinero : ",
                KeyDato:  "cocinero",
                },
                {
                tipo: "texto",
                Title: "Transporte : ",
                KeyDato:  "trasnporte",
                }],
            },
          ],
          }}
          ModoEdicion={modoEdicion}
          Dato={datosFormularioGrupo}
          setDato={setDatosFormularioGrupo}
          key={'OB_Grupo'}
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
                  KeyDato:  "anexo",
                  },
                  {
                  tipo: "texto",
                  Title: "PTO. de Ingreso: ",
                  KeyDato:  "puntoIngreso",
                  },
                  {
                  tipo: "texto",
                  Title: "Oxigeno: ",
                  KeyDato:  "oxigeno",
                  },
                  {
                  tipo: "numero",
                  Title: "N° Botiquin: ",
                  KeyDato:  "numBotiquin",
                  },
                  {
                  tipo: "numero",
                  Title: "Imprevistos(S/.): ",
                  KeyDato:  "imprevistosSoles",
                  },
                  {
                  tipo: "numero",
                  Title: "Imprevistos(US $): ",
                  KeyDato:  "imprevistosDolares",
                }],
              },
            ],
          }}
          ModoEdicion={modoEdicion}
          Dato={datosFormularioGrupoNombre}
          setDato={setDatosFormularioGrupoNombre}
          key={'OB_GrupoNombre'}
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
                  KeyDato: "numPorters"
                  },
                  {
                  tipo: "numero",
                  Title: "N° Porters Extra:",
                  KeyDato: "numPortersExtra"
                  },
                  {
                  tipo: "numero",
                  Title: "N° Arrieros:",
                  KeyDato: "numaArrieros"
                  },
                  {
                  tipo: "numero",
                  Title: "N° Caballos Carga:",
                  KeyDato: "numCaballoCarga"
                  },
                  {
                  tipo: "numero",
                  Title: "N° Caballos Silla: ",
                  KeyDato: "numCaballoSilla"
                  },
                  {
                  tipo: "texto",
                  Title: "Campamento 1er Dia",
                  KeyDato: "campoPrimerDia"
                  },
                  {
                  tipo: "texto",
                  Title: "Campamento 2do Dia",
                  KeyDato: "campoSegunDia"
                  },
                  {
                  tipo: "texto",
                  Title: "Campamento 3er Dia",
                  KeyDato: "campoTercerDia"
                  },
                  {
                  tipo: "texto",
                  Title: "Campamento 4to Dia",
                  KeyDato: "campoCuartoDia"
                }],
              },
            ],
          }}
          ModoEdicion={modoEdicion}
          Dato={datosFormularioExtra}
          setDato={setDatosFormularioExtra}
          key={'OB_Extras'}
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
                    KeyDato: "numCarpaDobles"
                },
                {
                    tipo: "numero",
                    Title: "Carpas Simples:",
                    KeyDato: "numCarpaSimples"
                },
                {
                    tipo: "numero",
                    Title: "Carpas Triple:",
                    KeyDato: "numCarpaTriple"
                },
                {
                    tipo: "numero",
                    Title: "Matras Simples:",
                    KeyDato: "numMatrasSimples"
                },
                {
                    tipo: "numero",
                    Title: "Matras Infables:",
                    KeyDato: "numMatrasInfables"
                },
                {
                    tipo: "numero",
                    Title: "Sleeping Sinteticos",
                    KeyDato: "numSleepingSinteticos"
                },
                {
                    tipo: "numero",
                    Title: "Sleeping Plumas:",
                    KeyDato: "numSleepingPlumas"
                },
                {
                    tipo: "numero",
                    Title: "Bastones:",
                    KeyDato: "numBastones"
                },
                {
                    tipo: "numero",
                    Title: "Duffel:",
                    KeyDato: "numDuffel"
                }],
              },
            ],
          }}
          ModoEdicion={modoEdicion}
          Dato={datosFormularioEquipoPax}
          setDato={setDatosFormularioEquipoPax}
          key={'OB_Equipo_Pax'}
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
                  KeyDato: "carpaGuia"
                  },
                  {
                  tipo: "texto",
                  Title: "Carpa Comedor:",
                  KeyDato: "carpaComedor"
                  },
                  {
                  tipo: "texto",
                  Title: "Carpa Cocina:",
                  KeyDato: "carpaCocina"
                  },
                  {
                  tipo: "texto",
                  Title: "Carpa Baño:",
                  KeyDato: "carpaBaño"
                  },
                  {
                  tipo: "texto",
                  Title: "Bolsas Biodegradables:",
                  KeyDato: "bolsasBiodegradables"
                  },
                  {
                  tipo: "texto",
                  Title: "Oxigeno",
                  KeyDato: "oxigeno"
                  },
                  {
                  tipo: "texto",
                  Title: "Botiquin:",
                  KeyDato: "botiquin"
                  },
                  {
                  tipo: "texto",
                  Title: "Otros:",
                  KeyDato: "otros"
                  },
              ],
            },
          ],
          }}
          ModoEdicion={modoEdicion}
          Dato={datosFormularioEquipoStaff}
          setDato={setDatosFormularioEquipoStaff}
          key={'OB_Equipo_Staff'}
          />
          <MaterialTable
            title= "Datos Pasajeros"
            data= {datosTablaPasajeros}
            columns= {ColumnasPasajeros}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                setTimeout(() => {
                    const dataUpdate = [...datosTablaPasajeros];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setDatosTablaPasajeros([...dataUpdate]);

                    fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioB`,{
                    method:"POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({
                        idProducto: DatosOrdenB.IdOrdenServTipB,
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
              }}
              options={{
              actionsColumnIndex: -1,
            }}
          />
          <MaterialTable
            title= "Briefing"
            data= {datosTablaBriefing}
            columns= {ColumnasBriefing}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                setTimeout(() => {
                    const dataUpdate = [...datosTablaBriefing];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setDatosTablaBriefing([...dataUpdate]);

                    fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioB`,{
                    method:"POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({
                        idProducto: DatosOrdenB.IdOrdenServTipB,
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
              }}
              options={{
              actionsColumnIndex: -1,
            }}
          />
          <MaterialTable
            title= "Equipo Camping"
            data={datosTablaEquipoCamping}
            columns= {ColumnasEquipoCamping}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                setTimeout(() => {
                    const dataUpdate = [...datosTablaEquipoCamping];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setDatosTablaEquipoCamping([...dataUpdate]);

                    fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioB`,{
                    method:"POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({
                        idProducto: DatosOrdenB.IdOrdenServTipB,
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
              }}
              options={{
              actionsColumnIndex: -1,
            }}
          />
          <MaterialTable
            title= "Trenes"
            data={datosTablaTrenes}
            columns= {ColumnasTrenes}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                setTimeout(() => {
                    const dataUpdate = [...datosTablaTrenes];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setDatosTablaTrenes([...dataUpdate]);

                    fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioB`,{
                    method:"POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({
                        idProducto: DatosOrdenB.IdOrdenServTipB,
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
              }}
              options={{
              actionsColumnIndex: -1,
            }}
          />
          <MaterialTable
            title= "Hoteles"
            data={datosTablaHoteles}
            columns= {ColumnasHoteles}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                setTimeout(() => {
                    const dataUpdate = [...datosTablaHoteles];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setDatosTablaHoteles([...dataUpdate]);

                    fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioB`,{
                    method:"POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({
                        idProducto: DatosOrdenB.IdOrdenServTipB,
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
              }}
              options={{
              actionsColumnIndex: -1,
            }}
          />
          <MaterialTable
            title= "Entradas"
            data={datosTablaEntradas}
            columns= {ColumnasEntrada}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                setTimeout(() => {
                const dataUpdate = [...datosTablaBuses];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setDatosTablaEntradas([...dataUpdate]);

                  fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioB`,{
                      method:"POST",
                      headers:{"Content-Type": "application/json"},
                      body: JSON.stringify({
                      idProducto: DatosOrdenB.IdOrdenServTipB,
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
              }}
              options={{
              actionsColumnIndex: -1,
            }}
          />
          <MaterialTable
            title= "Buses"
            data={datosTablaBuses}
            columns= {ColumnasBuses}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                setTimeout(() => {
                const dataUpdate = [...datosTablaBuses];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setDatosTablaBuses([...dataUpdate]);

                  fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioB`,{
                      method:"POST",
                      headers:{"Content-Type": "application/json"},
                      body: JSON.stringify({
                      idProducto: DatosOrdenB.IdOrdenServTipB,
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
              }}
              options={{
              actionsColumnIndex: -1,
            }}
          />
        </div>
      }
      {TipoOrdenServicio == "C" &&
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
                    KeyDato:  "Tour",
                  },
                  {
                    tipo: "numero",
                    Title: "N° Pax: ",
                    KeyDato:  "NumPax",
                  },
                  {
                    tipo: "texto",
                    Title: "Tipo de Tranporte: ",
                    KeyDato:  "TipoTranporte",
                  },
                  {
                    tipo: "numero",
                    Title: "Capacidad: ",
                    KeyDato:  "Capacidad",
                  },
                  {
                    tipo: "fecha",
                    Title: "Fecha IN: ",
                    KeyDato:  "FechaIn",
                  },
                  {
                    tipo: "fecha",
                    Title: "Fecha OUT: ",
                    KeyDato:  "FechaOut",
                  }],
                },
              ],
            }}
            ModoEdicion={modoEdicion}
            Dato={datosFormularioTransporte}
            setDato={setDatosFormularioTransporte}
            key={'OC_Tranporte'}
          />
          <MaterialTable
            title= "Datos Pasajero"
            data={datosTablaPasajero}
            columns= {ColumnasPasajero}
            editable={{
              onRowAdd: newData =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    setDatosTablaPasajeros([...datosTablaPasajero, newData]);
                    resolve();
                  }, 1000)
                }), 
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...datosTablaPasajero];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setDatosTablaTransporte([...dataUpdate]);

                    fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioC`,{
                      method:"POST",
                      headers:{"Content-Type": "application/json"},
                      body: JSON.stringify({
                        idProducto: DatosOrdenC.IdOrdenServTipC,
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
              }}
              options={{
              actionsColumnIndex: -1,
            }}
          />
          <MaterialTable
            title= "Datos Transporte"
            data={datosTablaTransporte}
            columns= {ColumnasTransporte}
            editable={{
              onRowAdd: newData =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    setDatosTablaTransporte([...datosTablaTransporte, newData]);

                    fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioC`,{
                      method:"POST",
                      headers:{"Content-Type": "application/json"},
                      body: JSON.stringify({
                        idProducto: DatosOrdenC.IdOrdenServTipC,
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
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...datosTablaTranporte];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setDatosTablaTransporte([...dataUpdate]);

                    fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioC`,{
                      method:"POST",
                      headers:{"Content-Type": "application/json"},
                      body: JSON.stringify({
                        idProducto: DatosOrdenC.IdOrdenServTipC,
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
              }}
              options={{
              actionsColumnIndex: -1,
            }}
          />
        </div>
      }
      {TipoOrdenServicio == "D" &&
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
                      KeyDato:  "Empresa",
                    },
                    {
                      tipo: "texto",
                      Title: "Direccion: ",
                      KeyDato:  "Direccion",
                    },
                    {
                      tipo: "texto",
                      Title: "Telefono: ",
                      KeyDato:  "Telefono",
                    },
                    {
                      tipo: "texto",
                      Title: "N° Paxs: ",
                      KeyDato:  "NumPax",
                    },
                    {
                      tipo: "texto",
                      Title: "Idioma: ",
                      KeyDato:  "Idioma",
                    },
                    {
                      tipo: "texto",
                      Title: "A Nombre de PAX: ",
                      KeyDato:  "Pax",
                    },
                    {
                      tipo: "granTexto",
                      Title: "Detalle de Servicio: ",
                      KeyDato:  "NombreServicio",
                    },
                    {
                      tipo: "fecha",
                      Title: "Fecha: ",
                      KeyDato:  "FechaReserva",
                    },  
                    {
                      tipo: "granTexto",
                      Title: "Observaciones: ",
                      KeyDato:  "Observaciones",
                    },
                  ],
                },
            ],
            }}
            ModoEdicion={modoEdicion}
            Dato={datosFormularioRestaurante}
            setDato={setDatosFormularioRestaurante}
            key={'OD_Formulario'}
          />
        </div>
      }
      {TipoOrdenServicio == "E" &&
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
                      KeyDato:  "empresa",
                    },
                    {
                      tipo: "texto",
                      Title: "Direccion: ",
                      KeyDato:  "direccion",
                    },
                    {
                      tipo: "texto",
                      Title: "Telefono: ",
                      KeyDato:  "telefono",
                    },
                    {
                      tipo: "texto",
                      Title: "N° Paxs: ",
                      KeyDato:  "numPax",
                    },
                    {
                      tipo: "texto",
                      Title: "Tipo de Habitacion: ",
                      KeyDato:  "tipHabitacion",
                    },
                    {
                      tipo: "texto",
                      Title: "Idioma: ",
                      KeyDato:  "idioma",
                    },
                    {
                      tipo: "texto",
                      Title: "A Nombre de PAX: ",
                      KeyDato:  "pax",
                    },
                    {
                      tipo: "granTexto",
                      Title: "Detalle de Servicio: ",
                      KeyDato:  "NombreServicio",
                    },
                    {
                      tipo: "texto",
                      Title: "Fecha: ",
                      KeyDato:  "FechaReserva",
                    },  
                    {
                      tipo: "granTexto",
                      Title: "Observaciones: ",
                      KeyDato:  "observaciones",
                    },
                  ],
                },
            ],
            }}
            ModoEdicion={modoEdicion}
            Dato={datosFormularioHoteles}
            setDato={setDatosFormularioHoteles}
            key={'OE_Formulario'}
          />
        </div>
      }        
  </div>
  )
}

export async function getServerSideProps({params,req,res}){
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  const { Auth } = withSSRContext({ req })

  let IdServicioEscogido = params.IdServEscogido
  let TipoOrdenServicio = params.TipoOrdenServicio

  let DatosServEscogido = {}
  let DatosProducto = {}
  let DatosProveedor = {}
  let DatosReservaCotizacion = {}
  let CodOrdenServ = {}
  let DatosClienteProspecto= {}
  let coleccionProducto = null
  let idProductoProveedor = null

  /*Seccion para Asegurar la Ruta de la API*/
  try {
    //const user = await Auth.currentAuthenticatedUser()
    //console.log(user)
  } catch (err) {
    res.writeHead(302, { Location: '/' })
    res.end()
  }
  /*------------------------------------------------------------------------------*/
  
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  if (TipoOrdenServicio == "D" || TipoOrdenServicio == "C" || TipoOrdenServicio == "E") {
    try {
      await client.connect();
      const dbo = client.db(dbName);
      const collection = dbo.collection("ServicioEscogido");
  
      let result = await collection.find({}).project({
        "_id":0, 
      }).toArray()
      result.map(x=>{
          if(x.IdServicioEscogido==IdServicioEscogido){
            // console.log(x.IdServicioProducto.slice(0,2))
            // console.log()
              switch(x.IdServicioProducto.slice(0,2)){
                case "PH":
                  coleccionProducto = "ProductoHoteles"
                  idProductoProveedor="IdProductoHotel"
                  break;
                case "PA":
                  coleccionProducto = "ProductoAgencias"
                  idProductoProveedor="IdProductoAgencias"
                  break;
                case "PG":
                  coleccionProducto = "ProductoGuias"
                  idProductoProveedor="IdProductoGuias"
                  break;
                case "PO":
                  coleccionProducto = "ProductoOtros"
                  idProductoProveedor="IdProductoOtro"
                  break;
                case "PR":
                  coleccionProducto = "ProductoRestaurantes"
                  idProductoProveedor="IdProductoRestaurantes"
                  break;
                case "ST":
                  coleccionProducto = "ProductoSitioTuristicos"
                  idProductoProveedor="IdProductoSitioTuristico"
                  break;
                case "PF":
                  coleccionProducto = "ProductoSitioTransFerroviario"
                  idProductoProveedor="IdProductoTransFerroviario"
                  break;
                case "PT":
                  coleccionProducto = "ProductoTransportes"
                  idProductoProveedor="IdProductoTransportes"
                    break;
              }
              DatosServEscogido=x
          }
      })
    } catch (error) {
      console.log("error - " + error);
    } 
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection(coleccionProducto);
      let result = await collection.find().project({
        "_id":0, 
      }).toArray()
      
      result.map(x=>{
          if(DatosServEscogido.IdServicioProducto==x[idProductoProveedor]){
            DatosProducto=x
          }
      })
    } catch (error) {
      console.log("error - " + error);
    } 
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection("Proveedor");
      let result = await collection.find().project({
        "_id":0, 
      }).toArray()
      result.map(x=>{
          if(x.idProveedor == DatosProducto.idProveedor){
            DatosProveedor=x
          }
      })
    } catch (error) {
      console.log("error - " + error);
    }
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection("Proveedor");
      let result = await collection.find().project({
        "_id":0, 
      }).toArray()
      result.map(x=>{
          if(x.idProveedor == DatosProducto.idProveedor){
            DatosProveedor=x
          }
      })
    } catch (error) {
      console.log("error - " + error);
    }  
  
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection("OrdenServicio");
      let result = await collection.find().project({
        "_id":0,
        "TipoOrdenServicio":0,
        "IdOrdenServicio":0
      }).toArray()
      result.map(x=>{
          if(x.IdServicioEscogido == IdServicioEscogido){
            console.log(x)
            CodOrdenServ=x
          }
      })
    } catch (error) {
      console.log("error - " + error);
    }  
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection("ReservaCotizacion");
      let result = await collection.find().project({
        "_id":0,
      }).toArray()
      result.map(x=>{
          if(x.IdReservaCotizacion == DatosServEscogido.IdReservaCotizacion){
            DatosReservaCotizacion=x
          }
      })
    } catch (error) {
      console.log("error - " + error);
    }  
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection("ClienteProspecto");
      let result = await collection.find().project({
        "_id":0
      }).toArray()
      result.map(x=>{
          if(x.IdClienteProspecto == DatosReservaCotizacion.IdClienteProspecto){
            DatosClienteProspecto=x
          }
      })
    } catch (error) {
      console.log("error - " + error);
    } finally {
      client.close
    }  
  } else if (TipoOrdenServicio == "A" || TipoOrdenServicio == "B") 
    { 
    try {
      await client.connect();
      const dbo = client.db(dbName);
      const collection = dbo.collection("ReservaCotizacion");
  
      let result = await collection.find({}).project({
        "_id":0, 
      }).toArray()
      result.map(x=>{
          if (x.IdReservaCotizacion == IdServicioEscogido) {
            DatosReservaCotizacion=x
          }
      })
    } catch (error) {
      console.log("error - " + error);
    } 
    try {
      let tempArrayDatosServicioEscogido = []
      const dbo = client.db(dbName);
      const collection = dbo.collection("ServicioEscogido");
  
      let result = await collection.find({}).project({
        "_id":0, 
      }).toArray()
      result.map(x=>{
          if (x.IdReservaCotizacion == IdServicioEscogido) {
            tempArrayDatosServicioEscogido.push(x)
          }
      })
      DatosServEscogido=tempArrayDatosServicioEscogido
    } catch (error) {
      console.log("error - " + error);
    } 
    try {
      let tempArrayDatosProductoHoteles = []
      let tempServiciohoteles = []
      const dbo = client.db(dbName);
      const collection = dbo.collection("ProductoHoteles");
      let result = await collection.find().project({
        "_id":0,
      }).toArray()
      
      DatosServEscogido.map(datos=>{
        if (datos.IdServicioProducto.slice(0,2)=="PH") {
          tempServiciohoteles.push(datos)
        }
      })
      result.map((x)=>{
          if(x.IdProductoHotel == tempServiciohoteles[0].IdServicioProducto){
            tempArrayDatosProductoHoteles.push(x)
          }
      })
      DatosProducto=tempArrayDatosProductoHoteles
    } catch (error) {
      console.log("error - " + error);
    }
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection("Proveedor");
      let result = await collection.find().project({
        "_id":0,
      }).toArray()
      // DatosProducto.map((y)=>{
      //   if (x.idProveedor) {
          
      //   }
      // })
      /*Validar que pase esto solo si el proveedor es igual*/
      result.map(x=>{
          if(x.idProveedor == DatosProducto[0].idProveedor){
            DatosProveedor=x
          }
      })
    } catch (error) {
      console.log("error - " + error);
    }    
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection("OrdenServicio");
      let result = await collection.find().project({
        "_id":0,
        "TipoOrdenServicio":0,
        "IdOrdenServicio":0
      }).toArray()
      result.map(x=>{
          if(x.IdServicioEscogido == IdServicioEscogido){
            console.log(x)
            CodOrdenServ=x
          }
      })
    } catch (error) {
      console.log("error - " + error);
    }  
    try {
      const dbo = client.db(dbName);
      const collection = dbo.collection("ClienteProspecto");
      let result = await collection.find().project({
        "_id":0
      }).toArray()
      result.map(x=>{
          if(x.IdClienteProspecto == DatosReservaCotizacion.IdClienteProspecto){
            DatosClienteProspecto=x
          }
      })
    } catch (error) {
      console.log("error - " + error);
    } finally {
      client.close
    }  
  }else{
    res.status("Ingreso una Orden de Servicio Inexistente")
  }
  
  return {
      props:{
        DatosServEscogido:DatosServEscogido, 
        DatosProducto:DatosProducto, 
        DatosProveedor:DatosProveedor, 
        CodOrdenServ:CodOrdenServ,
        DatosClienteProspecto:DatosClienteProspecto,
        DatosReservaCotizacion:DatosReservaCotizacion
  }};
}