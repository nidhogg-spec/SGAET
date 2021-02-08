import MaterialTable from "material-table";
import {useEffect, useState} from 'react';
import { MongoClient } from "mongodb";
import {useRouter} from 'next/router'


export default function Evaluacion({Datos}){

    /* variables en las que se guardan los datos de la url */
    const router = useRouter();
    const Evaluacion = router.query
    /* variable en la que se extraen todos los criterios y actividades de los 
    proveedores */
    let datosEditables = Datos
    /* variable en la que se extrae el string de la url */
    let urlPerProv = Evaluacion.Evaluacion
    /* variable en la que se guardara la evaluacion del proveedor que corresponda */
    var dataEvaluProv = {}
    /*Estado que se encargara de manejar los datos que se muestran en material table*/
    const [datosTabla, setDatosTabla] = useState([])
    /*Variable en la que se guardaran  los datos que iran al fetch de update */
    let objetoDatosMongo = {}
    /*Variables en las que se separa el id del periodo*/
    var x = urlPerProv.slice(-8)
    var count = x.length
    var y = parseInt(count)
    var periodo = urlPerProv.slice(-y)
    var idprov = urlPerProv.slice(0,7)
    /*variables que guardaran los datos que se usan para el calculo*/
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
    /*para encontrar el proveedor que perteneze la evaluacion 
    si falla algo añadir el [] en el use effect*/
    useEffect(()=>{
      for (let index = 0; index < datosEditables.length; index++) {
        if (idprov==datosEditables[index].IdProveedor && periodo==datosEditables[index].periodo) {
          console.log("Existe we")
          dataEvaluProv=datosEditables[index]
        }
      }
    })
  /*setea los datos de evaperiodo del proveedor seleccionado para que sea usado
  en la tabla */
    useEffect(()=>{   
      console.log(dataEvaluProv)     
      setDatosTabla(dataEvaluProv.evaperiodo)
    },[])

    return(
        <MaterialTable
            columns={Columnas}
            data={datosTabla}
            title="Matriz de Evaluacion Puntajes y Porcentajes"
            editable={{
              onBulkUpdate: changes =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                      const dataUpdate = [...datosTabla];
                      /*el objeto change contiene los datos nuevos y viejos de la
                      tabla por lo que se usa este metodo para poder visualizar los datos 
                      y a su ves setear los nuevos datos en el estado*/
                      Object.entries(changes).map((dt,key)=>{
                        const index = dt[1].oldData.tableData.id;
                        dataUpdate[index] = dt[1].newData
                        
                        setDatosTabla([...dataUpdate])

                      })
                      /*recorre los datos actualizados y calcula los puntajes */
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

                      fetch(`http://localhost:3000/api/proveedores/mep`,{
                        method:"POST",
                        headers:{"Content-Type": "application/json"},
                        body: JSON.stringify({
                          idProducto: dataEvaluProv.IdEvaluacionActividad,
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
                      const dataDelete = [...datosTabla];
                      const index = oldData.tableData.id;

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
                      console.log(dataDelete[index].IdActividad)
                      console.log(index)

                      dataDelete.splice(index, 1);
                      setDatosTabla([...dataDelete]);

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
export async function getServerSideProps(context) {

    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;

    let Datos=[]
    
    let client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

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

      let result = await collection.find({}).project({
        "_id":0, 
      }).toArray()
      Datos=result

    } catch (error) {
      console.log("error - " + error);
    } 
    finally{
      client.close();
    }
    return {
      props:{
        Datos:Datos
      }}
  }