//packege
import fetch from "isomorphic-unfetch";
import router from "next/router";
import React, { useEffect, useState, createContext, useRef } from "react";
import { MongoClient } from "mongodb";

//css
import CustomStyles from "../../styles/ProgramasTuristicos.module.css";

//modulos
import MaterialTable from "material-table";
import BotonAnadir from "../../components/BotonAnadir/BotonAnadir";
import Tabla from "../../components/TablaModal/Tabla";
import AutoModal_v2 from "@/components/AutoModal_v2/AutoModal_v2";
import FusionProgramas from '@/components/ComponentesUnicos/ProgramaTuristico/FusionProgramas/FusionProgramas';


const ProgramasTuristicos=({
  Columnas,
  Datos,
  APIpath,
  APIpathGeneral,
  ListaServiciosProductos,
})=>{
  console.log(ListaServiciosProductos);
  //--------------- Acciones para que funcione el AutoMdoal --------------
  //--------------------------------------------------------------------
  const [Display, setDisplay] = useState(false);
  const [ModalData, setModalData] = useState({});
  const ModalDisplay = createContext([
    [{}, () => {}],
    [{}, () => {}],
  ]);
  const [Data, setData] = useState({});
  const firstUpdate = useRef(true);

  const DevolverEstructuraFormulario = (FormuData = {}) => {
    return {
      id: FormuData.Id,
      title: "Programas turisticos",
      secciones: [
        {
          subTitle: "Datos del Programas turisticos",
          componentes: [
            {
              tipo: "texto",
              Title: "Nombre",
              KeyDato: "NombrePrograma",
              Dato: FormuData.NombrePrograma,
            },
            {
              tipo: "texto",
              Title: "Condigo",
              KeyDato: "CodigoPrograma",
              Dato: FormuData.CodigoPrograma,
            },
            {
              tipo: "numero",
              Title: "Duracion Dias",
              KeyDato: "DuracionDias",
              Dato: FormuData.DuracionDias,
              InputStep: "1",
            },
            {
              tipo: "numero",
              Title: "Duracion Noches",
              KeyDato: "DuracionNoche",
              Dato: FormuData.DuracionNoche,
              InputStep: "1",
            },
            {
              tipo: "money",
              Title: "Precio estandar",
              KeyDato: "PrecioEstandar",
              Dato: FormuData.PrecioEstandar,
            },
            {
              tipo: "texto",
              Title: "Localizacion",
              KeyDato: "Localizacion",
              Dato: FormuData.Localizacion,
              InputStep: "1",
            },
          ],
        },
        {
          subTitle: "Descripcion",
          componentes: [
            {
              tipo: "granTexto",
              Title: "",
              KeyDato: "Descripcion",
              Dato: FormuData.Descripcion,
            },
          ],
        },
        {
          subTitle: "Itinerario",
          componentes: [
            {
              tipo: "tablaSimple",
              Title: "",
              KeyDato: "Itinerario",
              Dato: FormuData.Itinerario, //deber ser un [] - array - Sino todo explota
              columnas: [
                {
                  field: "Hora Inicio",
                  title: "HoraInicio",
                  initialEditValue: "00:00:00",
                },
                {
                  field: "Hora Fin",
                  title: "HoraFin",
                  initialEditValue: "00:00:00",
                },
                { field: "Actividad", title: "Actividad" },
              ],
            },
          ],
        },
        {
          subTitle: "",
          componentes: [
            {
              tipo: "tablaSimple",
              Title: "Incluye",
              KeyDato: "Incluye",
              Dato: FormuData.Incluye, //deber ser un [] - array - Sino todo explota
              columnas: [{ field: "Actividad", title: "Actividad" }],
            },
            {
              tipo: "tablaSimple",
              Title: "No Incluye",
              KeyDato: "NoIncluye",
              Dato: FormuData.NoIncluye, //deber ser un [] - array - Sino todo explota
              columnas: [{ field: "Actividad", title: "Actividad" }],
            },
          ],
        },
        {
          subTitle: "Recomendaciones para llevar",
          componentes: [
            {
              tipo: "tablaSimple",
              Title: "",
              KeyDato: "RecomendacionesLlevar",
              Dato: FormuData.RecomendacionesLlevar, //deber ser un [] - array - Sino todo explota
              columnas: [{ field: "Recomendacion", title: "Recomendacion" }],
            },
          ],
        },
        {
          subTitle: "Servicios/Productos base del Programa Turistico",
          componentes: [
            {
              tipo: "TablaProgramaServicio_v2",
              Title: "",
              KeyDato: "ServicioProducto",
              Dato: FormuData.ServicioProducto, //deber ser un [] - array - Sino todo explota
              ListaServiciosProductos: ListaServiciosProductos,
            },
          ],
        },
      ],
    };
  };
  const Formulario_default = DevolverEstructuraFormulario({
    Id: null,
    NombrePrograma: "",
    CodigoPrograma:"",
    DuracionDias: 0,
    DuracionNoche: 0,
    PrecioEstandar: 0.0,
    Localizacion: "",
    Descripcion: "",
    Itinerario: [],
    Incluye: [],
    NoIncluye: [],
    RecomendacionesLlevar: [],
    ServicioProducto: [],
  });
  //------------------------------------------------
  //Variables
  const [IdDato, setIdDato] = useState("");
  const [ReiniciarData, setReiniciarData] = useState(false);
  const [Formulario, setFormulario] = useState(Formulario_default);
  const [TablaDatos, setTablaDatos] = useState(Datos);

  //hooks
  useEffect(async () => {
    console.log(IdDato);
    if (IdDato != null && IdDato != "") {
      await fetch(APIpath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idDato: IdDato,
          accion: "FindOne",
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          console.log(data);
          setFormulario(
            DevolverEstructuraFormulario({
              //cAMBIAR ESTA ZONA
              Id: IdDato,
              NombrePrograma: data.result.NombrePrograma,
              CodigoPrograma:data.result.CodigoPrograma,
              DuracionDias: data.result.DuracionDias,
              DuracionNoche: data.result.DuracionNoche,
              PrecioEstandar: data.result.PrecioEstandar,
              Localizacion: data.result.Localizacion,
              Descripcion: data.result.Descripcion,
              Itinerario: data.result.Itinerario,
              Incluye: data.result.Incluye,
              NoIncluye: data.result.NoIncluye,
              RecomendacionesLlevar: data.result.RecomendacionesLlevar,
              ServicioProducto: data.result.ServicioProducto || [],
            })
          );
        });
      setDisplay(true);
    }
  }, [IdDato]);
  useEffect(async () => {
    if (ReiniciarData == true) {
      let ActuTablaDatos = [];
      await fetch(APIpath)
        .then((r) => r.json())
        .then((data) => {
          // console.log(data)
          data.result.map((datosResult) => {
            ActuTablaDatos.push({
              IdProgramaTuristico: datosResult.IdProgramaTuristico,
              NombrePrograma: datosResult.NombrePrograma,
              Localizacion: datosResult.Localizacion,
              DuracionDias: datosResult.DuracionDias,
              DuracionNoche: datosResult.DuracionNoche,
            });
          });
          setTablaDatos(ActuTablaDatos);
        });
      setReiniciarData(false);
    }
  }, [ReiniciarData]);
  useEffect(() => {
    // Seguros para no subir datos no validos
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if(ModalData["NombrePrograma"]== null || ModalData["NombrePrograma"]== undefined){
      console.log('Grave error evitado')
      return;
    }

    if (ModalData["IdProgramaTuristico"] == null) {
      fetch(APIpathGeneral, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "Insert",
          coleccion: "ProgramaTuristico",
          keyId: "IdProgramaTuristico",
          Prefijo: "PT",
          data: ModalData,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          alert(data.message);
        });
    } else {
      fetch(APIpathGeneral, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "update",
          coleccion: "ProgramaTuristico",
          query: { IdProgramaTuristico: ModalData["IdProgramaTuristico"] },
          data: ModalData,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          alert(data.message);
        });
    }
  }, [ModalData]);

  return (
    <div>
      <ModalDisplay.Provider
        value={[
          [Display, setDisplay],
          [ModalData, setModalData],
        ]}
      >
        {/* <AutoModal_v2
          Formulario={Formulario}
          ModalDisplay={ModalDisplay} //Contexto - Por si lo preguntaban
          IdDato={"IdProgramaTuristico"}
        /> */}
      
      <span className={CustomStyles.titulo}>Programas turisticos</span>
      <button
        onClick={(event) => {
          setIdDato(null);
          setFormulario(Formulario_default);
          setDisplay(true);
        }}
      >
        Nuevo Programa Turistico
      </button>
      <div className={CustomStyles.tituloBox}>
        <MaterialTable
          columns={Columnas}
          data={TablaDatos}
          title="Programas turisticos"
          actions={[
            {
              icon: () => {
                return <img src="/resources/remove_red_eye-24px.svg" />;
              },
              tooltip: "Save User",
              onClick: (event, rowData) => {
                setIdDato(rowData.IdProgramaTuristico);
                // setDisplay(true);
              },
            },
            (rowData) => ({
              icon: () => {
                return <img src="/resources/delete-black-18dp.svg" />;
              },
              tooltip: "Delete User",
              onClick: (event, rowData) => {
                const dataDelete = [...TablaDatos];
                const index = rowData.tableData.id;
                dataDelete.splice(index, 1);
                setTablaDatos([...dataDelete]);

                fetch(APIpathGeneral, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    accion: "DeleteOne",
                    coleccion: "ProgramaTuristico",
                    query: {'IdProgramaTuristico':rowData['IdProgramaTuristico']}
                  }),
                })
                  .then((r) => r.json())
                  .then((data) => {
                    alert(data.message);
                  });
              },
            }),
          ]}
          options={{
            actionsColumnIndex: -1,
          }}
        />
      </div>
      <div>
        <span>Opciones Avanzadas</span>
        {/* <FusionProgramas 
          TablaDatos={TablaDatos}
          DevolverEstructuraFormulario={DevolverEstructuraFormulario}
          ModalDisplay={ModalDisplay}
        /> */}
      </div>
      </ModalDisplay.Provider>
    </div>
  );
}


export async function getServerSideProps() { 
  const APIpath = process.env.API_DOMAIN + "/api/programasTuristicos";
  const APIpathGeneral = process.env.API_DOMAIN + "/api/general";

  let Columnas = [
    { title: "Id", field: "IdProgramaTuristico", hidden: true},
    { title: "Nombre", field: "NombrePrograma" },
    { title: "Codigo", field: "CodigoPrograma" },
    { title: "Localizacion", field: "Localizacion" },
    { title: "Duracion Dias", field: "DuracionDias" },
    { title: "Duracion Noches", field: "DuracionNoche" },
  ];
  let Datos = [];
  console.log(process.env.API_DOMAIN);
  // Optencion de datos para la tabla
  await fetch(APIpath)
    .then((r) => r.json())
    .then((data) => {
      // console.log(data)
      data.result.map((datosResult) => {
        // console.log(datosResult)
        Datos.push({
          IdProgramaTuristico: datosResult.IdProgramaTuristico,
          CodigoPrograma:datosResult.CodigoPrograma || null,
          NombrePrograma: datosResult.NombrePrograma,
          Localizacion: datosResult.Localizacion,
          DuracionDias: datosResult.DuracionDias,
          DuracionNoche: datosResult.DuracionNoche,
        });
      });
    });
  

  //------------------------------------- obtencion de datos de probedores -----------------------------
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let ListaServiciosProductos = [];

  try {
    await client.connect();
    const dbo = client.db(dbName);
    // Proveedores
    let collection = dbo.collection("Proveedor");
    let resultProveedores = await collection
      .find({})
      .project({
        _id: 0,
        nombre: 1,
        tipo: 1,
        idProveedor: 1,
        porcentajeTotal: 1,
        TipoMoneda: 1,
      })
      .toArray();
    console.log(resultProveedores);
    // Hotel
    collection = dbo.collection("ProductoHoteles");
    let result = await collection
      .find({})
      .project({
        _id: 0,
      })
      .toArray();
    console.log(result);
    result.map((x) => {
      let proveedor = resultProveedores.find((value) => {
        return value["idProveedor"] == x["idProveedor"];
      });
      ListaServiciosProductos.push({
        IdServicioProducto: x["IdProductoHotel"] || null,
        TipoServicio: "Hotel" || null,
        Nombre: x["TipoPaxs"] + " - " + x["tipoHabitacion"] || null,
        Descripcion:
          "Cama Adicional: " +
            (x["camAdic"] ? "si" : "no") +
            " - Descripcion: " +
            x["descripcionHabitacion"] || null,
        Precio: x["precioCoti"] || 0.0,
        Costo: x["precioConfi"] || 0.0,
        NombreProveedor: proveedor["nombre"],
        PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
        Currency: proveedor["TipoMoneda"] || null,
        PrecioPublicado: x["precioPubli"] || null,
      });
    });
    // Restaurantes
    collection = dbo.collection("ProductoRestaurantes");
    result = await collection
      .find({})
      .project({
        _id: 0,
      })
      .toArray();
    result.map((x) => {
      let proveedor = resultProveedores.find((value) => {
        return value["idProveedor"] == x["idProveedor"];
      });
      ListaServiciosProductos.push({
        IdServicioProducto: x["IdProductoRestaurantes"] || null,
        TipoServicio: "Restaurante" || null,
        Nombre:
          x["codServicio"] + " - " + x["servicio"] + " - " + x["TipoPaxs"] ||
          null,
        Descripcion: "Caracteristicas: " + x["caracte"] || null,
        Precio: x["precioCoti"] || 0.0,
        Costo: x["precioConfi"] || 0.0,
        NombreProveedor: proveedor["nombre"],
        PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
        Currency: proveedor["TipoMoneda"] || null,
        PrecioPublicado: x["precioPubli"] || null,
      });
    });
    //Transporte Terrestre
    collection = dbo.collection("ProductoTransportes");
    result = await collection
      .find({})
      .project({
        _id: 0,
      })
      .toArray();
    result.map((x) => {
      let proveedor = resultProveedores.find((value) => {
        return value["idProveedor"] == x["idProveedor"];
      });
      ListaServiciosProductos.push({
        IdServicioProducto: x["IdProductoTransportes"] || null,
        TipoServicio: "Transporte Terrestre" || null,
        Nombre:
          x["codServicio"] +
            " / " +
            x["EtapaPaxs"] +
            " / " +
            x["TipoPaxs"] +
            " / " +
            x["servicio"] +
            " / Horario:" +
            x["horario"] || null,
        Descripcion: "Tipo de Vehiculo: " + x["tipvehiculo"] || null,
        Precio: x["precioCoti"] || 0.0,
        Costo: x["precioConfi"] || 0.0,
        NombreProveedor: proveedor["nombre"],
        PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
        Currency: proveedor["TipoMoneda"] || null,
        PrecioPublicado: x["precioPubli"] || null,
      });
    });
    //Guia
    collection = dbo.collection("ProductoGuias");
    result = await collection
      .find({})
      .project({
        _id: 0,
      })
      .toArray();
    result.map((x) => {
      let proveedor = resultProveedores.find((value) => {
        return value["idProveedor"] == x["idProveedor"];
      });
      ListaServiciosProductos.push({
        IdServicioProducto: x["IdProductoGuias"] || null,
        TipoServicio: "Guias" || null,
        Nombre:
          x["codServicio"] + " - " + x["TipoPaxs"] + " - " + x["gremio"] ||
          null,
        Descripcion:
          "N° Carne: " +
            x["carne"] +
            "; Idioma: " +
            x["idiomas"] +
            "; DNI: " +
            x["dni"] || null,
        Precio: x["precioCoti"] || 0.0,
        Costo: x["precioConfi"] || 0.0,
        NombreProveedor: proveedor["nombre"],
        PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
        Currency: proveedor["TipoMoneda"] || null,
        PrecioPublicado: x["precioPubli"] || null,
      });
    });
    //Agencia
    collection = dbo.collection("ProductoAgencias");
    result = await collection
      .find({})
      .project({
        _id: 0,
      })
      .toArray();
    result.map((x) => {
      let proveedor = resultProveedores.find((value) => {
        return value["idProveedor"] == x["idProveedor"];
      });
      ListaServiciosProductos.push({
        IdServicioProducto: x["IdProductoHotel"] || null,
        TipoServicio: "Agencia" || null,
        Nombre:
          x["codServicio"] + " - " + x["TipoPaxs"] + " - " + x["servicio"] ||
          null,
        Descripcion: "Duracion: " + x["duracion"] || null,
        Precio: x["precioCoti"] || 0.0,
        Costo: x["precioConfi"] || 0.0,
        NombreProveedor: proveedor["nombre"],
        PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
        Currency: proveedor["TipoMoneda"] || null,
        PrecioPublicado: x["precioPubli"] || null,
      });
    });
    // Transporte Ferroviario
    collection = dbo.collection("ProductoTransFerroviario");
    result = await collection
      .find({})
      .project({
        _id: 0,
      })
      .toArray();
    result.map((x) => {
      let proveedor = resultProveedores.find((value) => {
        return value["idProveedor"] == x["idProveedor"];
      });
      ListaServiciosProductos.push({
        IdServicioProducto: x["IdProductoTransFerroviario"] || null,
        TipoServicio: "Transporte Ferroviario" || null,
        Nombre:
          x["TipoPaxs"] +
            " / " +
            x["EtapaPaxs"] +
            " / " +
            x["ruta"] +
            "/ Horario:" +
            x["salida"] +
            "-" +
            x["llegada"] || null,
        Descripcion: "Tipo de tren: " + x["tipoTren"] || null,
        Precio: x["precioCoti"] || 0.0,
        Costo: x["precioConfi"] || 0.0,
        NombreProveedor: proveedor["nombre"],
        PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
        Currency: proveedor["TipoMoneda"] || null,
        PrecioPublicado: x["precioPubli"] || null,
      });
    });
    // Otro
    collection = dbo.collection("ProductoOtros");
    result = await collection
      .find({})
      .project({
        _id: 0,
      })
      .toArray();
    result.map((x) => {
      let proveedor = resultProveedores.find((value) => {
        return value["idProveedor"] == x["idProveedor"];
      });
      ListaServiciosProductos.push({
        IdServicioProducto: x["IdProductoOtros"] || null,
        TipoServicio: "Transporte Ferroviario" || null,
        Nombre:
          x["codServicio"] + " - " + x["TipoPaxs"] + " - " + x["servicio"] ||
          null,
        Descripcion: x["Descripcion"] || null,
        Precio: x["precioCoti"] || 0.0,
        Costo: x["precioConfi"] || 0.0,
        NombreProveedor: proveedor["nombre"],
        PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
        Currency: proveedor["TipoMoneda"] || null,
        PrecioPublicado: x["precioPubli"] || null,
      });
    });
  } catch (error) {
    console.log("error - " + error);
  }

  return {
    props: {
      Columnas: Columnas,
      Datos: Datos,
      APIpath: APIpath,
      APIpathGeneral: APIpathGeneral,
      ListaServiciosProductos: ListaServiciosProductos,
    },
  };
}

export default ProgramasTuristicos;

