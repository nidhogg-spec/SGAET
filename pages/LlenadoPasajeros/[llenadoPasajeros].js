import { MongoClient } from "mongodb";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AutoFormulario_v2 from "@/components/Formulario_V2/AutoFormulario/AutoFormulario";

export default function LlenadoPasajeros({ NumPasajeros, DatosPasajeros }) {
  const [Datos, setDatos] = useState({});
  const router = useRouter();
  const { llenadoPasajeros } = router.query;
  // const [datoPadre,setDatoPadre] = useState([])
  // const [datoHijo,setDatoHijo]=useState(null)
  useEffect(() => {
    console.log(Datos);
    if (DatosPasajeros.length != 0) {
      setDatos(DatosPasajeros[DatosPasajeros.length - 1]);
    }
  }, []);
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

  function handleSubmit() {
    let listaPasajeros = [];

    for (let index = 0; index < NumPasajeros; index++) {
      let object = {};
      for (const key in Datos) {
        let number = key.length - 1;
        // console.log(Datos[key])
        // console.log(key.slice(-1))
        if (key.slice(-1) == index) {
          object = { ...object, [key.slice(0, number)]: Datos[key] };
          // object={[key]:Datos[key]}
          // arrayData.push(object)
        }
      }
      listaPasajeros.push(object);
    }
    console.log(listaPasajeros);
    listaPasajeros.push(Datos);
    // console.log(listaPasajeros)
    // let y = []
    // y.push(dato1,dato2,dato3,dato4,dato5)
    // console.log(y)
    // console.log(y)
    fetch(
      `http://localhost:3000/api/reserva/DataReserva/CRUDReservaCotizacion`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idProducto: llenadoPasajeros,
          data: { listaPasajeros },
          accion: "update"
        })
      }
    )
      .then((r) => r.json())
      .then((data) => {
        alert(data.message);
      });
  }

  let item = new Array(parseInt(NumPasajeros)).fill(null);

  return (
    <div>
      {item.map((x, index) => {
        return (
          <AutoFormulario_v2
            Formulario={{
              title: "Lista de Pasajeros",
              secciones: [
                {
                  subTitle: "Pasajero " + parseInt(index + 1),
                  componentes: [
                    {
                      tipo: "texto",
                      Title: "Nombre del Pasajero",
                      KeyDato: "Nombre" + index
                    },
                    {
                      tipo: "texto",
                      Title: "Apellido del Pasajero",
                      KeyDato: "Apellido" + index
                    },
                    {
                      tipo: "selector",
                      Title: "TipoDocumento",
                      SelectOptions: [
                        { value: "null", texto: "Seleccione Tipo Documento" },
                        { value: "DNI", texto: "DNI" },
                        { value: "Pasaporte", texto: "Pasaporte" },
                        {
                          value: "CarneExtranjeria",
                          texto: "Carne de Extranjeria"
                        }
                      ],
                      KeyDato: "TipoDocumento" + index
                    },
                    {
                      tipo: "texto",
                      Title: "Numero de Documento",
                      KeyDato: "DocIdentidad" + index
                    },
                    {
                      tipo: "texto",
                      Title: "Nacionalidad",
                      KeyDato: "Nacionalidad" + index
                    },
                    {
                      tipo: "selector",
                      Title: "Sexo",
                      SelectOptions: [
                        { value: "null", texto: "Seleccionne Sexo" },
                        { value: "masculino", texto: "Masculino" },
                        { value: "femenino", texto: "Femenino" },
                        { value: "otro", texto: "Otro" }
                      ],
                      KeyDato: "Sexo" + index
                    },
                    {
                      tipo: "texto",
                      Title: "Regimen Alimenticio",
                      KeyDato: "RegAlimenticio" + index
                    },
                    {
                      tipo: "texto",
                      Title: "Numero de Celular",
                      KeyDato: "NumCelular" + index
                    },
                    {
                      tipo: "correo",
                      Title: "Correo",
                      KeyDato: "Correo" + index
                    },
                    {
                      tipo: "granTexto",
                      Title: "Alergias",
                      KeyDato: "Alergia" + index
                    },
                    {
                      tipo: "fecha",
                      Title: "Fecha de Nacimiento",
                      KeyDato: "FecNacimiento" + index
                    }
                  ]
                }
              ]
            }}
            ModoEdicion={true}
            Dato={Datos}
            setDato={setDatos}
            key={"ListaPasajeros" + index}
          />
        );
      })}

      {/* {item.map((x,index)=>
                <ListaPasajeros
                    NumPasajeros={index+1}
                    setData={setDatoHijo}
                />
            )} */}
      <button onClick={handleSubmit}>Enviar Datos</button>
    </div>
  );
}
export async function getServerSideProps(context) {
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  let DatosPasajeros = [];

  const Idurl = context.query.llenadoPasajeros;
  let NumPasajeros = "";
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await client.connect();
  let collection = client.db(dbName).collection("ReservaCotizacion");
  let result = await collection.find().project({ _id: 0 }).toArray();
  result.map((x) => {
    if (Idurl == x.IdReservaCotizacion) {
      if (x.listaPasajeros != null) {
        DatosPasajeros = x.listaPasajeros;
      }
      if (x.NpasajerosChild != null) {
        NumPasajeros =
          parseInt(x.NpasajerosAdult) + parseInt(x.NpasajerosChild);
      } else {
        NumPasajeros = parseInt(x.NpasajerosAdult);
      }
    }
  });
  // try {
  //     await client.connect()

  // } catch (error) {

  // }
  return {
    props: {
      NumPasajeros: NumPasajeros,
      DatosPasajeros: DatosPasajeros
    }
  };
}
