import AutoFormulario_v2 from "@/components/Formulario_V2/AutoFormulario/AutoFormulario"
import { useEffect, useState } from 'react'
import {useRouter} from 'next/router'
import { MongoClient } from "mongodb";
import {Auth, withSSRContext} from 'aws-amplify'

export default function OrdenServicioTipoD ({DatosOrdenD}){

    console.log(DatosOrdenD)
    
    const router = useRouter()
    //const {IdServicio} = router.query

    // function setData (key,data){
    //   DatosAcualizado[key] = data
    // }
    
    const [dataActualizada, setDataActualizada] = useState(DatosOrdenD)
    const [modoEdicion, setModoEdicion] = useState(false)
    /*Crear en la base de Datos del Tipo de orden que pertenezca juntando 
    DatosReservaCotizacion y ServicioSeleccionado*/
    useEffect(()=>{
      fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioD`,{
          method:"POST",
          headers:{"Content-Type": "application/json"},
          body: JSON.stringify({
          data: dataActualizada,
          accion: "create",
          }),
      })
      .then(r=>r.json())
      .then(data=>{
          alert(data.message);
      })
    },[])
    /*Setea dar dato a los campo texto*/
    // useEffect(()=>{
    //     if (darDato == true) {
    //         setDataActualizada(DatosAcualizado)
    //         setDarDato(false)
    //     }
    // },[darDato])
    /*Actualiza losa datos quee se setean al guardar con el lapiz*/
  // useEffect(async () =>{
  //   if (Object.keys(dataActualizada).length===0) {
  //         console.log("Vacio")
  //         // console.log(dataActualizada)
  //     }else{
  //         fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioD`,{
  //             method:"POST",
  //             headers:{"Content-Type": "application/json"},
  //             body: JSON.stringify({
  //             idProducto: DatosOrdenD.IdOrdenServTipD,
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
    function SaveOrdenServicio(){
      console.log(dataActualizada)
      if (Object.keys(dataActualizada).length===0) {
          console.log("Vacio")
      }else{
        fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioD`,{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({
            idProducto: DatosOrdenD.IdOrdenServTipD,
            data: dataActualizada,
            accion: "update",
            }),
        })
        .then(r=>r.json())
        .then(data=>{
            alert(data.message);
        })
      }
    }
  return(
      <div>
        <img
          src="/resources/save-black-18dp.svg"
          onClick={() => {
              setModoEdicion(false)
              SaveOrdenServicio()
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
        <h1>Orden de Servicio - Restaurante</h1>
        <AutoFormulario_v2
          Formulario={{
          title: "Lista de Pasajeros",
          secciones: [
              {
              subTitle: "",
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
          Dato={dataActualizada}
          setDato={setDataActualizada}
          key={'AF_ReserCoti'}
        />
      </div>
    )
}
export async function getServerSideProps({params,req,res}){

  // let IdServicioEscogido = context.query.IdServicio
  const { Auth } = withSSRContext({ req })

  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  let IdReservaCotizacion = ""
  let idServicio = params.IdServicio

  let Datos = {}
  let DatosOrdenD = {}
  let numPax = 0

  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // const user = await Auth.currentAuthenticatedUser()
    // console.log(user)
  } catch (err) {
    res.writeHead(302, { Location: '/' })
    res.end()
  }
  try {
    await client.connect();
    const dbo = client.db(dbName);
    const collection = dbo.collection("ServicioEscogido");
    let result = await collection.find({}).project({
      "_id":0,
      "PrecioConfiTotal":0,
      "PrecioConfiUnitario":0,
      "PrecioCotiTotal":0,
      "PrecioCotiUnitario":0,
      "PrecioPublicado":0,
    }).toArray()
    result.map((x)=>{
      if (x.IdServicioEscogido==idServicio) {
        DatosOrdenD=x
        IdReservaCotizacion=x.IdReservaCotizacion
      }
    })
  } catch (error) {
    console.log(error)
  }
  console.log(DatosOrdenD)
  try {
    await client.connect();
    const dbo = client.db(dbName);
    const collection = dbo.collection("ReservaCotizacion");
    let result = await collection.find({}).project({
      "_id":0,
      "Incluye":0,
      "Itinerario":0,
      "NoIncluye":0,
      "PrecioConfiTotal":0,
      "PrecioConfiUnitario":0,
      "PrecioCotiTotal":0,
      "PrecioCotiUnitario":0,
      "PrecioPublicado":0,
      "RecomendacionesLlevar":0,
      "tableData":0,
    }).toArray()
    result.map((x)=>{
      if (x.IdReservaCotizacion==IdReservaCotizacion) {
        Datos=x
      }
    })
  } catch (error) {
    console.log(error)
  }
  DatosOrdenD = Object.assign(DatosOrdenD,Datos)
  return {
      props:{
          DatosOrdenD:DatosOrdenD
  }}
}