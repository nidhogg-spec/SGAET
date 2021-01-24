import MaterialTable from "material-table";
import AutoFormulario_v2 from "@/components/Formulario_V2/AutoFormulario/AutoFormulario"
import { useEffect, useState } from 'react'
import {useRouter} from 'next/router'
import { MongoClient } from "mongodb";

export default function OrdenServicioTipoB ({}){
    let DatosAcualizado = {}

    const router = useRouter()
    const {IdServicio,TipoOrdenServicio} = router.query

    console.log(TipoOrdenServicio)
    
    const [dataGrupo, setDataGrupo] = useState({})

    const [dataGrupoNombre, setDataGrupoNombre] = useState({})

    const [dataExtra, setDataExtra] = useState({})

    const [dataEquipoPax, setDataEquipoPax] = useState({})

    const [dataEquipoStaff, setDataEquipoStaff] = useState({})

    const [datosTablaPasajeros, setDatosTablaPasajeros] = useState()
   
    const [datosTablaBriefing, setDatosTablaBriefing] = useState()
    
    const [datosTablaEquipoCamping, setDatosTablaEquipoCamping] = useState()
    
    const [datosTablaTrenes, setDatosTablaTrenes] = useState()
    
    const [datosTablaHoteles, setDatosTablaHoteles] = useState()
    
    const [datosTablaBuses, setDatosTablaBuses] = useState()
    
    const [modoEdicion, setModoEdicion] = useState(false)
    

    /*Crear en la base de Datos del Tipo de orden que pertenezca juntando 
    DatosReservaCotizacion y ServicioSeleccionado*/
    // useEffect(()=>{
    //   fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioB`,{
    //       method:"POST",
    //       headers:{"Content-Type": "application/json"},
    //       body: JSON.stringify({
    //       data: Datos,
    //       accion: "create",
    //       }),
    //   })
    //   .then(r=>r.json())
    //   .then(data=>{
    //       alert(data.message);
    //   })
    // },[])
    /*Setea dar dato a los campo texto*/
    /*Actualiza losa datos quee se setean al guardar con el lapiz*/
    // useEffect(async () =>{
    //   if (Object.keys(dataActualizada).length===0) {
    //         console.log("Vacio")
    //         // console.log(dataActualizada)
    //     }else{
    //         fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioB`,{
    //             method:"POST",
    //             headers:{"Content-Type": "application/json"},
    //             body: JSON.stringify({
    //             idProducto: DatosOrdenB.IdOrdenServTipB,
    //             data: dataActualizada,
    //             accion: "update",
    //             }),
    //         })
    //         .then(r=>r.json())
    //         .then(data=>{
    //             alert(data.message);
    //         })
    //     }
    // },[dataActualizada])

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
    return(
        <div>
          <img
            src="/resources/save-black-18dp.svg"
            onClick={() => {
                setDarDato(true);
                setModoEdicion(false)
                // ReiniciarData()
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
                  },
                ],
              },
            ],
            }}
            ModoEdicion={modoEdicion}
            Dato={dataGrupo}
            setDato={setDataGrupo}
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
                  },
                ],
              },
            ],
            }}
            ModoEdicion={modoEdicion}
            Dato={dataGrupoNombre}
            setDato={setDataGrupoNombre}
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
                  },
                ],
              },
            ],
            }}
            ModoEdicion={modoEdicion}
            Dato={dataExtra}
            setDato={setDataExtra}
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
                    },
                  ],
                },
              ],
            }}
            ModoEdicion={modoEdicion}
            Dato={dataEquipoPax}
            setDato={setDataEquipoPax}
            key={'OB_Extras'}
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
            Dato={dataEquipoStaff}
            setDato={setDataEquipoStaff}
            key={'OB_Extras'}
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
    )
}

export async function getServerSideProps(context){

    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;

    let DatosServEscogido=[]
    let DatosReservCotizacion=[]

    let Datos = {}
    let DatosOrdenB = {}

    let IdServicioEscogido = context.query.IdServicio

    // console.log(idClienteFront)
    
    let client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    /* Consulta para extraer los datos de Clientes */
    try {
      let client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const dbo = client.db(dbName);
      const collection = dbo.collection("ServicioEscogido");

      let result = await collection.find({}).project({
        "_id":0, 
      }).toArray()
      result.map(x=>{
          if(x.IdServicioEscogido==IdServicioEscogido){
              DatosServEscogido=x
          }
      })
    } catch (error) {
      console.log("error - " + error);
    } 
    finally{
      client.close();
    }
    try {
        let client = new MongoClient(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        client = new MongoClient(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        await client.connect();
        const dbo = client.db(dbName);
        const collection = dbo.collection("ReservaCotizacion");
  
        let result = await collection.find({}).project({
          "_id":0, 
        }).toArray()
        result.map(x=>{
            if(x.IdReservaCotizacion==DatosServEscogido.IdReservaCotizacion){
                DatosReservCotizacion=x
            }
        })
      } catch (error) {
        console.log("error - " + error);
      } 
      finally{
        client.close();
      }
      try {
        let client = new MongoClient(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        client = new MongoClient(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        await client.connect();
        const dbo = client.db(dbName);
        const collection = dbo.collection("DatoOrdenTipoB");

        let result = await collection.find({}).project({
          "_id":0, 
        }).toArray()
        result.map(x=>{
            if(x.IdServicioEscogido==IdServicioEscogido){
                DatosOrdenB=x
            }
        })
      } catch (error) {
        console.log("error - " + error);
      } 
      finally{
        client.close();
      }

      Datos= Object.assign(DatosReservCotizacion,DatosServEscogido)
  
    return {
        props:{
            Datos:Datos, DatosOrdenB:DatosOrdenB
    }}
}