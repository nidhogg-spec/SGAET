import { MongoClient } from "mongodb";
import {useState,useEffect} from 'react'
import AutoFormulario_v2 from "@/components/Formulario_V2/AutoFormulario/AutoFormulario"

export default function LlenadoPasajeros({NumPasajeros}){

    const [Datos,setDatos] = useState({})
    
    // const [datoPadre,setDatoPadre] = useState([])
    // const [datoHijo,setDatoHijo]=useState(null)
    
    // useEffect(()=>{

    //     let tempDatoPadre = datoPadre
    //     console.log(datoPadre)
    //     if(datoHijo != null){
    //         console.log(datoHijo)
    //         // var valuesArray = tempDatoPadre.map(function(item){return item.docIdentidad})
    //         // var hayDuplicado = valuesArray.some(function(item,idx){
    //         //     return valuesArray.indexOf(item) != idx
    //         // })
    //         tempDatoPadre.push(datoHijo)
    //         setDatoPadre(tempDatoPadre) 
            
    //         // if(!hayDuplicado){   
                
    //         // }
    //         // console.log(hayDuplicado)
    //     }  
    // },[datoPadre])

    function handleSubmit(){
        
        let listaPasajeros = []

        for (let index = 0; index < NumPasajeros; index++) {
            let object={}
            for (const key in Datos) {
                // console.log(Datos[key])
                // console.log(key.slice(-1))
                if(key.slice(-1)==index){
                    object= {...object, [key]:Datos[key]}
                    // object={[key]:Datos[key]}
                    // arrayData.push(object)
                }
            }
            listaPasajeros.push(object)
        }
        console.log(listaPasajeros)
        // let y = []
        // y.push(dato1,dato2,dato3,dato4,dato5)
        // console.log(y)
        // console.log(y)
        fetch(`http://localhost:3000/api/reserva/DataReserva/CRUDReservaCotizacion`,{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({
                idProducto: "RC00004",
                data: {listaPasajeros},
                accion: "update",
            }),
            })
            .then(r=>r.json())
            .then(data=>{
            alert(data.message);
        })
    }

    let item = new Array(parseInt(NumPasajeros)).fill(null)
    
    return(
        <div>
            {item.map((x,index)=>{
                return (
                <AutoFormulario_v2
                Formulario={{
                title: "Lista de Pasajeros",
                secciones: [
                    {
                    subTitle: "Pasajero "+parseInt(index+1),
                    componentes: [
                        {
                            tipo: "texto",
                            Title: "Nombre del Pasajero",
                            KeyDato: "nombre"+index,
                        },
                        {
                            tipo: "texto",
                            Title: "Apellido del Pasajero",
                            KeyDato:  "apellido"+index,
                        },
                        {
                            tipo: "texto",
                            Title: "DNI, Carne de Extranjeria o Pasaporte",
                            KeyDato:  "docIdentidad"+index,
                        },
                        {
                            tipo: "texto",
                            Title: "Nacionalidad",
                            KeyDato:  "nacionalidad"+index,
                        },
                        {
                            tipo: "texto",
                            Title: "Sexo",
                            KeyDato:  "sexo"+index,
                        },
                        {
                            tipo: "fecha",
                            Title: "Fecha de Nacimiento",
                            KeyDato:  "fecNacimiento"+index,
                        },
                    ],
                    },
                ],
                }}
                ModoEdicion={true}
                Dato={Datos}
                setDato={setDatos}
                key={'AF_ReserCoti'+index}
                />)
            })}
           
            {/* {item.map((x,index)=>
                <ListaPasajeros
                    NumPasajeros={index+1}
                    setData={setDatoHijo}
                />
            )} */}
            <button onClick={handleSubmit} >Enviar Datos</button>
        </div>
    )
}
export async function getServerSideProps(){
    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;

    const Idurl = "RC00001"
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
            
            NumPasajeros= parseInt(x.NpasajerosAdult)+parseInt(x.NpasajerosChild)
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