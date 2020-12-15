import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MongoClient } from "mongodb";

//Componentes
import AutoFormulario from "@/components/AutoFormulario/AutoFormulario";

const ServicioEscogido = ({
  URI_IdReservaCotizacion,
  DataServicios,
  DataProductosTodos,
  ColumnasProductosTodos,
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
  const TipoProveedor = DataServicios['TipoServicio']
  //Estados
  const [DataServicioEscogido, setDataServicioEscogido] = useState(DataServicios);
  const [IdServicioEscogido, setIdServicioEscogido] = useState(URI_IdReservaCotizacion);
  const [DT_DataProductosTodos, setDT_DataProductosTodos] = useState(DataProductosTodos);
  const [DT_ColumnasProductosTodos, setDT_ColumnasProductosTodos] = useState(ColumnasProductosTodos);
  // const [OrdenServicio, setOrdenServicio] = useState(false);
  const OrdenServicio = useBoolOrdenServicio(
    DataServicioEscogido.OrdenServicio
  );
  const router = useRouter();
  //Efectos
  return (
    <>
      <div>
        <span>Servicio</span>
        {OrdenServicio ? (
          <button
            onClick={() => {
              router.push(
                `/reservas/OrdenServicio/${DataServicioEscogido.OrdenServicio["TipoOrden"]}/${IdServicioEscogido}`
              );
            }}
          >
            Orden de servicio
          </button>
        ) : (
          <></>
        )}
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
                    Dato: DataServicioEscogido.FechaInicio || "",
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
                  {
                    tipo: "TablaProductoServicio",
                    Title: "Producto/Servicio",
                    KeyDato: "ProdServSeleccionados",
                    DataProductosSeleccionados: DataServicioEscogido.ProdServSeleccionados || [],
                    DataProductosTodos:DataProductosTodos,
                    columnas: ColumnasProductosTodos,
                    TipoProveedor:TipoProveedor
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
  let DataServicios = {};
  try {
    await client.connect();
    let collection = client.db(dbName).collection("ServicioEscogido");
    let result = await collection.findOne({ IdServicioEscogido: Id });
    // DatosProveedor = JSON.stringify(result);
    // result._id = JSON.stringify(result._id);
    // DatosProveedor = result;
    delete result["_id"];
    DataServicios = result;
  } catch (error) {
    console.log("Error cliente Mongo 1 => " + error);
  } finally {
    client.close();
  }
  /**************************************************************************** */
  let DataProductosTodos = [];
  let ColumnasProductosTodos = [];
  switch (DataServicios["TipoServicio"].toLowerCase()) {
    case "hotel":
      ColumnasProductosTodos = [
        // { title: "ID Producto Hotel", field: "IdProductoHotel" },
        { title: "tipoTarifa", field: "tipoTarifa" },
        {
          title: "TipoHabitacion",
          field: "tipoHabitacion",
          lookup: {
            Simple: "Simple",
            Doble: "Doble",
            Mwfamiliar: "Mw familiar",
            Triple: "Triple",
            Familiar: "Familiar",
            Suit: "Suit",
            Semisuit: "Semisuit",
          },
        },
        { title: "DescripHabitacion", field: "descripcionHabitacion" },
        {
          title: "Cama Adicional",
          field: "camAdic",
          type: "boolean",
        },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "IGV", field: "igv" },
      ];
      break;
    case "restaurante":
      ColumnasProductosTodos = [
        { title: "Servicio", field: "servicio" },
        { title: "Precio", field: "precio" },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Caracteristicas", field: "caracte" },
      ];
      break;
    case "transporteterrestre":
      ColumnasProductosTodos = [
        { title: "Servicio", field: "servicio" },
        { title: "Horario", field: "horario" },
        { title: "Tipo de Vehiculo", field: "tipvehiculo" },
        { title: "Precio Soles", field: "PrecioSoles" },
      ];
      break;
    case "guia":
      ColumnasProductosTodos = [
        { title: "Direccion", field: "direccion" },
        { title: "DNI", field: "dni" },
        { title: "Idiomas", field: "idiomas" },
        { title: "Gremio", field: "gremio" },
        { title: "N° Carne", field: "carne" },
        { title: "Fecha Expedicion", field: "fecExpedi", type: "date" },
        { title: "Fecha Caducidad", field: "fecCaduc", type: "date" },
      ];
      break;
    case "agencia":
      ColumnasProductosTodos = [
        { title: "Nombre del Servicio", field: "servicio" },
        { title: "codigo del Servicio", field: "codServicio" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
        { title: "Incluye", field: "incluye" },
        { title: "Duracion", field: "duracion" },
        { title: "Observacion", field: "observacion" },
      ];
      break;
    case "transporteferroviario":
      ColumnasProductosTodos = [
        { title: "Ruta", field: "ruta" },
        { title: "Hora Salida", field: "salida" },
        { title: "Hora Llegada", field: "llegada" },
        {
          title: "Tipo de Tren",
          field: "tipoTren",
        },
        {
          title: "Precio Adulto Confi",
          field: "precioAdultoConfi",
          type: "numeric",
        },
        {
          title: "Precio Niño Confi",
          field: "precioNiñoConfi",
          type: "numeric",
        },
        {
          title: "Precio Guia Confi",
          field: "precioGuiaConfi",
          type: "numeric",
        },
        {
          title: "Precio Adulto Publi",
          field: "precioAdultoPubli",
          type: "numeric",
        },
        {
          title: "Precio Niño Publi",
          field: "precioNiñoPubli",
          type: "numeric",
        },
        {
          title: "Precio Guia Publi",
          field: "precioGuiaPubli",
          type: "numeric",
        },
      ];
      break;
    case "otro":
      ColumnasProductosTodos = [
        { title: "Nombre del Servicio o Producto", field: "servicio" },
        { title: "codigo del Servicio o Producto", field: "codServicio" },
        { title: "Precio Confidencial", field: "precioConfi", type: "numeric" },
        { title: "Precio Publicado", field: "precioPubli", type: "numeric" },
      ];
      break;
  }

  client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  let collectionName = "";
  
  switch (DataServicios["TipoServicio"].toLowerCase()) {
    case "hotel":
      collectionName = "ProductoHoteles";
      break;
    case "restaurante":
      collectionName = "ProductoRestaurantes";
      break;
    case "transporteterrestre":
      collectionName = "ProductoTransportes";
      break;
    case "guia":
      collectionName = "ProductoGuias";
      break;
    case "agencia":
      collectionName = "ProductoAgencias";
      break;
    case "transporteferroviario":
      collectionName = "ProductoTransFerroviario";
      break;
    case "otro":
      collectionName = "ProductoOtros";
      break;
  }
  let collection = client.db(dbName).collection(collectionName);
  // await collection.find().toArray((err, result) => {
  //   if (err) {
  //     console.log(err);
  //     throw err;
  //   }
  //   console.log("El de abajo es puto");
  //   console.log(result);
  //   DataProductosTodos = [...result];
  //   console.log(DataProductosTodos);
  //   client.close();
  // });
  let res = await collection.find().toArray()
  res.map(ele=>{
    delete ele['_id']
  })
  DataProductosTodos=res
  // console.log("El de abajo es puto")
  // console.log(DataProductosTodos)
  //-------------------------------------------------------------------------------
  return {
    props: {
      // DataReservas: result,
      URI_IdReservaCotizacion: Id,
      DataServicios: DataServicios,
      DataProductosTodos: DataProductosTodos,
      ColumnasProductosTodos: ColumnasProductosTodos,
    },
  };
}

function useBoolOrdenServicio(OrdenServicio) {
  const [Existe, setExiste] = useState(false);

  useEffect(() => {
    if (OrdenServicio == null) {
      setExiste(false);
    } else {
      setExiste(true);
    }
  });

  return Existe;
}
