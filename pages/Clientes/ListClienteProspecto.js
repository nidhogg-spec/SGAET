import MaterialTable from "material-table";
import { MongoClient } from "mongodb";
import Router from "next/router";
import { withSSRContext } from 'aws-amplify'
import { useEffect, useState, createContext } from "react";

//Componentes
import AutoModal_v2 from "@/components/AutoModal_v2/AutoModal_v2";
import { Suspense } from "react";

/*
Campos de ClientesProspectos
 - IdClienteProspecto
 - NombreCompleto
 - TipoCliente
 - Estado
 - TipoDocumento
 - NroDocumento
 - ContactoCelular
 - ContactoEmail
 - Seguimiento
*/

export default function Home({ Datos, api_general }) {
  // let Display_out =false
  const [datosEditables, setDatosEditables] = useState(Datos);

  let Columnas = [
    { title: "ID", field: "IdClienteProspecto", hidden: true },
    { title: "Nombre completo", field: "NombreCompleto" },

    {
      title: "Tipo de Cliente",
      field: "TipoCliente",
      lookup: { Corporativo: "Corporativo", Directo: "Directo" },
    },
    {
      title: "Estado",
      field: "Estado",
      lookup: { Prospecto: "Prospecto", Cliente: "Cliente" },
    },
    {
      title: "Tipo de Documento",
      field: "TipoDocumento",
      lookup: { DNI: "DNI", RUC: "RUC" },
    },
    { title: "Nro Documento", field: "NroDocumento" },
  ];

  //------------------------------------------------
  const [Display, setDisplay] = useState(false);
  const [ModalData, setModalData] = useState({});
  const ModalDisplay = createContext([
    [{}, () => {}],
    [{}, () => {}],
  ]);
  const [Data, setData] = useState({});
  useEffect(() => {
    console.log("estoy en el donde quiero estar");
    console.log(ModalData)
    if (ModalData['IdClienteProspecto']) {
      console.log(ModalData);
      fetch(api_general, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "update",
          coleccion: "ClienteProspecto",
          query: { IdClienteProspecto: Data["IdClienteProspecto"] },
          data:ModalData,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
        });
    }
  }, [ModalData]);
  //------------------------------------------------

  return (
    <div>
      {/* <ConstrutorModal Display={Display} setDisplay={setDisplay} /> */}
      <ModalDisplay.Provider
          value={[
            [Display, setDisplay],
            [ModalData, setModalData],
          ]}
        >
          <AutoModal_v2
            Formulario={{
              id:Data['IdClienteProspecto'],
              title: "Datos de Cliente/Prospecto",
              secciones: [
                {
                  subTitle: "",
                  componentes: [
                    {
                      tipo: "texto",
                      Title: "Nombre completo",
                      KeyDato: "NombreCompleto",
                      Dato: Data["NombreCompleto"],
                    },
                    {
                      tipo: "selector",
                      Title: "Tipo de Cliente",
                      KeyDato: "TipoCliente",
                      Dato: Data["TipoCliente"],
                      SelectOptions: [
                        { texto: "Seleccion un Tipo de Cliente", value: null },
                        { texto: "Corporativo", value: "Corporativo" },
                        { texto: "Directo", value: "Directo" },
                      ],
                    },
                    {
                      tipo: "selector",
                      Title: "Estado",
                      KeyDato: "Estado",
                      Dato: Data["Estado"],
                      SelectOptions: [
                        { texto: "Seleccion un Estado", value: null },
                        { texto: "Prospecto", value: "Prospecto" },
                        { texto: "Cliente", value: "Cliente" },
                      ],
                    },
                    {
                      tipo: "selector",
                      Title: "Tipo de Documento",
                      KeyDato: "TipoDocumento",
                      Dato: Data["TipoDocumento"],
                      SelectOptions: [
                        { texto: "Seleccion un Tipo de Documento", value: null },
                        { texto: "DNI", value: "DNI" },
                        { texto: "RUC", value: "RUC" },
                      ],
                    },
                    {
                      tipo: "selector",
                      Title: "Tipo de Comision",
                      KeyDato: "TipoComision",
                      Dato: Data["TipoComision"],
                      SelectOptions: [
                        { texto: "Seleccion un Tipo de Comision", value: null },
                        { texto: "Fijo", value: "Fijo" },
                        { texto: "Porcentual", value: "Porcentual" },
                      ],
                    },
                    {
                      tipo: "money",
                      Title: "Comision",
                      KeyDato: "Comision",
                      Dato: Data["Comision"],
                    },
                    {
                      tipo: "texto",
                      Title: "Nro Documento",
                      KeyDato: "NroDocumento",
                      Dato: Data["NroDocumento"],
                    },
                    {
                      tipo: "tablaSimple",
                      Title: "Contacto",
                      KeyDato: "Contacto",
                      Dato: Data["Contacto"] || [],
                      columnas: [
                        { field: "NombreContac", title: "Nombre" },
                        { field: "Area", title: "Area" },
                        { field: "Numero", title: "Numero" },
                        { field: "Email", title: "Email" },
                      ],
                    },
                    {
                      tipo: "tablaSimple",
                      Title: "Seguimientos",
                      KeyDato: "Seguimiento",
                      Dato: Data["Seguimiento"] || [], //deber ser un [] - array - Sino todo explota
                      columnas: [
                        {
                          field: "Descripcion",
                          title: "Descripcion del seguimiento",
                        },
                        { field: "Fecha", title: "Fecha" },
                        { field: "ViaContacto", title: "Via de contacto" },
                        { field: "Problemas", title: "Problemas" },
                      ],
                    },
                  ],
                },
              ],
            }}
            ModalDisplay={ModalDisplay}
            IdDato={'IdClienteProspecto'}
            // APIpath={}
          />
        </ModalDisplay.Provider>
      <MaterialTable
        columns={Columnas}
        data={datosEditables}
        title="Clientes"
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                fetch(api_general, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    accion: "Insert",
                    coleccion: "ClienteProspecto",
                    keyId: "IdClienteProspecto",
                    Prefijo: "CP",
                    data: newData,
                  }),
                })
                  .then((r) => r.json())
                  .then((data) => {
                    alert(data.result);
                  });
                setDatosEditables([...datosEditables, newData]);
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...datosEditables];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setDatosEditables([...dataUpdate]);

                delete dataUpdate[index]._id;

                fetch(api_general, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    // idProducto: dataUpdate[index].IdCliente,
                    // data: dataUpdate[index],
                    // accion: "update",
                    accion: "update",
                    coleccion: "ClienteProspecto",
                    query: {
                      IdClienteProspecto: dataUpdate[index].IdClienteProspecto,
                    },
                    data: dataUpdate[index],
                  }),
                })
                  .then((r) => r.json())
                  .then((data) => {
                    alert(data.result);
                  });
                console.log(dataUpdate[index]);
                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...datosEditables];
                const index = oldData.tableData.id;

                fetch(api_general, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    // idProducto: dataDelete[index].IdCliente,
                    accion: "DeleteOne",
                    coleccion: "ClienteProspecto",
                    query: {
                      IdClienteProspecto: dataDelete[index].IdClienteProspecto,
                    },
                  }),
                })
                  .then((r) => r.json())
                  .then((data) => {
                    alert(data.result);
                  });

                dataDelete.splice(index, 1);
                setDatosEditables([...dataDelete]);

                resolve();
              }, 1000);
            }),
        }}
        actions={[
          {
            icon: () => {
              return <img src="/resources/remove_red_eye-24px.svg" />;
            },
            tooltip: "Mostrar todo",
            onClick: (event, rowData) =>{
              let dt = datosEditables.find((value)=>{
                return value['IdClienteProspecto']==rowData['IdClienteProspecto']
              })
              console.log(dt)
              setData(dt)
              setDisplay(true)
            }
              // Router.push({
              //   pathname: `/Clientes/ClienteProspecto/${rowData.IdClienteProspecto}`,
              // }),
              // setDisplay(true)
              
          },
        ]}
        options={{
          actionsColumnIndex: -1,
        }}
      />
    </div>
  );
}
export async function getServerSideProps({ req, res }) {
  const api_general = process.env.API_DOMAIN + "/api/general";
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  let Datos = [];
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const { Auth } = withSSRContext({ req })
  try {
    const user = await Auth.currentAuthenticatedUser()
  } catch (err) {
    res.writeHead(302, { Location: '/' })
    res.end()
  }

  try {
    await client.connect();
    let collection = client.db(dbName).collection("ClienteProspecto");
    let result = await collection.find({}).project({ _id: 0 }).toArray();
    // DatosProveedor = JSON.stringify(result);

    result._id = JSON.stringify(result._id);
    Datos = result;
  } catch (error) {
    console.log("Error cliente Mongo 1 => " + error);
  } finally {
    client.close();
  }

  return {
    props: {
      Datos: Datos,
      api_general: api_general,
    },
  };
}

const ConstrutorModal = ({ Display, setDisplay }) => {
  
  return (
    <>
      {/* <Suspense fallback={<span>Cargando Data ...</span>}> */}
        
      {/* </Suspense> */}
    </>
  );
};
