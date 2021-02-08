import MaterialTable from "material-table";
import {useEffect, useState} from 'react';
import { MongoClient } from "mongodb";

export default function Home({Datos, EvaluacionActividad}){

const ListaProveedoresColumnas = [
    {title: "ID Proveedeor", field:"IdProveedor", hidden:"true"},
    {title: "Nombre de Proveedor", field:"nombre", filtering: false},
    {title: "Tipo de Proveedor", field:"tipo", lookup:{
        Hotel: 'Hotel', 
        Agencia: 'Agencia',
        Guia:'Guia',
        TransporteTerrestre:'Transporte Terrestre',
        SitioTuristico:'Sitio Turistico',
        Restaurante:'Restaurante',
        TransporteFerroviario:'Transporte Ferroviario',
        Otro:'Otro'
    }},
]  
const EvaluarProveedoresColumnas = [
    {title: "ID Proveedeor", field:"IdProveedor"},
    {title: "Nombre de Proveedor", field:"nombre"},
] 
const ComparacionProveedoresColumnas = [
    {title: "Criterio", field:"criterio"},
    {title: "Actividad", field:"descripcion"},
]

const [proveedorEvaluado, setProveedorEvaluado] = useState([]);
const [listaProveedores, setListaProveedores] = useState(Datos);
const [showComparacion, setShowComparacion] = useState();
const [comProvColumn, setComProvColumn] = useState([]);
const [evaActividad, setEvaActividad] = useState([]);


function GenerarReporte(){
    let objetoColumnas = {}
    let i = 1
    proveedorEvaluado.map((x,index)=>{

        objetoColumnas= {title: x.nombre, field:"cumple"+index.toString(), type: "boolean"}
        ComparacionProveedoresColumnas.push(objetoColumnas)

        i++
    })
    // console.log(ComparacionProveedoresColumnas)
    setComProvColumn(ComparacionProveedoresColumnas)
    setShowComparacion(true)
    alert("aca es")
}

useEffect(() => {
    let EvaActividadSeleccionado = []
    let dataEvaActividadSelect = []
    let keyEvaActSelect = ""

    proveedorEvaluado.map((x)=>{
        EvaluacionActividad.map(y=>{
            if(x.IdProveedor==y.IdProveedor){
                EvaActividadSeleccionado.push(y)
            }
        })
    })
    // console.log(EvaActividadSeleccionado)
    /*Este Recorrido es para setear los valores distintos del campo cumple*/
    EvaActividadSeleccionado.map((x,index1)=>{
        x.evaperiodo.map((y)=>{
            keyEvaActSelect= "cumple"+index1.toString()
            y[keyEvaActSelect]= y["cumple"]
            delete y["cumple"]   
        })
    })
    /*Este recorrido es para darle el formate que Material Table requiere*/
    //console.log(EvaActividadSeleccionado)
    EvaActividadSeleccionado.map((x,EvaluacionIndex)=>{
        
        x.evaperiodo.map((y,index)=>{
            /*esta validacion se realiza debido a la estructura de material table si no existe el campo lo pone como undefined, eso genera errores por lo que se setea en false al inicio*/
            if(y['cumple'+EvaluacionIndex]==undefined){
                if (dataEvaActividadSelect[index]==undefined) {
                    dataEvaActividadSelect[index]={}
                    dataEvaActividadSelect[index]["criterio"]= y.criterio
                    dataEvaActividadSelect[index]["descripcion"]= y.descripcion
                    dataEvaActividadSelect[index]['cumple'+EvaluacionIndex]= false
                }else{
                    dataEvaActividadSelect[index]['cumple'+EvaluacionIndex]= false
                }
            }else{
                /*Validacion de datos la primera ves es decir se setea el valor del  objeto*/
                if (dataEvaActividadSelect[index]==undefined) {
                    dataEvaActividadSelect[index]={}
                    dataEvaActividadSelect[index]["criterio"]= y.criterio
                    dataEvaActividadSelect[index]["descripcion"]= y.descripcion
                    dataEvaActividadSelect[index]['cumple'+EvaluacionIndex]= y['cumple'+EvaluacionIndex]
                } else {
                /*En este caso no es nesesario setar criterio ni actividad debido a que seria repetir datos ya que no cambian los valores*/
                    dataEvaActividadSelect[index]['cumple'+EvaluacionIndex]= y['cumple'+EvaluacionIndex]
                }
            }
        })
    })
    setEvaActividad(dataEvaActividadSelect)
}, [showComparacion]);
    return(
        <div>
          <h1>Comparacion de Matriz de Evaluacion de Proveedores</h1>
          <div>
            <MaterialTable
                title="Lista de Todos Proveedores"
                columns={ListaProveedoresColumnas}
                data={listaProveedores}
                actions={[
                    {
                        icon: "add",
                        tooltip: "Añadir Proveedor a Evaluar",
                        onClick: (event, rowData) =>{
                            let x = [...proveedorEvaluado]
                            x.push({
                                IdProveedor: rowData["IdProveedor"],
                                nombre: rowData["nombre"]
                            })
                            // console.log(x)
                            setProveedorEvaluado(x)
                            let ActuaDataTablaEvaluados = [...listaProveedores]
                            ActuaDataTablaEvaluados.splice(
                                ActuaDataTablaEvaluados.findIndex((value)=>{
                                    return value["IdProveedor"] == rowData["IdProveedor"]
                                }),
                                1
                            )
                            setListaProveedores(ActuaDataTablaEvaluados)
                            // setDarDato(true)
                        }
                    }
                ]}
                options={{
                    filtering: true
                  }}
            />
            <MaterialTable
                title="Proveedores a Evaluar"
                columns= {EvaluarProveedoresColumnas}
                data={proveedorEvaluado}
                editable={{
                    onRowDelete: (oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          const dataDelete = [...proveedorEvaluado];
                          const index = oldData.tableData.id;
                          dataDelete.splice(index, 1);
                          setProveedorEvaluado([...dataDelete]);
        
                          resolve();
                        }, 1000);
                      }),
                  }}
            />
          </div>
          <span onClick= {GenerarReporte}> Generar</span>
          {showComparacion == true  &&
            <div>
                <MaterialTable
                    title="Reporte Prov"
                    columns={comProvColumn}
                    data={evaActividad}
                />
            </div>
          }
        </div>
    )
}

export async function getStaticProps() {
    let Datos = []
    let EvaluacionActividad = []

    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;
    let client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    try {
        console.log("mongo xdxdxdxd");
        await client.connect();
        let collection = client.db(dbName).collection("Proveedor");
        let result = await collection.find({}).project({
            "_id":0, 
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
            "DireccionFiscal":0,
            "DatosBancarios":0,
            "Destino":0,
            "Email":0,
            "NumContac":0,
            "Encuesta":0,
            "DomicilioFiscal":0,
            "Contacto":0,
            "EmailPrincipal":0,
            "NroDocIdentRepresentanteLegal":0,
            "NombreRepresentanteLegal":0,
            "porcentajeTotal":0,
            "NumeroPrincipal":0,
        }).toArray()

        Datos = result;
    } catch (error) {
        console.log("Error cliente Mongo 1 => " + error);
    } finally {
        client.close();
    }
    client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    try {
        console.log("mongo xdxdxdxd");
        let periodoAct = Datos[0].periodoActual
        await client.connect();
        let collection = client.db(dbName).collection("EvaluacionActividad");
        let result = await collection.find({}).project({
            "_id":0, 
        }).toArray()
        result.map(y=>{
            if(periodoAct == y.periodo){
                EvaluacionActividad.push(y);
            }
        })
        
    } catch (error) {
        console.log("Error cliente Mongo 1 => " + error);
    } finally {
        client.close();
    }

    return{
        props:{
            Datos:Datos, EvaluacionActividad:EvaluacionActividad
        }
    }
}