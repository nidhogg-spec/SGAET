import MaterialTable,{ MTableToolbar } from "material-table";
import Router from 'next/router'
import Selector from '@/components/Formulario/Selector/Selector'
import BotonAnadir from 'components/BotonAnadir/BotonAnadir'
import CampoTexto from '@/components/Formulario/CampoTexto/CampoTexto'

import { MongoClient } from "mongodb";

import { useEffect, useState } from "react";

export default function Home({datosPeriodo, datosProv, idEvaACt}){      

  // var x = Datos.concat(datosProv)
  // console.log(x)
    // var toChild = datosProv.toArray()
    // convertToReactObject(datosProv)
    // console.log(Datos)
    // let y = {}
    //y[x.nombre] indica que la key del objeto y va a ser en este caso el mismo nombre
    // datosProv.map((x)=>{
    //   y[x.nombre]= x.nombre
    // })

    // console.log(datosPeriodo[0].periodo)

    
    let arrayEvaluacion = []
    let objetoDatos = {}
    const [datoPeriodo,setdatoPeriodo] = useState()
    // const [datoPeriodoSeleccionado,setdatoPeriodoSeleccionado] = useState()
    var datoPeriodoSeleccionado = ""
    const [objectPeriodo,setObjectPeriodo] = useState({})
    var objetoPeriodo = {}
    var selectPeriodo = []

    let Columnas=[
          { 
            title: "Id", 
            field: "idProveedor",
            hidden: true
            // lookup: y
          },
          { 
            title: "Proveedor", 
            field: "nombre",
            // lookup: y
          },
          { title: "Puntaje", field: "puntosTotales" },
          { title: "Porcentaje", field: "porcentajeTotal" }
        ]

    function getData(){

      for (let index = 0; index < datosProv.length; index++) {        
        objetoDatos = {evaperiodo:idEvaACt, idProveedor: datosProv[index].idProveedor, periodo: datoPeriodo}
        arrayEvaluacion.push(objetoDatos)
      }

      fetch(`http://localhost:3000/api/proveedores/mep`,{
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify({
          data: arrayEvaluacion,
          accion: "createmany",
        }),
      })
      .then(r=>r.json())
      .then(data=>{
        alert(data.message);
      })  
    }

    useEffect(()=>{
     
      for (let index = 0; index < datosPeriodo.length; index++) {
        objetoPeriodo = {value:datosPeriodo[index], texto:datosPeriodo[index]}

        selectPeriodo.push(objetoPeriodo)
      }

      // selectPeriodo.map(x =>{
      //   console.log(x.value)
      //   console.log(x.texto)
      // })

    },[])
    return( 
        <div>
          <BotonAnadir
            Accion={()=>{
              // setDarDato(true)
              // getData1()
              getData()
            }}
          />
          <form>
            <label>
              Ingrese Periodo:
            </label>
            <input 
              type="text" 
              // value={datosPeriodo} 
              onChange={e => setdatoPeriodo(e.target.value)}
            ></input>
            {/* <input type="submit" value="submit"></input> */}
            {console.log(selectPeriodo)}
            <Selector
              Title="Seleccione Periodo"
              ModoEdicion={true}
              KeyDato="periodo"
              Dato={datoPeriodoSeleccionado}
              SelectOptions={
                  selectPeriodo
                  // [ {value:'Hotel',texto:'Hotel'},
                  // {value:'Agencia',texto:'Agencia'},
                  // {value:'Guia',texto:'Guia'},
                  // {value:'Transporteterrestre',texto:'Transporte Terrestre'},
                  // {value:'Restaurante',texto:'Restaurante'},
                  // {value:'Transporteferroviario',texto:'Transporte Ferroviario'},
                  // {value:'Otro',texto:'Otro'}]
               
                
            }
            >
            </Selector>
          </form>
          <MaterialTable
              columns={Columnas}
              data={datosProv}
              components={{
                Toolbar: props => (
                  <div>
                    
                  </div>
                ),
              }}
              actions= {[
              {
                icon: () =>{
                  return <img src="/resources/edit-black-18dp.svg"/>
                },
                tooltip: "Añadir Evaluacion",
                  onClick: (event, rowData,) => Router.push({
                    pathname: `/MatrizEvaProv/Actcrit`,
                  })
              },
              {
                icon: () =>{
                  return <img src="/resources/remove_red_eye-24px.svg"/>
                },
                tooltip: "Mostrar Evaluacion",
                onClick: (event, rowData,) => Router.push({
                  pathname: `/MatrizEvaProv/${rowData.idProveedor}`,
                })
              }
            ]}
          options={{
              actionsColumnIndex: -1,
            }}
              title="Matriz de Evaluacion de Proveedores"
          />
        
        </div>
    )
}
export async function getStaticProps() {

    let datosPeriodo=[]
    let datosProv = []
    let idEvaACt = []

    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;

    let client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const dbo = client.db(dbName);
      const collection = dbo.collection("Proveedor");

      let result = await collection.find({}).project({
        "_id":0,
        "tipo":0,
        "TipoDocumento":0,
        "NroDocumento":0,
        "TipoMoneda":0,
        "EnlaceDocumento":0,
        "GerenteGeneral":0,
        "NEstrellas":0,
        "Web":0,
        "Estado":0,
        "RazonSocial":0,
        "celular":0,
        "celular2":0,
        "email":0,
        "email2":0,
        "direccionRegistrada":0,
        "DatosBancarios":0,
        "Destino":0,
        "Email":0,
        "NumContac":0,
        "Encuesta":0
      }).toArray()

      datosProv=result

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
      const collection = dbo.collection("Actividad");
  
      let result = await collection.find({}).project({"_id":0}).toArray()

      idEvaACt=result

    } catch (error) {
      console.log("error - " + error);
    } 
    finally{
      client.close();
    }

    try {
      client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const dbo = client.db(dbName);
      const collection = dbo.collection("EvaluacionActividad");

      let result = await collection.distinct("periodo")

      datosPeriodo=result

    } catch (error) {
      console.log("error - " + error);
    } 
    finally{
      client.close();
    }
    console.log(datosPeriodo)
    return {
      props:{
        datosPeriodo:datosPeriodo, datosProv: datosProv, idEvaACt:idEvaACt
      }}
  }