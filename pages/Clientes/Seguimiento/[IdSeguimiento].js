import { useEffect, useState } from "react";
import { MongoClient } from "mongodb";
import CampoTexto from "@/components/Formulario/CampoTexto/CampoTexto";
import CampoGranTexto from "@/components/Formulario/CampoGranTexto/CampoGranTexto";
import { useRouter } from "next/router";

import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/config";

export default function Seguimiento({ Datos, APIpath }) {
  let x = {};
  const router = useRouter();
  const { IdSeguimiento } = router.query;

  const [dataActualizada, setDataActualizada] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);
  const [datoSeguimiento, setDatoSeguimiento] = useState(false);

  useEffect(() => {
    if (datoSeguimiento == true) {
      // console.log(x)
      setDatoSeguimiento(false);
      setDataActualizada(x);
    }
  }, [datoSeguimiento]);
  useEffect(async () => {
    console.log(dataActualizada);
    if (Object.keys(dataActualizada).length === 0) {
      console.log(dataActualizada);
    } else {
      await fetch(APIpath + `/api/cliente/seguimiento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          IdSeguimiento: IdSeguimiento,
          data: dataActualizada,
          accion: "update"
        })
      })
        .then((r) => r.json())
        .then((data) => {
          alert(data.message);
        });
    }
  }, [dataActualizada]);

  function setData(key, data) {
    x[key] = data;
  }

  const showCampoTexto = [
    {
      Title: "ID",
      ModoEdicion: modoEdicion,
      Dato: Datos.IdSeguimiento,
      DevolverDatoFunct: setData,
      KeyDato: "IdSeguimiento",
      DarDato: datoSeguimiento,
      Reiniciar: false
    },
    {
      Title: "Fecha",
      ModoEdicion: modoEdicion,
      Dato: Datos.Fecha,
      DevolverDatoFunct: setData,
      KeyDato: "Fecha",
      DarDato: datoSeguimiento,
      Reiniciar: false
    },
    {
      Title: "Via de Contacto",
      ModoEdicion: modoEdicion,
      Dato: Datos.ViaContacto,
      DevolverDatoFunct: setData,
      KeyDato: "ViaContacto",
      DarDato: datoSeguimiento,
      Reiniciar: false
    }
  ];
  const showGranTexto = [
    {
      Title: "Descripccion",
      ModoEdicion: modoEdicion,
      Dato: Datos.Descripcion,
      DevolverDatoFunct: setData,
      KeyDato: "Descripcion",
      DarDato: datoSeguimiento,
      Reiniciar: false
    },
    {
      Title: "Problemas",
      ModoEdicion: modoEdicion,
      Dato: Datos.Problemas,
      DevolverDatoFunct: setData,
      KeyDato: "Problemas",
      DarDato: datoSeguimiento,
      Reiniciar: false
    }
  ];
  return (
    <div>
      <h1>Seguimiento</h1>
      <button>
        <img
          src="/resources/save-black-18dp.svg"
          onClick={() => {
            setDatoSeguimiento(true);
            setModoEdicion(false);
            // ReiniciarData()
          }}
        />
      </button>
      <button>
        <img
          src="/resources/edit-black-18dp.svg"
          onClick={(event) => {
            if (modoEdicion == false) {
              event.target.src = "/resources/close-black-18dp.svg";
              setModoEdicion(true);
            } else {
              event.target.src = "/resources/edit-black-18dp.svg";
              setModoEdicion(false);
            }
          }}
        />
      </button>

      {showCampoTexto.map((prop) => (
        <CampoTexto
          Title={prop.Title}
          ModoEdicion={prop.ModoEdicion}
          Dato={prop.Dato}
          DevolverDatoFunct={prop.DevolverDatoFunct}
          DarDato={prop.DarDato}
          KeyDato={prop.KeyDato}
          Reiniciar={prop.Reiniciar}
        />
      ))}
      {showGranTexto.map((prop) => (
        <CampoGranTexto
          Title={prop.Title}
          ModoEdicion={prop.ModoEdicion}
          Dato={prop.Dato}
          DevolverDatoFunct={prop.DevolverDatoFunct}
          DarDato={prop.DarDato}
          KeyDato={prop.KeyDato}
          Reiniciar={prop.Reiniciar}
        />
      ))}
    </div>
  );
}
export async function getServerSideProps(context) {

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
    var Datos = [];
    let urlIdSeg = context.query.IdSeguimiento;
    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;
    const APIpath = process.env.API_DOMAIN;

    let client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    try {
      await client.connect();
      let collection = client.db(dbName).collection("Seguimiento");
      let result = await collection.find({}).project({ _id: 0 }).toArray();
      // DatosProveedor = JSON.stringify(result);
      result.map((x) => {
        if (x.IdSeguimiento == urlIdSeg) {
          Datos = x;
        }
      });
    } catch (error) {
      console.log("Error cliente Mongo 1 => " + error);
    } finally {
      client.close();
    }

    return {
      props: {
        Datos: Datos, APIpath: APIpath
      }
    };


  },
  ironOptions
);
