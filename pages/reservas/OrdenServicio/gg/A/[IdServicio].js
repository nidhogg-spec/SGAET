import CampoTexto from '@/components/Formulario/CampoTexto/CampoTexto'
import MaterialTable from "material-table";
import AutoFormulario_v2 from "@/components/Formulario_V2/AutoFormulario/AutoFormulario"
import {withSSRContext} from 'aws-amplify'
import { useEffect, useState } from 'react'
import {useRouter} from 'next/router'
import { MongoClient } from "mongodb";

export default function OrdenServicioTipoC ({Datos,DatosOrdenA}){
    let DatosAcualizado = {}
    const router = useRouter()
    const {IdServicio} = router.query

    const [dataActualizada, setDataActualizada] = useState({})
    const [datosTabla, setDatosTabla] = useState([])
    const [modoEdicion, setModoEdicion] = useState(false)

    // /*Crear en la base de Datos del Tipo de orden que pertenezca juntando 
    // DatosReservaCotizacion y ServicioSeleccionado*/
    // useEffect(()=>{
    //   fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioA`,{
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

    /*Actualiza los datos que se setean al guardar con el lapiz*/
  //   useEffect(async () =>{
  //     if (Object.keys(dataActualizada).length===0) {
  //           console.log("Vacio")
  //           // console.log(dataActualizada)
  //     }else{
  //         fetch(`http://localhost:3000/api/reserva/ordenServicio/ordenServicioA`,{
  //             method:"POST",
  //             headers:{"Content-Type": "application/json"},
  //             body: JSON.stringify({
  //             idProducto: DatosOrdenA.IdOrdenServTipA,
  //             data: dataActualizada,
  //             accion: "update",
  //             }),
  //         })
  //         .then(r=>r.json())
  //         .then(data=>{
  //             alert(data.message);
  //         })
  //       }
  // },[dataActualizada])

  const Columnas = [
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
        Dato={dataActualizada}
        setDato={setDataActualizada}
        key={'OA_Tours'}
      />
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

export async function getServerSideProps({params,req,res}){

    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;
    const { Auth } = withSSRContext({ req })

    let DatosServEscogido=[]
    let DatosReservCotizacion=[]

    let Datos = {}
    let DatosOrdenA = {}

    let IdServicioEscogido = params.IdServicio

    // console.log(idClienteFront)
    
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
    /* Consulta para extraer los datos de Clientes */
    try {
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
    return {
        props:{
            Datos:Datos, DatosOrdenA:DatosOrdenA
    }}
}