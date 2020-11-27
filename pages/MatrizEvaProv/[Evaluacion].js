import MaterialTable from "material-table";
import {useEffect, useState} from 'react';
import { MongoClient } from "mongodb";


export default function Evaluacion({Datos, idEvaACt, DatosPeriodo}){
  // console.log(DatosPeriodo)
  // console.log(Datos)

    const [datosEditables, setDatosEditables] = useState(DatosPeriodo)
    // console.log(datosEditables)
    let objetoDatosMongo = {}
    let suma = 0;
    let puntTotal = 0;
    let porcent = 0;

    let Columnas = [
        {title: "Criterio",field: "criterio" , editable: 'never'},
        { title: "Actividad", field: "descripcion", editable: 'never' },
        { 
          title: "¿Cumple?", 
          field: "cumple" ,
          type: "boolean"
        }
    ]
    
    // useEffect(()=>{
    //   let objetoDatos = {evaperiodo:datosEditables}
  
    //   fetch(`http://localhost:3000/api/proveedores/mep`,{
    //       method:"POST",
    //       headers:{"Content-Type": "application/json"},
    //       body: JSON.stringify({
    //         data: objetoDatos,
    //         accion: "create",
    //       }),
    //     })
    //     .then(r=>r.json())
    //     .then(data=>{
    //       alert(data.message);
    //     })
        
    // },[datosEditables])

    return(
        <MaterialTable
            columns={Columnas}
            data={datosEditables}
            title="Matriz de Evaluacion Puntajes y Porcentajes"
            editable={{
              onBulkUpdate: changes =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                      const dataUpdate = [...datosEditables];
                      
                      // dataUpdate[index] = newData;
                      // for (let index = 0; index < 10; index++) {
                      // array.forEach(element => {
                        
                      // });
                      // console.log(Object.entries(changes))
                      Object.entries(changes).map((dt,key)=>{
                        // 
                        const index = dt[1].oldData.tableData.id;
                        dataUpdate[index] = dt[1].newData
                        
                        setDatosEditables([...dataUpdate])

                        // console.log(dataUpdate[index].valor)
                        // let valor = parseInt(dataUpdate[index].valor,10)
                        // // console.log(dataUpdate[index].estado)
                        // if(dataUpdate[index].estado === "1" && dataUpdate[index].IdActividad ){
                        //   puntTotal = puntTotal + valor
                        // }
                        // console.log(key)
                        
                      })
                      
                      for (let index = 0; index < dataUpdate.length; index++) {  
                        let valor = parseInt(dataUpdate[index].valor,10)

                        if(dataUpdate[index].estado === "1" && dataUpdate[index].IdActividad ){
                          puntTotal = puntTotal + valor
                        }
                        if(dataUpdate[index].cumple){
                          suma = suma + valor
                        } 
                      }
                      porcent = (suma/puntTotal) * 100

                      objetoDatosMongo = {evaperiodo:dataUpdate,puntosTotales: suma, porcentajeTotal: porcent }

                      /*Recordar que esta parte del codigo tiene que ser comparado con el periodo en el que se este llevando a cabo la evaluacion */
                      // console.log(idEvaACt[0].IdEvaluacionActividad)
                      fetch(`http://localhost:3000/api/proveedores/mep`,{
                        method:"POST",
                        headers:{"Content-Type": "application/json"},
                        body: JSON.stringify({
                          idProducto: idEvaACt[0].IdEvaluacionActividad,
                          data: objetoDatosMongo,
                          accion: "update",
                        }),
                      })
                      .then(r=>r.json())
                      .then(data=>{
                        alert(data.message);
                      })
                  resolve()
                }, 1000);
              }),
                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const dataDelete = [...datosEditables];
                      const index = oldData.tableData.id;

                      // console.log(dataDelete[index])
                      // console.log(dataDelete[index].IdProductoHotel)

                      fetch(`http://localhost:3000/api/proveedores/mep`,{
                        method:"POST",
                        headers:{"Content-Type": "application/json"},
                        body: JSON.stringify({
                          idProducto: dataDelete[index].IdActividad,
                          accion: "delete",
                        }),
                      })
                      .then(r=>r.json())
                      .then(data=>{
                        alert(data.message);
                      })
                      console.log(dataDelete[index])
                      console.log(index)

                      dataDelete.splice(index, 1);
                      setDatosEditables([...dataDelete]);

                      resolve()
                    }, 1000)
                  }),
            }}
            options={{
              grouping: true,
              actionsColumnIndex: -1,
            }}
        />
    )
}
export async function getServerSideProps() {
    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;

    /*Tener en cuenta que la duplicidad de datos es porque se junto el doccumento de criterio en un objeto
    por lo que solo se deberia mostrar lo de actividad siendo que criterio
    se encuentra dentro de actividad y no es nesesario pasar ese dato */

    let Datos=[]
    let DatosPeriodo = []
    let DatosCriterio=[]
    let DatosActividad=[]
    let idEvaACt = []
    
    let client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    /* Consulta para extraer los datos de Criterio */
    try {
    
      client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const dbo = client.db(dbName);
      const collection = dbo.collection("Criterio");
  
      let result = await collection.find({}).project({"_id":0}).toArray()
  
      DatosCriterio=result
  
    } catch (error) {
      console.log("error - " + error);
    } 
    finally{
      client.close();
    }
    /* Consulta para extraer los datos de Actividad */
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

      DatosActividad=result
  
    } catch (error) {
      console.log("error - " + error);
    } 
    finally{
      client.close();
    }
    /* Consulta para extraer los datos de EvaluacionActividad */
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
      const collection = dbo.collection("EvaluacionActividad");
  
      let result = await collection.find({}).project({"_id":0}).toArray()

      idEvaACt=result
  
    } catch (error) {
      console.log("error - " + error);
    } 
    finally{
      client.close();
    }
    Datos = DatosActividad.concat(DatosCriterio)
    DatosPeriodo = idEvaACt[0].evaperiodo

    // console.log(DatosPeriodo)
    // // console.log(idEvaACt[0].evaperiodo)
    // // console.log(idEvaACt)
    // // console.log(idEvaACt[0].IdEvaluacionActividad)
    // // console.log(idEvaACt)
    // // console.log(DatosCriterio)
    // // console.log(DatosActividad)
    // console.log(Datos)
    return {
      props:{
        Datos:Datos, idEvaACt:idEvaACt, DatosPeriodo:DatosPeriodo
      }}
  }