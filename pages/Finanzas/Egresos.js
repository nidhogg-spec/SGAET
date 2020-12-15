import MaterialTable from 'material-table'
import { MongoClient } from "mongodb";
import { useState } from 'react';

export default function Egresos({Egresos}){

    const [datosTabla, setDatosTabla] = useState(Egresos)
    
    let Columna = [
        { title: "ID", field: "Egresos", hidden: true},
        { title: "Ingreso Total", field: "Ingreso"},
        { title: "Gastos Operativos", field: "EgresoOperativos"},
        { title: "Fecha Gastos Administrativos", field: "FechaEgresosAdministrativo"},
        { title: "Gastos Administrativos", field: "EgresosAdministrativo"},
        { title: "Saldo de Reservas", field: "SaldoReserv"},
    ]
    
    return(
        <div>
            Este es Egreso
            <MaterialTable
                title="Egresos"
                columns={Columna}
            />
        </div>
    )
}
export async function getStaticProps(){
    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;

    let Egresos = []
    
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
      const collection = dbo.collection("ReportesFinanzas");

      let result = await collection.find({}).project({
        "_id":0, 
      }).toArray()
      Egresos = result
    //   result.map(x=>{
    //       if(x.IdCliente==idClienteFront){
    //           console.log("aca es ")
    //           Datos=x
    //       }
    //   })
    } catch (error) {
      console.log("error - " + error);
    } 
    finally{
      client.close();
    }
    return{
      props:{
        Egresos : Egresos
      }
    }
}