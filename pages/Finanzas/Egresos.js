import MaterialTable from 'material-table'
import CampoTexto from '@/components/Formulario/CampoTexto/CampoTexto'
import { MongoClient } from "mongodb";
import { useState,useEffect } from 'react';

export default function Egresos({Egresos}){

    let x = {}
    const [datosTabla, setDatosTabla] = useState(Egresos)
    const [saldoReserva, setSaldoReserva] = useState()

    const [modoEdicion, setModoEdicion] = useState(false)
    const [darDato,setDarDato]  = useState(false)

    const [sumaSaldo,setSumaSaldo]  = useState()

    useEffect(()=>{
      let y = 0
      Egresos.map(x=>{
         y = y +x.TotalEgresosAdministrativo
        setSumaSaldo(y)
      })
    },[sumaSaldo])
    let Columna = [
        { title: "ID", field: "Egresos", hidden: true},
        { title: "Fecha Gastos Administrativos", field: "FechaEgresosAdministrativo", type: "date"},
        { title: "Descripcion Gastos Administrativos", field: "DescripcionEgresosAdministrativo"},
        { title: "Total Gastos Administrativos", field: "TotalEgresosAdministrativo", type: "numeric"},
    ]
    
    return(
        <div>
            <CampoTexto
              Title= "Ingresos"
              ModoEdicion= {modoEdicion}
              Dato={Egresos[0].SumaAdelantoNeto}
              DarDato={darDato}
              KeyDato= "SumaAdelantoNeto"
              Reiniciar={false}
            />
             <CampoTexto
              Title= "Gastos Operativos"
              ModoEdicion= {modoEdicion}
              Dato={Egresos[0].SumaTotalNeto}
              DarDato={darDato}
              KeyDato= "SumaTotalNeto"
              Reiniciar={false}
            />
            <MaterialTable
                title="Egresos"
                data= {datosTabla}
                columns={Columna}
                editable={{
                  onRowAdd: newData =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                          newData.SumaAdelantoNeto = Egresos[0].SumaAdelantoNeto
                          newData.SumaTotalNeto = Egresos[0].SumaTotalNeto
                          fetch(`http://localhost:3000/api/finanzas/reportesfinanzas`,{
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
                        setDatosTabla([...datosTabla, newData]);
                        resolve();
                      }, 1000)
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        let sumGastosAdministrativos
                        const dataUpdate = [...datosTabla];
                        const index = oldData.tableData.id;
                        newData.SaldoReserv = 
                        dataUpdate[index] = newData;
                        setDatosTabla([...dataUpdate]);
                                               
                        fetch(`http://localhost:3000/api/finanzas/reportesfinanzas`,{
                          method:"POST",
                          headers:{"Content-Type": "application/json"},
                          body: JSON.stringify({
                            idProducto: dataUpdate[index].IdReporteFinanza,
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
                        const dataDelete = [...datosTabla];
                        const index = oldData.tableData.id;
      
                        fetch(`http://localhost:3000/api/finanzas/reportesfinanzas`,{
                          method:"POST",
                          headers:{"Content-Type": "application/json"},
                          body: JSON.stringify({
                            idProducto: dataDelete[index].IdReporteFinanza,
                            accion: "delete",
                          }),
                        })
                        .then(r=>r.json())
                        .then(data=>{
                          alert(data.message);
                        })
      
                        dataDelete.splice(index, 1);
                        setDatosTabla([...dataDelete]);
      
                        resolve()
                      }, 1000)
                    }),
                }}
                options={{
                  actionsColumnIndex: -1,
                }}
            />
             <CampoTexto
              Title= "Saldo"
              ModoEdicion= {modoEdicion}
              Dato={sumaSaldo}
              DarDato={darDato}
              KeyDato= "SumaEgresosAdministrativos"
              Reiniciar={false}
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