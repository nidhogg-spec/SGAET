import MaterialTable from "material-table";
import { MongoClient } from "mongodb";
import {useEffect, useRef, useState} from 'react'

export default function AñadirEvaluacion({DatosActividad, DatosCriterio}){

    const [datosActEditables, setDatosActEditables] = useState(DatosActividad)
    const [datosCritEditables, setDatosCritEditables] = useState(DatosCriterio)

    const isInitialMount = useRef(true)

    let y = {}
    DatosCriterio.map((x)=>{
      y[x.criterio] = x.criterio
    })

    let ColumnasCriterio = [
        {title: "Nombre Criterio",field: "criterio",},
        {
          title: "Estado",
          field: "estado",
          lookup: {0:"Inactivo",1:"Activo"}
        },
    ]
    let ColumnasActividad = [
      {title: "Descripcion",field: "descripcion",},
      {title: "Valor",field: "valor",},
      {
        title: "Criterio",
        field: "criterio",
        lookup: y
      },
      {
        title: "Estado",
        field: "estado",
        lookup: {0:"Inactivo",1:"Activo"}
      },
  ]
  useEffect(()=>{
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }else{
      let dataFetch = []
      let estructuraFetch = {}
      datosCritEditables.map((x,index)=>{
        datosActEditables.map((y,index2)=>{
          if(x.estado == 0 && x.criterio == y.criterio){
            y.estado = 0
            setDatosActEditables([...datosActEditables])
            
          }//el problema es este if
  
          if(x.estado == 1 && y.criterio==x.criterio){
            y.estado = 1
            setDatosActEditables([...datosActEditables])
          }
        })
      })
      // console.log(datosActividadPrevio)
      // console.log(datosActEditables)

      // datosActividadPrevio.map((prev,index)=>{
      //   if(datosActEditables[index].estado != prev.estado){
      //     estructuraFetch= {
      //       updateOne: 
      //       {
      //       "filter": {IdActividad: datosActEditables[index].IdActividad},
      //       "update": {$set:{estado:datosActEditables[index].estado}}
      //     }}
      //     dataFetch.push(estructuraFetch)
      //   }
      // })
      // // console.log(idFetch)
      datosActEditables.map(act=>{
        estructuraFetch ={
          updateOne:
          {
            "filter": {IdActividad: act.IdActividad},
            "update": {$set:{estado: act.estado}}
          }
        }
        dataFetch.push(estructuraFetch)
      })
      
      fetch(`http://localhost:3000/api/proveedores/actividad`,{
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify({
          data: dataFetch,
          accion: "updateEstado",
        }),
      })
      .then(r=>r.json())
      .then(data=>{
        alert(data.message);
      })
    }
  },[datosCritEditables])

  // useEffect(()=>{
  //   let idFetch = []
  //   let dataFetch = {}

  //   DatosActividadPrevio.map((prev,index)=>{
  //     if(datosActEditables[index].estado != prev.estado){
  //       idFetch.push(datosActEditables[index].IdActividad)
  //       dataFetch= {estado:datosActEditables[index].estado}
  //     }
  //   })
  //   console.log(idFetch)
  //   console.log(dataFetch)
  //   fetch(`http://localhost:3000/api/proveedores/actividad`,{
  //     method:"POST",
  //     headers:{"Content-Type": "application/json"},
  //     body: JSON.stringify({
  //       idProducto: idFetch,
  //       data: dataFetch,
  //       accion: "updateEstado",
  //     }),
  //   })
  //   .then(r=>r.json())
  //   .then(data=>{
  //     alert(data.message);
  //   })
  // },datosActEditables)
    return(
      <div>
        <MaterialTable
              columns={ColumnasCriterio}
              data= {datosCritEditables}
              title="Criterio por Actividad de Evaluacion de Proveedores"
              editable={{
                onRowAdd: newData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                        fetch(`http://localhost:3000/api/proveedores/criterio`,{
                          method:"POST",
                          headers:{"Content-Type": "application/json"},
                          body: JSON.stringify({
                            data: newData,
                            accion: "create",
                          }),
                        })
                        .then(r=>r.json())
                        .then(data=>{
                          alert(data.message);
                        })
                      setDatosCritEditables([...datosCritEditables, newData]);
                      resolve();
                    }, 1000)
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const dataUpdate = [...datosActEditables];
                      const index = oldData.tableData.id;
                      dataUpdate[index] = newData;
                      setDatosCritEditables([...dataUpdate]);

                      delete dataUpdate[index]._id

                      fetch(`http://localhost:3000/api/proveedores/criterio`,{
                        method:"POST",
                        headers:{"Content-Type": "application/json"},
                        body: JSON.stringify({
                          idProducto: dataUpdate[index].IdCriterio,
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
                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const dataDelete = [...datosActEditables];
                      const index = oldData.tableData.id;

                      // console.log(dataDelete[index])
                      // console.log(dataDelete[index].IdProductoHotel)

                      fetch(`http://localhost:3000/api/proveedores/criterio`,{
                        method:"POST",
                        headers:{"Content-Type": "application/json"},
                        body: JSON.stringify({
                          idProducto: dataDelete[index].IdCriterio,
                          accion: "delete",
                        }),
                      })
                      .then(r=>r.json())
                      .then(data=>{
                        alert(data.message);
                      })

                      dataDelete.splice(index, 1);
                      setDatosActEditables([...dataDelete]);

                      resolve()
                    }, 1000)
                  }),
              }}
              options={{
                actionsColumnIndex: -1,
              }}
          />
        <MaterialTable
              columns={ColumnasActividad}
              data= {datosActEditables}
              title="Actividad de Evaluacion de Proveedores"
              editable={{
                onRowAdd: newData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                        fetch(`http://localhost:3000/api/proveedores/actividad`,{
                          method:"POST",
                          headers:{"Content-Type": "application/json"},
                          body: JSON.stringify({
                            data: newData,
                            accion: "create",
                          }),
                        })
                        .then(r=>r.json())
                        .then(data=>{
                          alert(data.message);
                        })
                      setDatosActEditables([...datosActEditables, newData]);
                      resolve();
                    }, 1000)
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const dataUpdate = [...datosActEditables];
                      const index = oldData.tableData.id;
                      dataUpdate[index] = newData;
                      setDatosActEditables([...dataUpdate]);

                      // delete dataUpdate[index]._id

                      fetch(`http://localhost:3000/api/proveedores/actividad`,{
                        method:"POST",
                        headers:{"Content-Type": "application/json"},
                        body: JSON.stringify({
                          idProducto: dataUpdate[index].IdActividad,
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
                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const dataDelete = [...datosActEditables];
                      const index = oldData.tableData.id;

                      // console.log(dataDelete[index])
                      // console.log(dataDelete[index].IdProductoHotel)

                      fetch(`http://localhost:3000/api/proveedores/actividad`,{
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

                      dataDelete.splice(index, 1);
                      setDatosActEditables([...dataDelete]);

                      resolve()
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

export async function getStaticProps() {
  let DatosActividad = []
  let DatosCriterio = []

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
    const collection = dbo.collection("Criterio");

    let result = await collection.find({}).project({"_id":0}).toArray()

    DatosCriterio=result

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
    result._id = JSON.stringify(result._id);
    DatosActividad=result

  } catch (error) {
    console.log("error - " + error);
  }
  finally{
    client.close();
  }

  return {
    props:{
      DatosActividad: DatosActividad, DatosCriterio:DatosCriterio
    }}
}