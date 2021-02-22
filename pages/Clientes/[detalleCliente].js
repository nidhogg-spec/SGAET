import CampoTexto from "@/components/Formulario/CampoTexto/CampoTexto";
import CampoGranTexto from "@/components/Formulario/CampoGranTexto/CampoGranTexto";
import MaterialTable from "material-table";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MongoClient } from "mongodb";

export default function detalleCliente({ Datos, DatosSeguimiento }) {
  let x = {};
  const router = useRouter();
  const { detalleCliente } = router.query;

  const [dataActualizada, setDataActualizada] = useState({});
  const [datosTablaSeguimiento, setDatosTablaSeguimiento] = useState(
    DatosSeguimiento
  );
  const [modoEdicion, setModoEdicion] = useState(false);
  const [datosPersonales, setDatosPersonales] = useState(false);

  const Columnas = [
    { title: "ID", field: "IdSeguimiento", hidden: true },
    { title: "Fecha", field: "Fecha", type: "date" },
    { title: "Via Contacto", field: "ViaContacto" },
    { title: "Descripcion", field: "Descripcion" }
  ];
  // console.log(Datos)
  useEffect(() => {
    if (datosPersonales == true) {
      // console.log(x)
      setDataActualizada(x);
      setDatosPersonales(false);
    }
  }, [datosPersonales]);

  useEffect(async () => {
    // console.log(dataActualizada)
    // dataActualizada.map(x=>{
    //     console.log(x)
    // })
    // console.log(Object.keys(dataActualizada).length)
    if (Object.keys(dataActualizada).length === 0) {
      console.log(dataActualizada);
    } else {
      fetch(`http://localhost:3000/api/cliente/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idProducto: detalleCliente,
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
  const showdatosPersonales = [
    {
      Title: "Nombre",
      ModoEdicion: modoEdicion,
      Dato: Datos.Nombre,
      DevolverDatoFunct: setData,
      KeyDato: "Nombre",
      DarDato: datosPersonales,
      Reiniciar: false
    },
    {
      Title: "Apellido",
      ModoEdicion: modoEdicion,
      Dato: Datos.Apellido,
      DevolverDatoFunct: setData,
      KeyDato: "Apellido",
      DarDato: datosPersonales,
      Reiniciar: false
    },
    {
      Title: "Nacionalidad",
      ModoEdicion: modoEdicion,
      Dato: Datos.Nacionalidad,
      DevolverDatoFunct: setData,
      KeyDato: "Nacionalidad",
      DarDato: datosPersonales,
      Reiniciar: false
    },
    {
      Title: "Sexo",
      ModoEdicion: modoEdicion,
      DevolverDatoFunct: setData,
      KeyDato: "Sexo",
      DarDato: datosPersonales,
      Dato: Datos.Sexo,
      Reiniciar: false
    },
    {
      Title: "Edad",
      ModoEdicion: modoEdicion,
      DevolverDatoFunct: setData,
      KeyDato: "Edad",
      DarDato: datosPersonales,
      Dato: Datos.Edad,
      Reiniciar: false
    },
    {
      Title: "Fecha de Nacimiento",
      ModoEdicion: modoEdicion,
      DevolverDatoFunct: setData,
      KeyDato: "FechaNacimi",
      DarDato: datosPersonales,
      Dato: Datos.FechaNacimi,
      Reiniciar: false
    },
    {
      Title: "Numero de Documento",
      ModoEdicion: modoEdicion,
      Dato: Datos.NroDocumento,
      DevolverDatoFunct: setData,
      KeyDato: "NroDocumento",
      DarDato: datosPersonales,
      Reiniciar: false
    },
    {
      Title: "Tipo de Documento",
      ModoEdicion: modoEdicion,
      Dato: Datos.TipoDocumento,
      DevolverDatoFunct: setData,
      KeyDato: "TipoDoc",
      DarDato: datosPersonales,
      Reiniciar: false
    },
    {
      Title: "Etapa de vida",
      ModoEdicion: modoEdicion,
      DevolverDatoFunct: setData,
      KeyDato: "Etapavida",
      DarDato: datosPersonales,
      Dato: Datos.Etapavida,
      Reiniciar: false
    }
  ];
  const showdatosAfiliamiento = [
    {
      Title: "Tipo de Cliente",
      ModoEdicion: modoEdicion,
      Dato: Datos.Tipocliente,
      DevolverDatoFunct: setData,
      KeyDato: "TipoCliente",
      DarDato: datosPersonales,
      Reiniciar: false
    },
    {
      Title: "Empresa Afiliada",
      ModoEdicion: modoEdicion,
      DevolverDatoFunct: setData,
      KeyDato: "EmpresaAfiliada",
      DarDato: datosPersonales,
      Dato: Datos.EmpresaAfiliada,
      Reiniciar: false
    }
  ];
  const showdatosAlimentacion = [
    {
      Title: "Tipo de Regimen Alimenticio",
      ModoEdicion: modoEdicion,
      Dato: "",
      DevolverDatoFunct: setData,
      KeyDato: "TipRegAlimen",
      DarDato: datosPersonales,
      Reiniciar: false
    },
    {
      Title: "Observacion",
      ModoEdicion: modoEdicion,
      DevolverDatoFunct: setData,
      KeyDato: "Observacion",
      DarDato: datosPersonales,
      Dato: Datos.Observacion,
      Reiniciar: false
    }
  ];
  const showdatosMedicos = [
    {
      Title: "Alergias",
      ModoEdicion: modoEdicion,
      DevolverDatoFunct: setData,
      KeyDato: "Alergias",
      DarDato: datosPersonales,
      Dato: Datos.Alergias,
      Reiniciar: false
    },
    {
      Title: "Descripcion Alergia",
      ModoEdicion: modoEdicion,
      DevolverDatoFunct: setData,
      KeyDato: "DescripAlergia",
      DarDato: datosPersonales,
      Dato: Datos.DescripAlergia,
      Reiniciar: false
    }
  ];
  return (
    <div>
      <div>
        <button>
          <img
            src="/resources/save-black-18dp.svg"
            onClick={() => {
              setDatosPersonales(true);
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

        <h1>Datos personales</h1>
        {showdatosPersonales.map((prop) => (
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
      </div>
      <div>
        <h1>Datos de Afiliamiento</h1>
        {showdatosAfiliamiento.map((prop) => (
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
      </div>
      <div>
        <h1>Alimentacion</h1>
        <CampoTexto
          Title={showdatosAlimentacion[0].Title}
          ModoEdicion={showdatosAlimentacion[0].ModoEdicion}
          Dato={showdatosAlimentacion[0].Dato}
          DevolverDatoFunct={showdatosAlimentacion[0].DevolverDatoFunct}
          DarDato={showdatosAlimentacion[0].DarDato}
          KeyDato={showdatosAlimentacion[0].KeyDato}
          Reiniciar={showdatosAlimentacion[0].Reiniciar}
        />
        <CampoGranTexto
          Title={showdatosAlimentacion[1].Title}
          ModoEdicion={showdatosAlimentacion[1].ModoEdicion}
          Dato={showdatosAlimentacion[1].Dato}
          DevolverDatoFunct={showdatosAlimentacion[1].DevolverDatoFunct}
          DarDato={showdatosAlimentacion[1].DarDato}
          KeyDato={showdatosAlimentacion[1].KeyDato}
          Reiniciar={showdatosAlimentacion[1].Reiniciar}
        />
      </div>
      <div>
        <h1>Datos Medicos</h1>
        {showdatosMedicos.map((prop) => (
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
      </div>
      <div>
        <MaterialTable
          data={datosTablaSeguimiento}
          columns={Columnas}
          title="Tabla Seguimiento"
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  let y = {};
                  console.log(newData);
                  y = {
                    //   Cliente: newData.Cliente,
                    Descripcion: newData.Descripcion,
                    Fecha: newData.Fecha,
                    ViaContacto: newData.ViaContacto,
                    IdCliente: detalleCliente
                  };
                  console.log(y);
                  fetch(`http://localhost:3000/api/cliente/seguimiento`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      data: y,
                      accion: "create"
                    })
                  })
                    .then((r) => r.json())
                    .then((data) => {
                      alert(data.message);
                    });
                  setDatosTablaSeguimiento([...datosTablaSeguimiento, newData]);
                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataUpdate = [...datosTablaSeguimiento];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  setDatosEditables([...dataUpdate]);

                  fetch(`http://localhost:3000/api/cliente/seguimiento`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      idProducto: dataUpdate[index].IdSeguimiento,
                      data: dataUpdate[index],
                      accion: "update"
                    })
                  })
                    .then((r) => r.json())
                    .then((data) => {
                      alert(data.message);
                    });

                  resolve();
                }, 1000);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...datosTablaSeguimiento];
                  const index = oldData.tableData.id;

                  console.log(dataDelete[index]);
                  console.log(dataDelete[index].IdProductoHotel);

                  fetch(`http://localhost:3000/api/cliente/seguimiento`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      idProducto: dataDelete[index].IdSeguimiento,
                      accion: "delete"
                    })
                  })
                    .then((r) => r.json())
                    .then((data) => {
                      alert(data.message);
                    });

                  dataDelete.splice(index, 1);
                  setDatosTablaSeguimiento([...dataDelete]);

                  resolve();
                }, 1000);
              })
          }}
          actions={[
            {
              icon: () => {
                return <img src="/resources/remove_red_eye-24px.svg" />;
              },
              tooltip: "Mostrar todo",
              onClick: (event, rowData) =>
                Router.push({
                  pathname: `/Clientes/Seguimiento/${rowData.IdSeguimiento}`
                })
            }
          ]}
          options={{
            actionsColumnIndex: -1
          }}
        />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  let Datos = [];
  let DatosSeguimiento = [];
  let idClienteFront = context.query.detalleCliente;

  // console.log(idClienteFront)

  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  /* Consulta para extraer los datos de Clientes */
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
    const collection = dbo.collection("Cliente");

    let result = await collection
      .find({})
      .project({
        _id: 0
      })
      .toArray();
    result.map((x) => {
      if (x.IdCliente == idClienteFront) {
        console.log("aca es ");
        Datos = x;
      }
    });
  } catch (error) {
    console.log("error - " + error);
  } finally {
    client.close();
  }
  /* Consulta para extraer los datos de Clientes */
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
    const collection = dbo.collection("Seguimiento");

    let result = await collection
      .find({})
      .project({
        _id: 0
      })
      .toArray();
    result.map((x) => {
      if (x.IdCliente == idClienteFront) {
        DatosSeguimiento.push(x);
      }
    });
  } catch (error) {
    console.log("error - " + error);
  } finally {
    client.close();
  }
  return {
    props: {
      Datos: Datos,
      DatosSeguimiento: DatosSeguimiento
    }
  };
}
