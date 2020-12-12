import React, { useState, useEffect } from "react";
import {useRouter} from 'next/router'
import { MongoClient } from "mongodb";

//Componentes
import AutoFormulario from "@/components/AutoFormulario/AutoFormulario";

const ServicioEscogido = ({
  URI_IdReservaCotizacion,
  DataServicios
}) => {
  // --------------------------------------------------------------------------------------
  // Aqui va todo lo necesario para trabajar con el autoFormulario
  const [DarDato, setDarDato] = useState(false);
  let DataNuevaEdit = {};
  const DarDatoFunction = (keyDato, Dato) => {
    DataNuevaEdit[keyDato] = Dato;
  };
  useEffect(() => {
    if (DarDato == true) {
      console.log("estas en modo creacion");
      setDarDato(false);
      console.log(DataNuevaEdit);
      //   console.log(DataNuevaEdit);
      //   fetch(APIpath_i, {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       accion: "Create",
      //       data: DataNuevaEdit,
      //     }),
      //   })
      //     .then((r) => r.json())
      //     .then((data) => {
      //       alert(data.message);
      //     });
    }
  }, [DarDato]);
  // --------------------------------------------------------------------------------------

  //Estados
const [DataServicioEscogido, setDataServicioEscogido] = useState(DataServicios);
const [IdServicioEscogido, setIdServicioEscogido] = useState(URI_IdReservaCotizacion);
// const [OrdenServicio, setOrdenServicio] = useState(false);
const OrdenServicio = useBoolOrdenServicio(DataServicioEscogido.OrdenServicio)
const router = useRouter()
  //Efectos
console.log(DataServicioEscogido)
  return (
    <>
      <div>4
        <span>Servicio</span>{OrdenServicio? <button onClick={()=>{
          router.push(`/reservas/OrdenServicio/${DataServicioEscogido.OrdenServicio['TipoOrden']}/${IdServicioEscogido}`)
        }}>Orden de servicio</button> : <></> } 
      </div>
      <div>
          
        <AutoFormulario
          Formulario={{
            title: "",
            secciones: [
              {
                subTitle: "",
                componentes: [
                  {
                    tipo: "texto",
                    Title: "Nombre de Servicio",
                    KeyDato: "NombreServicio",
                    Dato: DataServicioEscogido.NombreServicio || "",
                  },
                  {
                    tipo: "texto",
                    Title: "Tipo de servicio",
                    KeyDato: "TipoServicio",
                    Dato: DataServicioEscogido.TipoServicio || "",
                  },
                  {
                    tipo: "money",
                    Title: "Precio",
                    KeyDato: "PrecioPublicado",
                    Dato: DataServicioEscogido.PrecioPublicado || "",
                  },
                  {
                    tipo: "money",
                    Title: "Costo",
                    KeyDato: "PrecioConfidencial",
                    Dato: DataServicioEscogido.PrecioConfidencial || "",
                  },
                  {
                    tipo: "fecha",
                    Title: "Fecha inicio",
                    KeyDato: "FechaInicio",
                    Dato:DataServicioEscogido.FechaInicio  || "",
                  },
                  {
                    tipo: "fecha",
                    Title: "Fecha fin",
                    KeyDato: "FechaFin",
                    Dato: DataServicioEscogido.FechaFin || "",
                  },
                  {
                    tipo: "selector",
                    Title: "Encuesta",
                    KeyDato: "Encuesta",
                    Dato: DataServicioEscogido.Encuesta || "",
                    SelectOptions: [
                      { value: 0, texto: "No es necesario una encuesta" },
                      { value: 1, texto: "Se necesita encuesta" },
                    ],
                  },
                  {
                    tipo: "selector",
                    Title: "Informe",
                    KeyDato: "Informe",
                    Dato: DataServicioEscogido.Informe || "",
                    SelectOptions: [
                      { value: 0, texto: "No es necesario un informe" },
                      { value: 1, texto: "Se necesita informe" },
                    ],
                  },
                  {
                    tipo: "fecha",
                    Title: "Fecha de compra real",
                    KeyDato: "FechaCompra",
                    Dato: DataServicioEscogido.FechaCompra || "",
                  },
                  {
                    tipo: "fecha",
                    Title: "Fecha de limite de pago",
                    KeyDato: "FechaLimitePago",
                    Dato: DataServicioEscogido.FechaLimitePago || "",
                  },
                  // {
                  //   tipo: "texto",
                  //   Title: "Informe de impacto medio ambiental",
                  //   KeyDato: "",
                  //   Dato: DataServicioEscogido || "",
                  // }
                  {
                    tipo: "selector",
                    Title: "Informe de impacto medio ambiental",
                    KeyDato: "InformeAmbiental",
                    Dato: DataServicioEscogido.InformeAmbiental || "",
                    SelectOptions: [
                      { value: 0, texto: "No es necesario" },
                      { value: 1, texto: "Es necesario" },
                    ],
                  },
                ],
              },
              {
                subTitle: "",
                componentes: [
                    // {
                    //     tipo: "granTexto",
                    //     Title: "Descripcion",
                    //     KeyDato: "Descripcion",
                    //     Dato: DataServicioEscogido.Descripcion || "",
                    //   },
                      {
                        tipo: "tablaSimple",
                        Title: "Incluye",
                        KeyDato: "Incluye",
                        Dato: DataServicioEscogido.Incluye || "",
                        columnas: [{ field: "Descripcion", title: "Actividad" }],
                      },
                ],
              },
            ],
          }}
          Modo={"verEdicion"}
          DarDato={DarDato}
          DarDatoFunction={DarDatoFunction}
        />
      </div>
    </>
  );
};
export default ServicioEscogido;

export async function getServerSideProps(context) {
//-------------------------------------------------------------------------------
const Id = context.query.IdServicioEscogido;
const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
let DataServicios = {}
try {
    await client.connect();
    let collection = client.db(dbName).collection("ServicioEscogido");
    let result = await collection.findOne({ IdServicioEscogido:  Id});
    // DatosProveedor = JSON.stringify(result);
    // result._id = JSON.stringify(result._id);
    // DatosProveedor = result;
    delete result['_id']
    DataServicios =result
  } catch (error) {
    console.log("Error cliente Mongo 1 => " + error);
  } finally {
    client.close();
  }

//-------------------------------------------------------------------------------
  return {
    props: {
      // DataReservas: result,
      URI_IdReservaCotizacion: Id,
      DataServicios: DataServicios,
    },
  };
}

function useBoolOrdenServicio(OrdenServicio) {
  const [Existe, setExiste] = useState(false);

  useEffect(() => {
    if(OrdenServicio==null){
      setExiste(false)
    }else{
      setExiste(true)
    }
  });

  return Existe;
}
