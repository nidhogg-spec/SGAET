import { MongoClient } from "mongodb";
import {useState,useEffect} from 'react'
import ListaPasajeros from '../components/Formulario/ListaPasajeros/ListaPasajeros'

export default function LlenadoPasajeros({NumPasajeros}){

    const [datoPadre,setDatoPadre] = useState([])
    const [datoHijo,setDatoHijo]=useState(null)

    useEffect(()=>{

        let tempDatoPadre = datoPadre
        console.log(datoPadre)
        if(datoHijo != null){
            console.log(datoHijo)
            // var valuesArray = tempDatoPadre.map(function(item){return item.docIdentidad})
            // var hayDuplicado = valuesArray.some(function(item,idx){
            //     return valuesArray.indexOf(item) != idx
            // })
            tempDatoPadre.push(datoHijo)
            setDatoPadre(tempDatoPadre) 
            
            // if(!hayDuplicado){   
                
            // }
            // console.log(hayDuplicado)
        }  
    },[datoPadre])

    function handleSubmit(){
        console.log(datoPadre)
        // let y = []
        // y.push(dato1,dato2,dato3,dato4,dato5)
        // console.log(y)
        // console.log(y)
        // fetch(`http://localhost:3000/api/finanzas/reportesfinanzas`,{
        //     method:"POST",
        //     headers:{"Content-Type": "application/json"},
        //     body: JSON.stringify({
        //         idProducto: "RC00002",
        //         data: y,
        //         accion: "update",
        //     }),
        //     })
        //     .then(r=>r.json())
        //     .then(data=>{
        //     alert(data.message);
        // })
    }

    const item = new Array(parseInt(NumPasajeros)).fill(null)
    
    return(
        <div>
            {item.map((x,index)=>
                <ListaPasajeros
                    NumPasajeros={index+1}
                    setData={setDatoHijo}
                />
            )}
            <button onClick={handleSubmit} >Enviar Datos</button>
        </div>
    )
}
export async function getServerSideProps(){
    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;

    const Idurl = "RC00002"
    let NumPasajeros = ""
    let client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    let collection = client.db(dbName).collection("ReservaCotizacion");
    let result = await collection.find().project({"_id":0}).toArray();
    result.map((x)=>{
        if (Idurl == x.IdReservaCotizacion) {
            NumPasajeros= x.Npasajeros
        }
    })
    try {
        await client.connect()
        
    } catch (error) {
        
    }
    return{
        props:{
            NumPasajeros: NumPasajeros
        }
    }
}