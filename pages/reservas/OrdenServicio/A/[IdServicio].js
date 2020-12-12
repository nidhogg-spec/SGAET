import CampoTexto from '@/components/Formulario/CampoTexto/CampoTexto'
import MaterialTable from "material-table";
import { useEffect, useState } from 'react'
import {useRouter} from 'next/router'
import { MongoClient } from "mongodb";

export default function OrdenServicioTipoC ({Datos,DatosOrdenA}){
    let DatosAcualizado = {}
    const router = useRouter()
    const {IdServicio} = router.query

    function setData (key,data){
      DatosAcualizado[key] = data
    }
    
    const [dataActualizada, setDataActualizada] = useState({})
    const [datosTabla, setDatosTabla] = useState([
        {
            NomApelli: DatosOrdenA.NomApelli, 
            Hotel: DatosOrdenA.Hotel,
            TrenIda: DatosOrdenA.FechaIN,
            TrenRetor: DatosOrdenA.FechaFin,
            Regimen: DatosOrdenA.Regimen,
            Entradas: DatosOrdenA.Entradas
        }])

    const [modoEdicion, setModoEdicion] = useState(false)
    const [darDato,setDarDato]  = useState(false)

    /*Crear en la base de Datos del Tipo de orden que pertenezca juntando 
    DatosReservaCotizacion y ServicioSeleccionado*/
    useEffect(()=>{
      fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioA`,{
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
            fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioA`,{
                method:"POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({
                idProducto: DatosOrdenA.IdOrdenServTipA,
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
    { title: "ID", field: "IdCliente", hidden: true},
    { title: "Nombres Apellidos", field: "NomApelli"},
    { title: "Hotel", field: "Hotel"},
    { title: "Tren Ida", field: "TrenIda"},
    { title: "Tren Retorno", field: "TrenRetor"},
    { title: "Regimen Alimenticio", field: "Regimen"},
    { title: "Entradas", field: "Entradas"},
]

const showtitulos = ["Orden","Datos de Grupo"]

const showOrden = [
    {
        Title: "Codigo de Grupo",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.CodGrupo,
        DevolverDatoFunct: setData,
        KeyDato: "CodGrupo",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
    {
        Title: "Codigo de Servicio",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.OrdenServicio.CodigoOrdenServicio,
        DevolverDatoFunct: setData,
        KeyDato: "CodigoOrdenServicio",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
    {
        Title: "Tipo de Orden",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.OrdenServicio.TipoOrden,
        DevolverDatoFunct: setData,
        KeyDato: "TipOrden",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
]

const showDatosGrupo = [
    {
        Title: "Tour",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.Tour,
        DevolverDatoFunct: setData,
        KeyDato: "Tour",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
    {
        Title: "Guia",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.Guia,
        //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
        DevolverDatoFunct: setData,
        KeyDato: "Guia",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
    {
        Title: "Asistencia",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.Asistencia,
        //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
        DevolverDatoFunct: setData,
        KeyDato: "Asistencia",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
    {
        Title: "Fecha",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.Fecha,
        //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
        DevolverDatoFunct: setData,
        KeyDato: "Fecha",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
    {
        Title: "Numero de Pasajeros",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.modoEdicion,
        //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
        DevolverDatoFunct: setData,
        KeyDato: "NumPasajeros",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
    {
        Title: "Tranporte",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.Tranporte,
        //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
        DevolverDatoFunct: setData,
        KeyDato: "Tranporte",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
    {
        Title: "Numero de porteadores",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.NumPorte,
        //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
        DevolverDatoFunct: setData,
        KeyDato: "NumPorte",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
    {
        Title: "Nombre Grupo",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.NombreGrupo,
        //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
        DevolverDatoFunct: setData,
        KeyDato: "NombreGrupo",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
    {
        Title: "Anexo",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.Anexo,
        //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
        DevolverDatoFunct: setData,
        KeyDato: "Anexo",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
    {
        Title: "Ingreso",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.Ingreso,
        //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
        DevolverDatoFunct: setData,
        KeyDato: "Ingreso",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
    {
        Title: "N box lunch",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.NumLunch,
        //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
        DevolverDatoFunct: setData,
        KeyDato: "NumLunch",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
    {
        Title: "N Botiquin",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.NumBotiquin,
        //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
        DevolverDatoFunct: setData,
        KeyDato: "NumBotiquin",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
    {
        Title: "Primeros Auxilios",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.PrimAuxilios,
        //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
        DevolverDatoFunct: setData,
        KeyDato: "PrimAuxilios",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
    {
        Title: "Imprevisto S/.",
        ModoEdicion: modoEdicion,
        Dato: DatosOrdenA.ImprevistoSoles,
        //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
        DevolverDatoFunct: setData,
        KeyDato: "ImprevistoSoles",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
    {
        Title: "Imprevisto $",
        ModoEdicion : modoEdicion,
        Dato: DatosOrdenA.ImprevistoDolares,
        DevolverDatoFunct: setData,
        KeyDato: "ImprevistoDolares",// esto es igual al campo
        DarDato: darDato,
        Reiniciar: false
    },
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
          <div>
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
              {showDatosGrupo.map(prop =>
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
            <MaterialTable
              title= "Datos Transporte"
              data={datosTabla}
              columns= {Columnas}
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
    let DatosOrdenA = {}

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
        const collection = dbo.collection("DatoOrdenTipoA");

        let result = await collection.find({}).project({
          "_id":0, 
        }).toArray()
        result.map(x=>{
            if(x.IdServicioEscogido==IdServicioEscogido){
                DatosOrdenA=x
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
            Datos:Datos, DatosOrdenA:DatosOrdenA
    }}
}