import MaterialTable, { MTableToolbar } from "material-table";
import Router from "next/router";
import BotonAnadir from "components/BotonAnadir/BotonAnadir";
import { MongoClient } from "mongodb";
import { withIronSessionSsr } from "iron-session/next";
import { useEffect, useState } from "react";
import { ironOptions } from "@/utils/config";

// CSS
// import styles from "@/globalStyles/login.module.css";
import global_style from "@/globalStyles/modules/global.module.css";
import botones from "@/globalStyles/modules/boton.module.css";

// Componentes
import ModalNuevoPeriodo from "@/components/ComponentesUnicos/MatrizEvaProv/ModalNuevoPeriodo/ModalNuevoPeriodo";

export default function Home({
  datosPeriodo,
  datosActividad,
  datosProv,
  datosEvaAct,
  APIpath
}) {
  let datosTabla = [];
  let arrayEvaluacion = [];
  let objetoDatos = {};
  var objetoPeriodo = {};

  const [datosTablaShow, setDatosTablaShow] = useState([]);
  const [datoPeriodo, setdatoPeriodo] = useState();
  const [datoPeriodoSeleccionado, setDatoPeriodoSeleccionado] =
    useState("noperiodo");
  const [selectPeriodo, setSelectPeriodo] = useState([]);
  // const [selectPeriodoActivo, setSelectPeriodoActivo] = useState([])
  const [datoPeriodoActivo, setdatoPeriodoActivo] = useState(null);

  function compare(a, b) {
    let comp = 0;
    if (a.IdProveedor > b.IdProveedor) {
      comp = 1;
    } else if (a.IdProveedor < b.IdProveedor) {
      comp = -1;
    }
    return comp;
  }

  function EnviarEvaluacionPeriodo() {
    let objetoIdProvEvaProv = [];
    let ArrayPocentajeProvEvaProv = [];
    let objetoPocentajeProvEvaProv = {};

    datosTablaShow.map((x) => {
      objetoIdProvEvaProv.push(x.IdProveedor);
      // objetoPocentajeProvEvaProv[porcentajeTotal,periodoActual] = x.porcentajeTotal,datoPeriodoSeleccionado
      objetoPocentajeProvEvaProv = {
        proveedor: x.IdProveedor,
        porcentajeTotal: x.porcentajeTotal,
        periodoActual: datoPeriodoSeleccionado
      };
      if (objetoPocentajeProvEvaProv.porcentajeTotal == undefined) {
        objetoPocentajeProvEvaProv.porcentajeTotal = null;
      }
      ArrayPocentajeProvEvaProv.push(objetoPocentajeProvEvaProv);
    });
    console.log(objetoIdProvEvaProv);
    console.log(ArrayPocentajeProvEvaProv);

    ArrayPocentajeProvEvaProv.map((x) => {
      let y = {
        porcentajeTotal: x.porcentajeTotal,
        periodoActual: x.periodoActual
      };
      fetch(APIpath + `/proveedores/listaProveedores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          IdProveedor: x.proveedor,
          data: y,
          accion: "update"
        })
      })
        .then((r) => r.json())
        .then((data) => {
          console.log(data.message);
        });
    });

    setdatoPeriodoActivo(datoPeriodoSeleccionado);
  }

  /* ----------------------------------------------------------------------- */
  useEffect(() => {
    let filtroPeriodo = datosEvaAct.filter((row) => {
      return row.periodo == datoPeriodoSeleccionado;
    });

    let filtroPeriodoOrdenado = filtroPeriodo.sort(compare);
    let datosProvOrdenado = datosProv.sort(compare);

    datosProvOrdenado.map((x) => {
      filtroPeriodoOrdenado.map((y) => {
        if (x.IdProveedor == y.IdProveedor) {
          datosTabla.push({
            IdProveedor: y.IdProveedor,
            nombre: x.nombre,
            tipo: x.tipo,
            puntosTotales: y.puntosTotales,
            porcentajeTotal: y.porcentajeTotal
          });
        }
      });
    });

    setDatosTablaShow(datosTabla);
  }, [datoPeriodoSeleccionado]);

  useEffect(() => {
    var x = [];
    //  console.log(datosPeriodo)
    datosPeriodo.map((value) => {
      objetoPeriodo = { value: value, texto: value };
      x.push(objetoPeriodo);
    });

    setSelectPeriodo(x);
  }, []);

  return (
    <div className={global_style.main_work_space_container}>
      <div className={`${global_style.title_and_buttons_container}`}>
        <h2>Matriz de evaluacion</h2>
        <ModalNuevoPeriodo
          ListaProveedores={datosProv}
          ListaActividades={datosActividad}
        />
        <button
          className={`${botones.button} ${botones.GenerickButton} ${botones.button_border}`}
          type="button"
          onClick={() => {
            EnviarEvaluacionPeriodo();
          }}
        >
          Enviar evaluacion de periodo
        </button>
      </div>

      <form>
        {/* <label>Ingrese Periodo:</label>
        <input
          type="text"
          value={datoPeriodo}
          onChange={(e) => setdatoPeriodo(e.target.value)}
        ></input> */}
        {/* <br /> */}
        {/* <input type="submit" value="submit"></input> */}

        <div className={`${global_style.global_textInput_container}`}>
          <label>Selecccione Periodo:</label>
          <select
            value={datoPeriodoSeleccionado}
            onChange={(e) => {
              setDatoPeriodoSeleccionado(e.target.value);
            }}
          >
            <option selected value="sinvalor">
              Seleccione Periodo
            </option>
            {selectPeriodo.map((options) => {
              return <option value={options.value}>{options.texto}</option>;
            })}
          </select>
        </div>
        {/* <label>
              Selecccione Periodo Actual:
            </label>
            <select value={datoPeriodoActivo} onChange={(e)=>{
              setdatoPeriodoActivo(e.target.value)
            }}>
            {selectPeriodo.map(options => {
              return <option value={options.value}>{options.texto}</option>
            })}
            </select>             */}
        {datoPeriodoActivo ? (
          <div className={`${global_style.global_textInput_container}`}>
            <span>El periodo Activo actual es: {datoPeriodoActivo}</span>
          </div>
        ) : (
          <></>
        )}
      </form>

      <MaterialTable
        columns={Columnas}
        data={datosTablaShow}
        components={{
          Toolbar: (props) => <div></div>
        }}
        actions={[
          {
            icon: () => {
              return <img src="/resources/edit-black-18dp.svg" />;
            },
            tooltip: "Añadir Evaluacion",
            onClick: (event, rowData) =>
              Router.push({
                pathname: `/MatrizEvaProv/Actcrit`
              })
          },
          {
            icon: () => {
              return <img src="/resources/remove_red_eye-24px.svg" />;
            },
            tooltip: "Mostrar Evaluacion",
            onClick: (event, rowData) => {
              let y = rowData.IdProveedor.concat("", datoPeriodoSeleccionado);
              Router.push({
                pathname: `/MatrizEvaProv/${y}`
              });
              // setUrlProv(rowData.IdProveedor)
              // setUrlPeriodo(datoPeriodoSeleccionado)
            }
          }
        ]}
        options={{
          filtering: true,
          actionsColumnIndex: -1
        }}
        title="Matriz de Evaluacion de Proveedores"
      />
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res }) {
    const user = req.session.user;
    if (!user) {
      return {
        redirect: {
          permanent: false,
          destination: "/login"
        }
      };
    }
    //---------------------------------------------------------------------------------------------------------------------

    let datosPeriodo = [];
    let datosProv = [];
    let datosActividad = [];
    var datosEvaAct = [];

    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;
    const APIpath = process.env.API_DOMAIN;

    let client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    try {
      client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      await client.connect();
      const dbo = client.db(dbName);
      const collection = dbo.collection("Proveedor");

      let result = await collection
        .find({})
        .project({
          _id: 0,
          TipoDocumento: 0,
          NroDocumento: 0,
          TipoMoneda: 0,
          EnlaceDocumento: 0,
          GerenteGeneral: 0,
          NEstrellas: 0,
          Web: 0,
          Estado: 0,
          RazonSocial: 0,
          celular: 0,
          celular2: 0,
          email: 0,
          email2: 0,
          DireccionFiscal: 0,
          DatosBancarios: 0,
          Destino: 0,
          Email: 0,
          NumContac: 0,
          Encuesta: 0
        })
        .toArray();
      datosProv = result;
    } catch (error) {
      console.log("error - " + error);
    } finally {
      client.close();
    }
    try {
      client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      await client.connect();
      const dbo = client.db(dbName);
      const collection = dbo.collection("EvaluacionActividad");

      let result = await collection
        .find({})
        .project({
          _id: 0,
          evaperiodo: 0,
          IdEvaluacionActividad: 0
        })
        .toArray();
      datosEvaAct = result;
    } catch (error) {
      console.log("error - " + error);
    } finally {
      client.close();
    }
    try {
      let client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      await client.connect();
      const dbo = client.db(dbName);
      const collection = dbo.collection("Actividad");

      let result = await collection.find({}).project({ _id: 0 }).toArray();

      datosActividad = result;
    } catch (error) {
      console.log("error - " + error);
    } finally {
      client.close();
    }

    try {
      client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      await client.connect();
      const dbo = client.db(dbName);
      const collection = dbo.collection("EvaluacionActividad");

      let result = await collection.distinct("periodo");

      datosPeriodo = result;
    } catch (error) {
      console.log("error - " + error);
    } finally {
      client.close();
    }
    return {
      props: {
        datosPeriodo: datosPeriodo,
        datosActividad: datosActividad,
        datosEvaAct: datosEvaAct,
        datosProv: datosProv,
        APIpath: APIpath
      }
    };
  },
  ironOptions
);

const Columnas = [
  {
    title: "Id",
    field: "IdProveedor",
    hidden: true
  },
  {
    title: "Proveedor",
    field: "nombre",
    filtering: false
  },
  {
    title: "Tipo Proveedor",
    field: "tipo",
    lookup: {
      Hotel: "Hotel",
      Agencia: "Agencia",
      Guia: "Guia",
      TransporteTerrestre: "Transporte Terrestre",
      SitioTuristico: "Sitio Turistico",
      Restaurante: "Restaurante",
      TransporteFerroviario: "Transporte Ferroviario",
      Otro: "Otro"
    }
  },
  { title: "Puntaje", field: "puntosTotales", filtering: false },
  { title: "Porcentaje", field: "porcentajeTotal", filtering: false }
];
