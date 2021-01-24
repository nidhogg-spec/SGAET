import CampoTexto from '@/components/Formulario/CampoTexto/CampoTexto'
import BotonAñadir from '@/components/BotonAnadir/BotonAnadir'
import CampoGranTexto from '@/components/Formulario/CampoGranTexto/CampoGranTexto'
import MaterialTable from "material-table";
import AutoFormulario_v2 from "@/components/Formulario_V2/AutoFormulario/AutoFormulario"
import Router from 'next/router'
import { useEffect, useState } from 'react'
import {useRouter} from 'next/router'
import { MongoClient } from "mongodb";

export default function OrdenServicioTipoC ({Datos,DatosOrdenC}){
    let DatosAcualizado = {}

    const router = useRouter()
    const {IdServicio} = router.query

    // function setData (key,data){
    //   DatosAcualizado[key] = data
    // }
    
    const [dataActualizada, setDataActualizada] = useState({})
    const [datosTablaTranporte, setDatosTablaTranporte] = useState([])
    const [datosTablaPasajero, setDatosTablaPasajero] = useState([])

    const [modoEdicion, setModoEdicion] = useState(false)
    // const [darDato,setDarDato]  = useState(false)

    /*Crear en la base de Datos del Tipo de orden que pertenezca juntando 
    DatosReservaCotizacion y ServicioSeleccionado*/
  //   useEffect(()=>{
  //     fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioC`,{
  //         method:"POST",
  //         headers:{"Content-Type": "application/json"},
  //         body: JSON.stringify({
  //         data: Datos,
  //         accion: "create",
  //         }),
  //     })
  //     .then(r=>r.json())
  //     .then(data=>{
  //         alert(data.message);
  //     })
  //   },[])
  //   /*Setea dar dato a los campo texto*/
  //   useEffect(()=>{
  //       if (darDato == true) {
  //           setDataActualizada(DatosAcualizado)
  //           setDarDato(false)
  //       }
  //   },[darDato])
  //   /*Actualiza losa datos quee se setean al guardar con el lapiz*/
  //   useEffect(async () =>{
  //     if (Object.keys(dataActualizada).length===0) {
  //           console.log("Vacio")
  //           // console.log(dataActualizada)
  //       }else{
  //           fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioC`,{
  //               method:"POST",
  //               headers:{"Content-Type": "application/json"},
  //               body: JSON.stringify({
  //               idProducto: DatosOrdenC.IdOrdenServTipC,
  //               data: dataActualizada,
  //               accion: "update",
  //               }),
  //           })
  //           .then(r=>r.json())
  //           .then(data=>{
  //               alert(data.message);
  //           })
  //       }
  // },[dataActualizada])

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

    // const showtitulos = ["Orden","Datos de Transporte"]

    // const showOrden = [
    //     {
    //         Title: "Codigo de Grupo",
    //         ModoEdicion: modoEdicion,
    //         // Dato: "",
    //         Dato: DatosOrdenC.CodGrupo, //cambiar al conocer los datos que vienen.
    //         DevolverDatoFunct: setData,
    //         KeyDato: "CodGrupo",// esto es igual al campo
    //         DarDato: darDato,
    //         Reiniciar: false
    //     },
    //     {
    //         Title: "Codigo de Servicio",
    //         ModoEdicion: modoEdicion,
    //         // Dato: "",
    //         Dato: DatosOrdenC.CodServicio, //cambiar al conocer los datos que vienen.
    //         DevolverDatoFunct: setData,
    //         KeyDato: "CodServicio",// esto es igual al campo
    //         DarDato: darDato,
    //         Reiniciar: false
    //     },
    //     {
    //         Title: "Tipo de Orden",
    //         ModoEdicion: modoEdicion,
    //         // Dato: "",
    //         Dato: DatosOrdenC.OrdenServicio.TipoOrden, //cambiar al conocer los datos que vienen.
    //         DevolverDatoFunct: setData,
    //         KeyDato: "TipOrden",// esto es igual al campo
    //         DarDato: darDato,
    //         Reiniciar: false
    //     },
    // ]

    // const showDatosTransporte= [
    //     {
    //         Title: "Empresa",
    //         ModoEdicion: modoEdicion,
    //         Dato: DatosOrdenC.Empresa, //cambiar al conocer los datos que vienen.
    //         DevolverDatoFunct: setData,
    //         KeyDato: "Empresa",// esto es igual al campo
    //         DarDato: darDato,
    //         Reiniciar: false
    //     },
    //     {
    //         Title: "Tipo de Transporte",
    //         ModoEdicion: modoEdicion,
    //         Dato: DatosOrdenC.TipoServicio, //cambiar al conocer los datos que vienen.
    //         DevolverDatoFunct: setData,
    //         KeyDato: "TipoServicio",// esto es igual al campo
    //         DarDato: darDato,
    //         Reiniciar: false
    //     },
    //     {
    //         Title: "Capacidad",
    //         ModoEdicion: modoEdicion,
    //         Dato: DatosOrdenC.Capacidad, //cambiar al conocer los datos que vienen.
    //         DevolverDatoFunct: setData,
    //         KeyDato: "Capacidad",// esto es igual al campo
    //         DarDato: darDato,
    //         Reiniciar: false
    //     },
    //     {
    //         Title: "Numero de Pasajeros",
    //         ModoEdicion: modoEdicion,
    //         Dato: DatosOrdenC.Npasajeros, //cambiar al conocer los datos que vienen.
    //         DevolverDatoFunct: setData,
    //         KeyDato: "Npasajeros",// esto es igual al campo
    //         DarDato: darDato,
    //         Reiniciar: false
    //     },
    //     {
    //         Title: "Fecha IN",
    //         ModoEdicion: modoEdicion,
    //         Dato: DatosOrdenC.FechaInicio, //cambiar al conocer los datos que vienen.
    //         DevolverDatoFunct: setData,
    //         KeyDato: "FechaInicio",// esto es igual al campo
    //         DarDato: darDato,
    //         Reiniciar: false
    //     },
    //     {
    //         Title: "Fecha OUT",
    //         ModoEdicion: modoEdicion,
    //         Dato: DatosOrdenC.FechaFin, //cambiar al conocer los datos que vienen.
    //         DevolverDatoFunct: setData,
    //         KeyDato: "FechaFin",// esto es igual al campo
    //         DarDato: darDato,
    //         Reiniciar: false
    //     },
    // ]

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
          {/* <div>
              <h1>{showtitulos[0]}</h1>
              {showOrden.map(prop =>
                <CampoTexto
                    Title= {prop.Title}
                    ModoEdicion={prop.ModoEdicion}
                    Dato={prop.Dato}
                    DevolverDatoFunct={prop.DevolverDatoFunct}
                    DarDato={prop.DarDato}
                    KeyDato={prop.KeyDato}
                    Reiniciar={prop.Reiniciar}
                />
              )}
          </div>
          <div>
          <h1>{showtitulos[1]}</h1>
              {showDatosTransporte.map(prop =>
                <CampoTexto
                    Title= {prop.Title}
                    ModoEdicion={prop.ModoEdicion}
                    Dato={prop.Dato}
                    DevolverDatoFunct={prop.DevolverDatoFunct}
                    DarDato={prop.DarDato}
                    KeyDato={prop.KeyDato}
                    Reiniciar={prop.Reiniciar}
                />
              )}
          </div> */}
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
                    },
                  ],
                },
              ],
            }}
            ModoEdicion={modoEdicion}
            Dato={dataActualizada}
            setDato={setDataActualizada}
            key={'OC_Tranporte'}
          />
          <MaterialTable
              title= "Datos Pasajero"
              data={datosTablaPasajero}
              columns= {ColumnasPasajero}
          />
            <MaterialTable
              title= "Datos Transporte"
              data={datosTablaTranporte}
              columns= {ColumnasTransporte}
              editable={{
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        const dataUpdate = [...datosTablaTranporte];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                        setDatosTablaTranporte([...dataUpdate]);

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
    )
}

export async function getServerSideProps(context){

    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;

    let DatosServEscogido=[]
    let DatosReservCotizacion=[]

    let Datos = {}
    let DatosOrdenC = {}

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
        const collection = dbo.collection("DatoOrdenTipoC");

        let result = await collection.find({}).project({
          "_id":0, 
        }).toArray()
        result.map(x=>{
            if(x.IdServicioEscogido==IdServicioEscogido){
                DatosOrdenC=x
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
            Datos:Datos, DatosOrdenC:DatosOrdenC
    }}
}