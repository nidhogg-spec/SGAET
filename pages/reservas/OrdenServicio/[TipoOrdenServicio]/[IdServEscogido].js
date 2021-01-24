import CampoTexto from '@/components/Formulario/CampoTexto/CampoTexto'
import MaterialTable from "material-table";
import AutoFormulario_v2 from "@/components/Formulario_V2/AutoFormulario/AutoFormulario"
import {withSSRContext} from 'aws-amplify'
import { useEffect, useState } from 'react'
import {useRouter} from 'next/router'
// import { MongoClient } from "mongodb";

export default function OrdenServicioTipoC ({}){
  const router = useRouter()

  const {IdServicio,TipoOrdenServicio} = router.query

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
    { title: "ID", field: "IdCliente", hidden: true},
    { title: "Nombre", field: "Nombre"},
    { title: "Apellido", field: "Apellido"},
    { title: "Hotel", field: "Hotel"},
    { title: "Ciudad", field: "Ciudad"},
    { title: "Tren Ida", field: "TrenIda"},
    { title: "Tren Retorno", field: "TrenRetor"},
    { title: "Hotel Mapi", field: "HotelMapi"},
    { title: "BUS OW - R/T", field: "Bus"},
    { title: "ENTRADA MP-MH-MM", field: "Entradas"},
    { title: "ADT/EST", field: "EtapaVida"},
    { title: "Cena", field: "Cena"},
    { title: "Regimen Alimenticio", field: "Regimen"},   
  ]

  /* Columnas Tabla Orden de Servicio B*/
  const ColumnasPasajeros = [
    { title: "ID", field: "IdCliente", hidden: true},
    { title: "Nombres Apellidos", field: "NomApelli"},
    { title: "Etapa Vida", field: "EtapaVida"},
    { title: "Alimentacion Extra", field: "AlimenExtra"},
    { title: "Regimen Alimenticio", field: "RegAlimentacion"},
  ]
  const ColumnasBriefing = [
    { title: "ID", field: "IdBriefing", hidden: true},
    { title: "Fecha", field: "Fecha"},
    { title: "Hora", field: "Hora"},
    { title: "Lugar", field: "Lugar"},
  ]
  const ColumnasEquipoCamping = [
    { title: "ID", field: "IdCamping", hidden: true},
    { title: "Carpa", field: "Carpa"},
    { title: "Sleeping", field: "Sleeping"},
    { title: "Matra", field: "Matra"},
    { title: "Duffel", field: "Duffel"},
    { title: "Baston", field: "Baston"},
  ]
  const ColumnasTrenes = [
    { title: "ID", field: "IdTrenes", hidden: true},
    { title: "Tipo", field: "Tipo"},
    { title: "TrenIda", field: "TrenIda"},
    { title: "TrenRetorno", field: "TrenRetorno"},
  ]
  const ColumnasHoteles = [
    { title: "ID", field: "IdHotel", hidden: true},
    { title: "Ciudad", field: "Ciudad"},
    { title: "Hotel", field: "Hotel"},
    { title: "Noche Extra", field: "NocheExtra"},
  ]
  const ColumnasBuses = [
    { title: "ID", field: "IdBuses", hidden: true},
    { title: "OW - R/T", field: "OWRT"},
  ]
  const ColumnasEntrada = [
    { title: "ID", field: "IdEntradas", hidden: true },
    { title: "Entrada", field: "entradas" }
  ]

  /* Columnas Tabla Orden de Servicio C*/
  const ColumnasPasajero = [
    { title: "ID", field: "IdPasajero", hidden: true},
    { title: "Nombres", field: "nombre"},
    { title: "Apellido", field: "apellido"},
    { title: "Ciudad", field: "ciudad"},
    { title: "Hotel", field: "hotel"},
    { title: "Observaciones", field: "observaciones"},
  ]
  const ColumnasTransporte = [
    { title: "ID", field: "IdTransporte", hidden: true},
    { title: "Fecha", field: "fecha", type:"date"},
    { title: "Servicio", field: "descripcionServicio"},
    { title: "Hora Recojo", field: "horaRecojo"},
    { title: "Tren", field: "tren"},
    { title: "Origen", field: "origen"},
    { title: "Destino", field: "destino"},
    { title: "Observaciones", field: "observaciones"},
  ]
    
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
                    KeyDato: "CodOrdenServ"
                  },
                  {
                    tipo: "texto",
                    Title: "Codigo de Grupo",
                    KeyDato: "CodGrupo"
                  },
                  {
                    tipo: "texto",
                    Title: "Tour: ",
                    KeyDato:  "tour",
                  },
                  {
                    tipo: "texto",
                    Title: "Guia: ",
                    KeyDato:  "guia",
                  },
                  {
                    tipo: "texto",
                    Title: "Asistente: ",
                    KeyDato:  "asistente",
                  },
                  {
                    tipo: "fecha",
                    Title: "Fecha: ",
                    KeyDato:  "fecha",
                  },
                  {
                    tipo: "numero",
                    Title: "N° Pax: ",
                    KeyDato:  "numPax",
                  },
                  {
                    tipo: "numero",
                    Title: "N° Porters: ",
                    KeyDato: "numPorte",
                  },
                  {
                    tipo: "texto",
                    Title: "Transporte : ",
                    KeyDato:  "trasnporte",
                  },
                  {
                    tipo: "texto",
                    Title: "Nombre de Grupo: ",
                    KeyDato:  "nomGrupo",
                  },  
                  {
                    tipo: "texto",
                    Title: "Anexo: ",
                    KeyDato:  "anexo",
                  },
                  {
                    tipo: "texto",
                    Title: "Ingreso: ",
                    KeyDato:  "ingreso",
                  },
                  {
                    tipo: "numero",
                    Title: "Nº Box Lunch :",
                    KeyDato:  "boxLunch",
                  },
                  {
                    tipo: "numero",
                    Title: "N° Botiquin : ",
                    KeyDato:  "botiquin",
                  },
                  {
                    tipo: "texto",
                    Title: "N° Primeros Auxilios : ",
                    KeyDato:  "primerosAuxilios",
                  },
                  {
                    tipo: "numero",
                    Title: "Imprevistos(S/.) : ",
                    KeyDato:  "imprevistosSoles",
                  },
                  {
                    tipo: "numero",
                    Title: "Imprevistos(US $) : ",
                    KeyDato:  "imprevistosDolares",
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
                KeyDato:  "fecha",
                },
                {
                tipo: "numero",
                Title: "N° Paxs: ",
                KeyDato:  "numPax",
                },
                {
                tipo: "texto",
                Title: "Guia: ",
                KeyDato:  "guia",
                },
                {
                tipo: "texto",
                Title: "Guia: ",
                KeyDato:  "guia",
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
            data={[]}
            columns= {ColumnasEntrada}
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
                    KeyDato: "empresa"
                  },
                  {
                    tipo: "texto",
                    Title: "Codigo de Grupo",
                    KeyDato: "CodGrupo"
                  },
                  {
                    tipo: "texto",
                    Title: "Tour: ",
                    KeyDato:  "tour",
                  },
                  {
                    tipo: "numero",
                    Title: "N° Pax: ",
                    KeyDato:  "numPax",
                  },
                  {
                    tipo: "texto",
                    Title: "Tipo de Tranporte: ",
                    KeyDato:  "tipTranporte",
                  },
                  {
                    tipo: "numero",
                    Title: "Capacidad: ",
                    KeyDato:  "capacidad",
                  },
                  {
                    tipo: "fecha",
                    Title: "Fecha IN: ",
                    KeyDato:  "fechaIn",
                  },
                  {
                    tipo: "fecha",
                    Title: "Fecha OUT: ",
                    KeyDato:  "fechaOut",
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
          />
          <MaterialTable
            title= "Datos Transporte"
            data={datosTablaTransporte}
            columns= {ColumnasTransporte}
            editable={{
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
                      Title: "Idioma: ",
                      KeyDato:  "idioma",
                    },
                    {
                      tipo: "texto",
                      Title: "A Nombre de PAX: ",
                      KeyDato:  "pax",
                    },
                    {
                      tipo: "texto",
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
    
    return {
        props:{
           
    }}
}