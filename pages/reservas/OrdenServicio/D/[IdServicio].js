import CampoTexto from '@/components/Formulario/CampoTexto/CampoTexto'
import CampoGranTexto from '@/components/Formulario/CampoGranTexto/CampoGranTexto'
import MaterialTable from "material-table";
import Router from 'next/router'
import { useEffect, useState } from 'react'
import {useRouter} from 'next/router'
import { MongoClient } from "mongodb";

export default function OrdenServicioTipoD ({Datos,DatosOrdenD}){

    let DatosAcualizado = {}

    const router = useRouter()
    const {IdServicio} = router.query

    function setData (key,data){
      DatosAcualizado[key] = data
    }
    
    const [dataActualizada, setDataActualizada] = useState({})
    const [datosTabla, setDatosTabla] = useState([{

        NomPasa: DatosOrdenD.NomPasa, 
        NumPasa: DatosOrdenD.NumPasa,
        DetalleSer: DatosOrdenD.DetalleSer,
        Observaciones: DatosOrdenD.Observaciones,

    }])

    const [modoEdicion, setModoEdicion] = useState(false)
    const [darDato,setDarDato]  = useState(false)

    /*Crear en la base de Datos del Tipo de orden que pertenezca juntando 
    DatosReservaCotizacion y ServicioSeleccionado*/
    useEffect(()=>{
      fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioD`,{
          method:"POST",
          headers:{"Content-Type": "application/json"},
          body: JSON.stringify({
          data: Datos,
          accion: "create",
          }),
      })
      .then(r=>r.json())
      .then(data=>{
          alert(data.message);
      })
    },[])
    /*Setea dar dato a los campo texto*/
    useEffect(()=>{
        if (darDato == true) {
            setDataActualizada(DatosAcualizado)
            setDarDato(false)
        }
    },[darDato])
    /*Actualiza losa datos quee se setean al guardar con el lapiz*/
    useEffect(async () =>{
      if (Object.keys(dataActualizada).length===0) {
            console.log("Vacio")
            // console.log(dataActualizada)
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
  },[dataActualizada])


    const Columnas = [
        { title: "ID", field: "IdPasajero", hidden: true},
        { title: "Nombre Pasajero", field: "NomPasa"},
        { title: "Numero de Pasajeros", field: "NumPasa", type:"numeric"},
        { title: "Detalles de Servicio", field: "DetalleSer"},
        { title: "Observaciones", field: "Observaciones"},
    ]
   
    const showtitulos = ["Orden"]

    const showOrden = [
        {
            Title: "Codigo de Grupo",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenD.CodGrupo,
            DevolverDatoFunct: setData,
            KeyDato: "CodGrupo",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Codigo de Servicio",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenD.CodServicio,
            DevolverDatoFunct: setData,
            KeyDato: "CodServicio",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Tipo de Orden",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenD.OrdenServicio.TipoOrden,
            DevolverDatoFunct: setData,
            KeyDato: "TipOrden",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Direccion",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenD.Direccion,
            // Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Direccion",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Telefono",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenD.Telefono,
            // Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Telefono",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Idioma",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenD.Idioma,
            // Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Idioma",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
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
            <div>
                <h1>{showtitulos[0]}</h1>
                {showOrden.map(prop =>
                    // console.log(prop)
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
            </div>
            <MaterialTable
                title= "Datos Pasajero"
                data= {datosTabla}
                columns= {Columnas}
                editable={{
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          const dataUpdate = [...datosTabla];
                          const index = oldData.tableData.id;
                          dataUpdate[index] = newData;
                          setDatosTabla([...dataUpdate]);
  
                          fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioD`,{
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
    let DatosOrdenD = {}

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
        const collection = dbo.collection("DatoOrdenTipoD");

        let result = await collection.find({}).project({
          "_id":0, 
        }).toArray()
        result.map(x=>{
            if(x.IdServicioEscogido==IdServicioEscogido){
                DatosOrdenD=x
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
            Datos:Datos, DatosOrdenD:DatosOrdenD
    }}
}