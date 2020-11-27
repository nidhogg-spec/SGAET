import MaterialTable,{ MTableToolbar } from "material-table";
import Router from 'next/router'
import { MongoClient } from "mongodb";
import BotonAnadir from 'components/BotonAnadir/BotonAnadir'

import { useEffect } from "react";

export default function Home({Datos, datosProv}){      
    // var toChild = datosProv.toArray()
    // convertToReactObject(datosProv)
    // console.log(Datos)
    // let y = {}
    //y[x.nombre] indica que la key del objeto y va a ser en este caso el mismo nombre
    // datosProv.map((x)=>{
    //   y[x.nombre]= x.nombre
    // })
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

    return( 
        <div>
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

    let x = []
    let Datos=[]
    let datosProv = []

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
        "Destino":0
      }).toArray()

      datosProv=result

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
      }).toArray()

      x=result

    } catch (error) {
      console.log("error - " + error);
    } 
    finally{
      client.close();
    }

    Datos=x.concat(datosProv)

    console.log("*///////////////////////////////////////////////////////////*")
    console.log(x)
    console.log(Datos)
    return {
      props:{
        Datos:Datos, datosProv: datosProv
      }}
  }