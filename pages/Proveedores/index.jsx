import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { withSSRContext } from 'aws-amplify'
import { MongoClient } from "mongodb";
import { resetServerContext } from "react-beautiful-dnd";

//Componentes
import AutoModal from "@/components/AutoModal/AutoModal";
import MaterialTable from "material-table";
import BotonAnadir from "@/components/BotonAnadir/BotonAnadir";
resetServerContext();

export default function Home({ Datos, APIpath }) {
  //Funciones
  const AccionBoton = () => {
    setModalDisplay(true);
  };
  const DevolverEstructuraFormulario = (FormuData = {}) => {
    return {
      title: "Proveedor de Productos/Servicios",
      secciones: [
        {
          subTitle: "Datos de Empresa",
          componentes: [
            {
              tipo: "selector",
              Title: "Tipo",
              KeyDato: "tipo",
              Dato: FormuData.tipo || "Hotel",
              SelectOptions: [
                { value: "Hotel", texto: "Hotel" },
                { value: "Agencia", texto: "Agencia" },
                { value: "Guia", texto: "Guia" },
                { value: "TransporteTerrestre", texto: "Transporte Terrestre" },
                { value: "Restaurante", texto: "Restaurante" },
                { value: "SitioTuristico", texto: "Sitio Turistico" },
                {
                  value: "TransporteFerroviario",
                  texto: "Transporte Ferroviario",
                },
                { value: "Otro", texto: "Otro" },
              ],
            },
            {
              tipo: "texto",
              Title: "Razon Social",
              KeyDato: "RazonSocial",
              Dato: FormuData.RazonSocial || "",
            },
            {
              tipo: "texto",
              Title: "Nombre Comercial",
              KeyDato: "nombre",
              Dato: FormuData.nombre || "",
            },
            {
              tipo: "selector",
              Title: "Tipo de Documento",
              KeyDato: "TipoDocumento",
              Dato: FormuData.TipoDocumento || "RUC",
              SelectOptions: [
                { value: "RUC", texto: "RUC" },
                { value: "DNI", texto: "DNI" },
                { value: "CarnetExtranjeria", texto: "Carnet de Extranjeria" },
              ],
            },
            {
              tipo: "texto",
              Title: "Numero de Documento",
              KeyDato: "NroDocumento",
              Dato: FormuData.NroDocumento || "",
            },
            {
              tipo: "texto",
              Title: "Domicilio fiscal",
              KeyDato: "DireccionFiscal",
              Dato: FormuData.DomicilioFiscal || "",
            },
            {
              tipo: "selector",
              Title: "Tipo de moneda",
              KeyDato: "TipoMoneda",
              Dato: FormuData.TipoMoneda || "Dolar",
              SelectOptions: [
                { value: "Sol", texto: "Soles" },
                { value: "Dolar", texto: "Dolares" },
              ],
            },
            {
              tipo: "texto",
              Title: "Numero de telefono o celular principal",
              KeyDato: "NumeroPrincipal",
              Dato: FormuData.NumeroPrincipal || "",
            },
            {
              tipo: "texto",
              Title: "Email principal",
              KeyDato: "EmailPrincipal",
              Dato: FormuData.EmailPrincipal || "",
            },
            {
              tipo: "selector",
              Title: "Estado",
              KeyDato: "Encuesta",
              Dato: FormuData.Estado || 1,
              SelectOptions: [
                { value: 0, texto: "Inactivo" },
                { value: 1, texto: "Activo" },
              ],
            },
          ],
        },
        {
          subTitle: "Representantante Legal",
          componentes: [
            {
              tipo: "texto",
              Title: "Nombre del Gerente General",
              KeyDato: "NombreRepresentanteLegal",
              Dato: FormuData.NombreRepresentanteLegal || "",
            },
            {
              tipo: "texto",
              Title: "Numero del documento de identidad",
              KeyDato: "NroDocIdentRepresentanteLegal",
              Dato: FormuData.NroDocIdentRepresentanteLegal || "",
            },
          ],
        },
        {
          subTitle: "Otros datos",
          componentes: [
            // {
            //   tipo: "selector",
            //   Title: "Numero de Estrellas",
            //   KeyDato: "NEstrellas",
            //   Dato: FormuData.NEstrellas || 0,
            //   SelectOptions: [
            //     { value: 0, texto: "0" },
            //     { value: 1, texto: "1" },
            //     { value: 2, texto: "2" },
            //     { value: 3, texto: "3" },
            //     { value: 4, texto: "4" },
            //     { value: 5, texto: "5" },
            //   ],
            // },
            {
              tipo: "texto",
              Title: "Enlace a documento brindado",
              KeyDato: "EnlaceDocumento",
              Dato: FormuData.EnlaceDocumento || "",
            },
          ],
        },
        {
          subTitle: "Datos de Contacto",
          componentes: [
            {
              tipo: "texto",
              Title: "Web",
              KeyDato: "Web",
              Dato: FormuData.Web || "",
            },
            {
              tipo: "tablaSimple",
              Title: "Contactos",
              KeyDato: "Contacto",
              Dato: FormuData.Contacto || [], //deber ser un [] - array - Sino todo explota
              columnas: [
                { field: "NombreContac", title: "Nombre del Contacto" },
                { field: "Area", title: "Area de trabajo" },
                { field: "Numero", title: "Telefono/Celular" },
                { field: "Email", title: "Email" },
              ],
            },
          ],
        },
        {
          subTitle: "Datos de Cuentas Bancarias",
          componentes: [
            {
              tipo: "tablaSimple",
              Title: "",
              KeyDato: "DatosBancarios",
              Dato: FormuData.DatosBancarios || [], //deber ser un [] - array - Sino todo explota
              columnas: [
                { field: "Banco", title: "Banco" },
                { field: "Beneficiario", title: "Beneficiario" },
                { field: "TipoCuenta", title: "Tipo de Cuenta Bancaria" },
                {
                  field: "TipoDocumento",
                  title: "Tipo de Documento",
                  lookup: { RUC: "RUC", DNI: "DNI" },
                },
                { field: "NumDoc", title: "Numero de Documento" },
                { field: "Cuenta", title: "Numero de Cuenta" },
                { field: "CCI", title: "CCI" },
              ],
            },
          ],
        },
      ],
    };
  };
  const ReiniciarDataFunction = () => {
    setReiniciarData(true);
  };

  //Variables
  const router = useRouter();
  const [ModalDisplay, setModalDisplay] = useState(false);
  const [FormularioCreacion, setFormularioCreacion] = useState(
    DevolverEstructuraFormulario({
      nombre: "",
      RazonSocial: "",
      tipo: "Hotel",
      TipoDocumento: "RUC",
      NroDocumento: "",
      TipoMoneda: "Dolar",
      GerenteGeneral: "",
      NEstrellas: 0,
      Estado: 1,
      EnlaceDocumento: "",
      DireccionFiscal: "",
      Web: "",
      NumContac: [],
      Email: [],
      DatosBancarios: [],
    })
  );
  const [IdDato, setIdDato] = useState();
  const [ReiniciarData, setReiniciarData] = useState(false);
  // const [Display, setDisplay] = useState(false);
  // const [Formulario, setFormulario] = useState(FormularioCreacion);
  const [TablaDatos, setTablaDatos] = useState(Datos);

  // Hooks
  useEffect(async () => {
    if (ReiniciarData == true) {
      let ActuTablaDatos = [];
      let errorGetData = true;
      do {
        try {
          await fetch(APIpath)
            .then((r) => r.json())
            .then((data) => {
              // console.log(data)
              data.data.map((datosResult) => {
                ActuTablaDatos.push({
                  id: datosResult.IdProveedor,
                  proveedor: datosResult.nombre,
                  ubicacion: datosResult.DireccionFiscal,
                  tipo: datosResult.tipo,
                });
              });
              setTablaDatos(ActuTablaDatos);
              errorGetData = false;
            });
        } catch (error) {
          console.log(error);
        }
      } while (errorGetData);

      setReiniciarData(false);
    }
  }, [ReiniciarData]);
  const HandleAnadir = ()=>{
    router.push('/Proveedores/NuevoProveedor')
  }
  return (
    <div>
      <div>
        <h1 className="Titulo">Lista de Proveedores</h1>
        {/* <AutoModal
          Formulario={FormularioCreacion} //debe ser diferente por lo de formulario vacio
          IdDato={IdDato}
          APIpath={APIpath}
          ReiniciarData={ReiniciarDataFunction}
          Modo={"creacion"}
        /> */}
        <BotonAnadir Accion={HandleAnadir}/>
      </div>
      {/* <Modal Display= {ModalDisplay} MostrarModal={MostrarModal} APIpath={APIpath} TipoModal={"Proveedores"}/> */}
      <div className="">
        <MaterialTable
          columns={[
            { title: "ID", field: "id", filtering: false, hidden: true },
            {
              title: "Nombre Comercial",
              field: "proveedor",
              filtering: false,
            },
            {
              title: "Ubicacion",
              field: "ubicacion",
              filtering: false,
            },
            {
              title: "Tipo de Proovedor",
              field: "tipo",
              lookup: {
                Hotel: "Hotel",
                Agencia: "Agencia",
                Guia: "Guia",
                TransporteTerrestre: "Transporte Terrestre",
                Restaurante: "Restaurante",
                SitioTuristico: "Sitio Turistico",
                TransporteFerroviario: "Transporte Ferroviario",
                Otro: "Otro",
              },
            },
          ]}
          data={TablaDatos}
          title={null}
          actions={[
            {
              icon: () => {
                return <img src="/resources/delete-black-18dp.svg" />;
              },
              tooltip: "Delete Proveedor",
              onClick: (event, rowData) => {
                fetch(APIpath, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    IdProveedor: rowData.id,
                    accion: "delete",
                  }),
                })
                  .then((r) => r.json())
                  .then((data) => {
                    alert(data.message);
                  });
              },
            },
            (rowData) => ({
              icon: () => {
                return (
                  <Link href={`/Proveedores/${rowData.tipo}/${rowData.id}`}>
                    <a>
                      <img src="/resources/remove_red_eye-24px.svg" />
                    </a>
                  </Link>
                );
              },
              tooltip:'Ver detalle de proveedor',
              onClick: () => {
                router.push(`/Proveedores/${rowData.tipo}/${rowData.id}`);
              },
            }),
          ]}
          options={{
            actionsColumnIndex: -1,
            filtering: true,
          }}
        />
      </div>
    </div>
  );
}
export async function getServerSideProps({ req, res }) {
  const APIpath = process.env.API_DOMAIN + "/api/proveedores/listaProveedores";
  //---------------------------Validacion del Login-----------------------------//
  const { Auth } = withSSRContext({ req })
  try {
    const user = await Auth.currentAuthenticatedUser()
  } catch (err) {
    res.writeHead(302, { Location: '/' })
    res.end()
  }
  //----------------------Obtener datos de proveedores-------------------------------------------
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  const coleccion = "Proveedor";
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect()
  const dbo = client.db(dbName);
  const collection = dbo.collection("Proveedor");
  let data = await collection.find({}).toArray();
  let Datos = [];
  data.map(datosResult=>{
    Datos.push({
      id: datosResult.IdProveedor,
      proveedor: datosResult.nombre,
      ubicacion: datosResult.DireccionFiscal,
      tipo: datosResult.tipo,
    });
  })
  client.close()
  //----------------------------------------------------------------------------
  return {
    props: {
      Datos: Datos,
      APIpath: APIpath,
    },
  };
}
