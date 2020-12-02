import MaterialTable,{ MTableToolbar } from "material-table";
import Router from 'next/router'
import Selector from '@/components/Formulario/Selector/Selector'
import BotonAnadir from 'components/BotonAnadir/BotonAnadir'
import CampoTexto from '@/components/Formulario/CampoTexto/CampoTexto'

import { MongoClient } from "mongodb";

import { useEffect, useState } from "react";

export default function Home({datosPeriodo, datosProv, idEvaACt}){      
    
    let arrayEvaluacion = []
    let objetoDatos = {}
    var objetoPeriodo = {}
    const [datoPeriodo,setdatoPeriodo] = useState()
    const [datoPeriodoSeleccionado,setDatoPeriodoSeleccionado] = useState("noperiodo")
    // let datoPeriodoSeleccionado = ""
    const [selectPeriodo, setSelectPeriodo] = useState([])

    const [urlProv, setUrlProv] = useState()
    const [urlPeriodo, setUrlPeriodo] = useState()
    // var selectPeriodo = []

    let Columnas=[
          { 
            title: "Id", 
            field: "idProveedor",
            hidden: true
          },
          { 
            title: "Proveedor", 
            field: "nombre",
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
    function prueba1 (){

    }
    useEffect(()=>{
     var x = []
      for (let index = 0; index < datosPeriodo.length; index++) {
        objetoPeriodo = {value:datosPeriodo[index], texto:datosPeriodo[index]}

        x.push(objetoPeriodo)
      }

      setSelectPeriodo(x)

    },[])

    useEffect(() => {
      console.log(datoPeriodoSeleccionado)
    }, [datoPeriodoSeleccionado]);

    return( 
        <div>
          <BotonAnadir
            Accion={()=>{
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
            <br></br>
            {/* <input type="submit" value="submit"></input> */}
            <label>
              Selecccione Periodo:
            </label>
            <select value={datoPeriodoSeleccionado} onChange={(e)=>{
              setDatoPeriodoSeleccionado(e.target.value)
            }}>
              <option selected value="sinvalor">Seleccione Periodo</option>
              {selectPeriodo.map(options => {
                return <option value={options.value}>{options.texto}</option>
              })}
            </select>
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
                onClick: (event, rowData,) => {
                  let y = rowData.idProveedor.concat('', datoPeriodoSeleccionado)
                  Router.push({
                    pathname: `/MatrizEvaProv/${y}`,
                  })
                  // setUrlProv(rowData.idProveedor)
                  // setUrlPeriodo(datoPeriodoSeleccionado)
                }
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
    return {
      props:{
        datosPeriodo:datosPeriodo, datosProv: datosProv, idEvaACt:idEvaACt
      }}
  }