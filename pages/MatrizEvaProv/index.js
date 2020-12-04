import MaterialTable,{ MTableToolbar } from "material-table";
import Router from 'next/router'
import BotonAnadir from 'components/BotonAnadir/BotonAnadir'


import { MongoClient } from "mongodb";

import { useEffect, useState } from "react";

export default function Home({datosPeriodo, datosActividad, datosProv, datosEvaAct}){    
    // console.log(datosEvaAct)  
    // console.log(datosProv)  
    let datosEvaActPeriodo = []
    let datosTabla = []
    let arrayEvaluacion = []
    let objetoDatos = {}
    var objetoPeriodo = {}
    const [datosTablaShow,setDatosTablaShow] = useState([])
    const [datoPeriodo,setdatoPeriodo] = useState()
    const [datoPeriodoSeleccionado,setDatoPeriodoSeleccionado] = useState("noperiodo")
    // let datoPeriodoSeleccionado = ""
    const [selectPeriodo, setSelectPeriodo] = useState([])

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
      for (let index = 0; index < datosjuntos.length; index++) {        
        objetoDatos = {evaperiodo:datosActividad, idProveedor: datosjuntos[index].idProveedor, periodo: datoPeriodo}
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

    function compare (a,b){
      let comp = 0
      if(a.idProveedor>b.idProveedor){
        comp = 1;
      }else if(a.idProveedor<b.idProveedor){
        comp= -1
      }
      return comp
    }
    /* ----------------------------------------------------------------------- */
    useEffect(()=>{
      let filtroPeriodo = datosEvaAct.filter((row)=>{
        return row.periodo==datoPeriodoSeleccionado
      })

      let filtroPeriodoOrdenado = filtroPeriodo.sort(compare)
      let datosProvOrdenado = datosProv.sort(compare)

      filtroPeriodoOrdenado.map((x, index)=>{
        if(x.idProveedor == datosProvOrdenado[index].idProveedor){
          datosTabla.push({
            idProveedor: x.idProveedor,
            nombre: datosProvOrdenado[index].nombre,
            puntosTotales: x.puntosTotales,
            porcentajeTotal: x.porcentajeTotal
          })
        }
        if (datosTabla[index].puntosTotales === undefined && datosTabla[index].porcentajeTotal === undefined) {
          datosTabla[index].puntosTotales = null
          datosTabla[index].porcentajeTotal = null
        }
      })
      console.log(datosTabla)
      setDatosTablaShow(datosTabla)
    },[datoPeriodoSeleccionado])
    useEffect(()=>{
     var x = []
      for (let index = 0; index < datosPeriodo.length; index++) {
        objetoPeriodo = {value:datosPeriodo[index], texto:datosPeriodo[index]}

        x.push(objetoPeriodo)
      }

      setSelectPeriodo(x)

    },[])

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
              value={datosTabla} 
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
              data={datosTablaShow} 
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
    let datosActividad = []
    var datosEvaAct = []

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
      datosProv= result
     
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
      
      let result = await collection.find({}).project({
        "_id":0,
        "evaperiodo":0,
        "IdEvaluacionActividad":0,
      }).toArray()
      datosEvaAct= result

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

      datosActividad=result

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
        datosPeriodo:datosPeriodo, datosActividad:datosActividad, datosEvaAct:datosEvaAct, datosProv:datosProv
      }}
  }