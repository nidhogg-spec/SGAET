import CampoTexto from '@/components/Formulario/CampoTexto/CampoTexto'
import CampoGranTexto from '@/components/Formulario/CampoGranTexto/CampoGranTexto'
import MaterialTable from "material-table";
import Router from 'next/router'
import { useEffect, useState } from 'react'
import {useRouter} from 'next/router'
import { MongoClient } from "mongodb";

export default function OrdenServicioTipoB ({Datos,DatosOrdenB}){
    let DatosAcualizado = {}
    console.log(DatosOrdenB)
    const router = useRouter()
    const {IdServicio} = router.query

    function setData (key,data){
      DatosAcualizado[key] = data
    }
    
    const [dataActualizada, setDataActualizada] = useState({})

    const [datosTablaPasajeros, setDatosTablaPasajeros] = useState([
        {
            NomApelli: DatosOrdenB.NomApelli, 
            EtapaVida: DatosOrdenB.EtapaVida,
            AlimentacionExtra: DatosOrdenB.AlimentacionExtra,
            RegimenAlimenticio: DatosOrdenB.RegimenAlimenticio
        }])
   
    const [datosTablaBriefing, setDatosTablaBriefing] = useState([
        {
            Fecha: DatosOrdenB.Fecha, 
            Hora: DatosOrdenB.Hora,
            Lugar: DatosOrdenB.Lugar,
        }])
    
    const [datosTablaEquipoCamping, setDatosTablaEquipoCamping] = useState([
        {
            Carpa: DatosOrdenB.Carpa, 
            Sleeping: DatosOrdenB.Sleeping,
            Matra: DatosOrdenB.Matra,
            Duffel: DatosOrdenB.Duffel,
            Baston: DatosOrdenB.Baston
        }])
    
    const [datosTablaTrenes, setDatosTablaTrenes] = useState([
        {
            Tipo: DatosOrdenB.Tipo, 
            Tren: DatosOrdenB.Tren,
        }])
    
    const [datosTablaHoteles, setDatosTablaHoteles] = useState([
        {
            Lugar: DatosOrdenB.Lugar, 
            Hotel: DatosOrdenB.Hotel,
            NocheExtra: DatosOrdenB.NocheExtra,
        }])
    
    const [datosTablaBuses, setDatosTablaBuses] = useState([
        {
            OWRT: DatosOrdenB.OWRT, 
        }])
    
    const [modoEdicion, setModoEdicion] = useState(false)
    
    const [darDato,setDarDato]  = useState(false)

    /*Crear en la base de Datos del Tipo de orden que pertenezca juntando 
    DatosReservaCotizacion y ServicioSeleccionado*/
    useEffect(()=>{
      fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioB`,{
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
            fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioB`,{
                method:"POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({
                idProducto: DatosOrdenB.IdOrdenServTipB,
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
        { title: "Tren", field: "Tren"},
    ]
    const ColumnasHoteles = [
        { title: "ID", field: "IdHotel", hidden: true},
        { title: "Lugar", field: "Lugar"},
        { title: "Hotel", field: "Hotel"},
        { title: "Noche Extra", field: "NocheExtra"},
    ]
    const ColumnasBuses = [
        { title: "ID", field: "IdBuses", hidden: true},
        { title: "OW - R/T", field: "OWRT"},
    ]

    const showtitulos = ["Orden","Datos de Trekking"]

    const showOrden = [
        {
            Title: "Codigo de Grupo",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.CodGrupo,
            // Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "CodGrupo",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Codigo de Servicio",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.OrdenServicio.CodigoOrdenServicio,
            // Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "CodigoOrdenServicio",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Tipo de Orden",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.OrdenServicio.TipoOrden,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "TipOrden",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
    ]

    const showDatosTrekking = [
        {
            Title: "Trekking",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.Trekking,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Trekking",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Guia",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.Guia,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Guia",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Asistente",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.Asistente,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Asistente",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Cocinero",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.Cocinero,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Cocinero",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Tranporte",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.Tranporte,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Tranporte",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Punto de Acceso",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.PuntoAcceso,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "PuntoAcceso",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Oxigeno",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.Oxigeno,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "Oxigeno",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "N Botiquin",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.NumBotiquin,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "NumBotiquin",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Imprevisto S/.",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.ImprevistoSoles,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "ImprevistoSoles",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Imprevisto $",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.ImprevistoDolares,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "ImprevistoDolares",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Numero de Pasajeros",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.NumPasajeros,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "NumPasajeros",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Fecha IN",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.FechaInicio,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "FechaIN",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Fecha OUT",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.FechaFin,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "FechaOUT",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Numero Porteadores",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.NumPorte,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "NumPorte",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Numero de Arrieros",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.NumArrieros,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "NumArrieros",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Numero de Caballo Carga",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.NumCabaCarga,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "NumCabaCarga",// esto es igual al campo
            DarDato: darDato,
            Reiniciar: false
        },
        {
            Title: "Numero de Caballo Sillas",
            ModoEdicion: modoEdicion,
            Dato: DatosOrdenB.NumCabaSilla,
            //Dato: Datos.Nombre, //cambiar al conocer los datos que vienen.
            DevolverDatoFunct: setData,
            KeyDato: "NumCabaSilla",// esto es igual al campo
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
            <h1>{showtitulos[1]}</h1>
                {showDatosTrekking.map(prop =>
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