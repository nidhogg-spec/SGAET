import MaterialTable,{ MTableToolbar } from "material-table";
import Router from 'next/router'
import BotonAnadir from 'components/BotonAnadir/BotonAnadir'

import { MongoClient } from "mongodb";

import { useEffect, useState } from "react";

export default function Home({datosPeriodo, datosActividad, datosProv, datosEvaAct}){    
    let datosTabla = []
    let arrayEvaluacion = []
    let objetoDatos = {}
    var objetoPeriodo = {}

    const [datosTablaShow,setDatosTablaShow] = useState([])
    const [datoPeriodo,setdatoPeriodo] = useState()
    const [datoPeriodoSeleccionado,setDatoPeriodoSeleccionado] = useState("noperiodo")
    const [selectPeriodo, setSelectPeriodo] = useState([])
    // const [selectPeriodoActivo, setSelectPeriodoActivo] = useState([])
    const [datoPeriodoActivo,setdatoPeriodoActivo] = useState()
    
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
      let actividadesActivas = []
      datosActividad.map((y)=>{
        if(y.estado==1){
          actividadesActivas.push(y)
        }
      })
      datosProv.map((x)=>{
        objetoDatos = {evaperiodo:actividadesActivas, idProveedor: x.idProveedor, periodo: datoPeriodo}
        arrayEvaluacion.push(objetoDatos)
      })
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

     function EnviarEvaluacionPeriodo(){
      let objetoIdProvEvaProv = []
      let ArrayPocentajeProvEvaProv = []
      let objetoPocentajeProvEvaProv = {}

      datosTablaShow.map(x=>{
        objetoIdProvEvaProv.push(x.idProveedor)
        // objetoPocentajeProvEvaProv[porcentajeTotal,periodoActual] = x.porcentajeTotal,datoPeriodoSeleccionado
        objetoPocentajeProvEvaProv= {proveedor:x.idProveedor,porcentajeTotal: x.porcentajeTotal, periodoActual: datoPeriodoSeleccionado}
        if(objetoPocentajeProvEvaProv.porcentajeTotal==undefined){
          objetoPocentajeProvEvaProv.porcentajeTotal=null
        }
        ArrayPocentajeProvEvaProv.push(objetoPocentajeProvEvaProv)
      })
      console.log(objetoIdProvEvaProv)
      console.log(ArrayPocentajeProvEvaProv)

      ArrayPocentajeProvEvaProv.map((x)=>{
        let y = {porcentajeTotal: x.porcentajeTotal, periodoActual:x.periodoActual}
         fetch(`http://localhost:3000/api/proveedores/listaProveedores`,{
          method:"POST",
          headers:{"Content-Type": "application/json"},
          body: JSON.stringify({
            idProveedor: x.proveedor,
            data: y,
            accion: "update",
          }),
        })
        .then(r=>r.json())
        .then(data=>{
          alert(data.message);
        })
      })
     
      setdatoPeriodoActivo(datoPeriodoSeleccionado)
    }

    /* ----------------------------------------------------------------------- */
    useEffect(()=>{
      let filtroPeriodo = datosEvaAct.filter((row)=>{
        return row.periodo==datoPeriodoSeleccionado
      })

      let filtroPeriodoOrdenado = filtroPeriodo.sort(compare)
      let datosProvOrdenado = datosProv.sort(compare)

      datosProvOrdenado.map((x)=>{
        filtroPeriodoOrdenado.map((y)=>{
          if(x.idProveedor == y.idProveedor){
            datosTabla.push({
              idProveedor: y.idProveedor,
              nombre: x.nombre,
              puntosTotales: y.puntosTotales,
              porcentajeTotal: y.porcentajeTotal
            })
          }
        })
      })

      setDatosTablaShow(datosTabla)
    },[datoPeriodoSeleccionado])

    useEffect(()=>{
     var x = []
    //  console.log(datosPeriodo)
     datosPeriodo.map(value=>{
      objetoPeriodo = {value:value, texto:value}
      x.push(objetoPeriodo)
     })
     
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
              value={datoPeriodo} 
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
            
            {/* <label>
              Selecccione Periodo Actual:
            </label>
            <select value={datoPeriodoActivo} onChange={(e)=>{
              setdatoPeriodoActivo(e.target.value)
            }}>
            {selectPeriodo.map(options => {
              return <option value={options.value}>{options.texto}</option>
            })}
            </select>             */}
          </form>
          <span>El periodo Activo actual es: {datoPeriodoActivo}</span>
          <BotonAnadir
            Accion={()=>{
              EnviarEvaluacionPeriodo()
            }}
          />
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