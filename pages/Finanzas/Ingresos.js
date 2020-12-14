import MaterialTable from 'material-table'
import { MongoClient } from "mongodb";
import BotonAñadir from '@/components/BotonAnadir/BotonAnadir'
import { useEffect } from 'react';

export default function Ingresos({DatosIngreso, DatosReserva}){
    
      /*Crear en la base de Datos del Tipo de orden que pertenezca juntando 
    DatosReservaCotizacion y ServicioSeleccionado*/
    // useEffect(()=>{
    //   fetch(`http://localhost:3000/api/finanzas/ingresos`,{
    //       method:"POST",
    //       headers:{"Content-Type": "application/json"},
    //       body: JSON.stringify({
    //       data: DatosReserva,
    //       accion: "create",
    //       }),
    //   })
    //   .then(r=>r.json())
    //   .then(data=>{
    //       alert(data.message);
    //   })
    // },[])
    function getDataIngresos(){
      if(DatosReserva.length==DatosIngreso.length){
        console.log("1")
      }else{
        // fetch(`http://localhost:3000/api/finanzas/ingresos`,{
        //   method:"POST",
        //   headers:{"Content-Type": "application/json"},
        //   body: JSON.stringify({
        //   data: DatosReserva,
        //   accion: "create",
        //   }),
        // })
        // .then(r=>r.json())
        // .then(data=>{
        //     alert(data.message);
        // })
      }
    }
    console.log(DatosIngreso)
    console.log(DatosReserva)
    let ColumnasIngresos = [
        { title: "ID", field: "Ingresos", hidden: true},
        { title: "Fecha de Inicio", field: "FechaInicio"},
        { title: "Codigo Grupo", field: "CodGrupo"},
        { title: "Nombre Grupo", field: "NombreGrupo"},
        { title: "Nro. Pasajeros", field: "Npasajeros"},
        { title: "N° Voucher Servicios", field: "NVoucherServ"},
        { title: "Fecha Entrega", field: "FecEntrega"},
        { title: "Cuenta", field: "Cuenta"},
        { title: "Total", field: "Total"},
        { title: "Comision", field: "Comision"},
        { title: "Total Neto", field: "TotalNeto"},
        { title: "Adelanto", field: "Adelanto"},
        { title: "Adelanto Neto", field: "AdelantoNeto"},
        { title: "Saldo", field: "Saldo"}
    ]
    let ColumnasEgresosOperativos = [
        { title: "ID", field: "Ingresos", hidden: true},
        { title: "FechaGasto", field: "Fecha Gasto"},
        { title: "Soles", field: "Soles"},
        { title: "Dolares", field: "Dolares"},
        { title: "Tasa", field: "TS"},
        { title: "Total Dolares", field: "TotalDolares"},
        { title: "Saldo Actual", field: "SaldoActual"},
        { title: "Utilidad Operario", field: "UtilOpera"},
    ]
    return(
        <div>
            Este es Ingreso
            <BotonAñadir
              Accion={() => {
                getDataIngresos()
              }}
            />
            <MaterialTable
                title="Ingresos"
                columns={ColumnasIngresos}
            />
            <MaterialTable
                title="Egresos Operativos"
                columns={ColumnasEgresosOperativos}
            />
        </div>
    )
}
export async function getStaticProps(){

    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;

    let DatosReserva=[]
    let DatosIngreso = []

    // console.log(idClienteFront)
    
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
      const collection = dbo.collection("Ingreso");

      let result = await collection.find({}).project({
        "_id":0, 
      }).toArray()
      // result.map(x=>{
      //     if(x.IdCliente==idClienteFront){
      //         console.log("aca es ")
      //         Datos=x
      //     }
      // })
      DatosIngreso = result
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
      const collection = dbo.collection("ReservaCotizacion");

      let result = await collection.find({}).project({
        "_id":0, 
      }).toArray()
      DatosReserva = result
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
        DatosIngreso:DatosIngreso, DatosReserva,DatosReserva
      }
    }
}